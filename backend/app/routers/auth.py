import secrets
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import ALLOW_MANUAL_REGISTRATION, ADMIN_EMAILS
from app.models.user import User, Student
from app.schemas.auth import (
    LoginRequest, GoogleLoginRequest, LoginResponse,
    RefreshRequest, RefreshResponse,
    RegisterRequest, MeResponse,
    UserSummary, StudentSummary
)
from app.utils.security import (
    verify_password, hash_password,
    create_access_token, create_refresh_token, decode_token
)
from app.utils.google_auth import verify_google_id_token, parse_psu_identity
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


def _build_login_response(user: User, is_new_user: bool = False) -> LoginResponse:
    is_admin = user.is_admin
    role = "ADMIN" if is_admin else "STUDENT"

    token_data = {
        "user_id": user.id,
        "username": user.username,
        "role": role,
    }

    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    student_data = None
    if not is_admin and user.student_profile:
        sp = user.student_profile
        student_data = StudentSummary(
            id=sp.id,
            student_id=sp.student_id,
            first_name=sp.first_name,
            last_name=sp.last_name,
            faculty=sp.faculty,
            major=sp.major
        )

    return LoginResponse(
        access=access_token,
        refresh=refresh_token,
        role=role,
        user=UserSummary(
            id=user.id,
            username=user.username,
            email=user.email,
            is_admin=is_admin
        ),
        student=student_data,
        is_new_user=is_new_user,
    )

@router.post("/login/", response_model=LoginResponse)
@router.post("/login", response_model=LoginResponse, include_in_schema=False)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    identifier = req.identifier.strip()
    password = req.password

    if not identifier or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide identifier and password."
        )

    user = None
    if "@" in identifier:
        user = db.query(User).filter(User.email.ilike(identifier)).first()
    else:
        user = db.query(User).filter(User.username == identifier).first()

    if not user or not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is inactive."
        )

    # Update last_login
    user.last_login = datetime.utcnow()
    db.commit()

    return _build_login_response(user, is_new_user=False)


@router.post("/google/", response_model=LoginResponse)
@router.post("/google", response_model=LoginResponse, include_in_schema=False)
def google_login(req: GoogleLoginRequest, db: Session = Depends(get_db)):
    if not req.credential or not req.credential.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing Google credential token."
        )

    idinfo = verify_google_id_token(req.credential.strip())
    raw_email = idinfo.get("email", "")
    identity = parse_psu_identity(raw_email)
    email = identity["email"]
    given_name = (idinfo.get("given_name") or "").strip()
    family_name = (idinfo.get("family_name") or "").strip()

    is_new_user = False

    if identity["is_student_email"]:
        student_id = identity["student_id"]
        # Match existing account by immutable student_id OR email
        user = (
            db.query(User)
            .filter((User.username == student_id) | (User.email.ilike(email)))
            .first()
        )

        if not user:
            is_new_user = True
            user = User(
                username=student_id,
                email=email,
                password=hash_password(secrets.token_urlsafe(32)),
                first_name=given_name or student_id,
                last_name=family_name,
                is_staff=False,
                is_superuser=False,
                is_active=True,
                date_joined=datetime.utcnow(),
                last_login=datetime.utcnow(),
            )
            db.add(user)
            db.flush()

            new_student = Student(
                user_id=user.id,
                student_id=student_id,
                first_name=given_name or student_id,
                last_name=family_name,
                faculty=identity["inferred_faculty"] or "",
                major="",
                religion="",
                allergies="",
            )
            db.add(new_student)
            db.commit()
            db.refresh(user)
        else:
            if not user.is_active:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Account is inactive."
                )
            # Ensure student profile exists for non-admin users
            if not user.is_admin and not user.student_profile:
                db.add(Student(
                    user_id=user.id,
                    student_id=student_id,
                    first_name=given_name or user.first_name or student_id,
                    last_name=family_name or user.last_name,
                    faculty=identity["inferred_faculty"] or "",
                    major="",
                    religion="",
                    allergies="",
                ))
            user.last_login = datetime.utcnow()
            db.commit()
            db.refresh(user)
    else:
        # Non-student PSU domain email (e.g. staff / advisor)
        user = db.query(User).filter(User.email.ilike(email)).first()
        if not user:
            if email in ADMIN_EMAILS:
                is_new_user = True
                username_prefix = email.split("@")[0]
                user = User(
                    username=username_prefix,
                    email=email,
                    password=hash_password(secrets.token_urlsafe(32)),
                    first_name=given_name or username_prefix,
                    last_name=family_name,
                    is_staff=True,
                    is_superuser=False,
                    is_active=True,
                    date_joined=datetime.utcnow(),
                    last_login=datetime.utcnow(),
                )
                db.add(user)
                db.commit()
                db.refresh(user)
            else:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Non-student PSU staff emails require administrator whitelisting. Please sign in with your staff credentials or contact the system administrator."
                )
        else:
            if not user.is_active:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Account is inactive."
                )
            user.last_login = datetime.utcnow()
            db.commit()
            db.refresh(user)

    return _build_login_response(user, is_new_user=is_new_user)


