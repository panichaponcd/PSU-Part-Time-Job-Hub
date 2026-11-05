from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, Student
from app.schemas.auth import (
    LoginRequest, LoginResponse,
    RefreshRequest, RefreshResponse,
    RegisterRequest, MeResponse,
    UserSummary, StudentSummary
)
from app.utils.security import (
    verify_password, hash_password,
    create_access_token, create_refresh_token, decode_token
)
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

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
        student=student_data
    )


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