@router.post("/refresh/", response_model=RefreshResponse)
@router.post("/refresh", response_model=RefreshResponse, include_in_schema=False)
def refresh_token(req: RefreshRequest, db: Session = Depends(get_db)):
    payload = decode_token(req.refresh)
    if not payload or payload.get("token_type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token."
        )

    user_id = payload.get("user_id")
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive."
        )

    is_admin = user.is_admin
    token_data = {
        "user_id": user.id,
        "username": user.username,
        "role": "ADMIN" if is_admin else "STUDENT",
    }
    new_access_token = create_access_token(token_data)
    return RefreshResponse(access=new_access_token)


@router.get("/me/", response_model=MeResponse)
@router.get("/me", response_model=MeResponse, include_in_schema=False)
def me(current_user: User = Depends(get_current_user)):
    is_admin = current_user.is_admin
    role = "ADMIN" if is_admin else "STUDENT"

    student_data = None
    if not is_admin and current_user.student_profile:
        sp = current_user.student_profile
        student_data = StudentSummary(
            id=sp.id,
            student_id=sp.student_id,
            first_name=sp.first_name,
            last_name=sp.last_name,
            faculty=sp.faculty,
            major=sp.major
        )

    return MeResponse(
        role=role,
        user=UserSummary(
            id=current_user.id,
            username=current_user.username,
            email=current_user.email,
            is_admin=is_admin
        ),
        student=student_data
    )


@router.post("/register/", status_code=status.HTTP_201_CREATED)
@router.post("/register", status_code=status.HTTP_201_CREATED, include_in_schema=False)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if not ALLOW_MANUAL_REGISTRATION:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Manual registration is disabled. Please sign in with your PSU Google Account."
        )

    email = req.email.lower().strip()
    if not (email.endswith("@phuket.psu.ac.th") or email.endswith("@psu.ac.th")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PSU email addresses are allowed (@phuket.psu.ac.th or @psu.ac.th)."
        )

    student_id = req.student_id.strip()
    if db.query(User).filter(User.username == student_id).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student ID already registered."
        )

    if db.query(User).filter(User.email == email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered."
        )

    new_user = User(
        username=student_id,
        email=email,
        password=hash_password(req.password),
        first_name=req.first_name.strip(),
        last_name=req.last_name.strip(),
        is_staff=False,
        is_superuser=False,
        is_active=True,
        date_joined=datetime.utcnow()
    )
    db.add(new_user)
    db.flush()

    new_student = Student(
        user_id=new_user.id,
        student_id=student_id,
        first_name=req.first_name.strip(),
        last_name=req.last_name.strip(),
        faculty=req.faculty.strip(),
        major=req.major.strip(),
        religion=req.religion or "",
        allergies=req.allergies or "",
    )
    db.add(new_student)
    db.commit()

    return {"message": "Registration successful. You can now sign in."}
