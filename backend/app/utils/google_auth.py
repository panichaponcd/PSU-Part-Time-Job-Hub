import re
from typing import Optional, Dict, Any
from fastapi import HTTPException, status
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app.config import GOOGLE_CLIENT_ID, ALLOWED_PSU_DOMAINS

# PSU Phuket faculty codes encoded in digits 4-5 (0-indexed [3:5]) of the 10-digit Student ID
PSU_PHUKET_FACULTY_CODES: Dict[str, str] = {
    "05": "Faculty of Hospitality and Tourism",
    "06": "College of Computing",
    "07": "Faculty of International Studies",
    "08": "Faculty of Technology and Environment",
}

# Known PSU Phuket program/major codes encoded in digits 4-7 (0-indexed [3:7])
PSU_PHUKET_MAJOR_CODES: Dict[str, str] = {
    "0611": "Computing",
    "0612": "Digital Business",
    "0613": "Digital Engineering",
    "0614": "Artificial Intelligence and System Engineering",
}

STUDENT_EMAIL_REGEX = re.compile(r"^s?(\d{10})@")


def verify_google_id_token(credential: str) -> Dict[str, Any]:
    """
    Cryptographically verify a Google Identity Services ID token (JWT).
    Checks signature against Google's public certs, audience (GOOGLE_CLIENT_ID),
    expiration, and email_verified flag.
    """
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google Sign-In is not configured on the server (missing GOOGLE_CLIENT_ID)."
        )

    try:
        idinfo = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            GOOGLE_CLIENT_ID,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired Google token: {exc}"
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to verify Google token with Google servers. Please try again."
        )

    if not idinfo.get("email_verified", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your Google email address is not verified."
        )

    return idinfo


def infer_faculty_from_student_id(student_id: str) -> str:
    """Infer PSU Phuket faculty from digits 4-5 of a 10-digit PSU Student ID."""
    if len(student_id) == 10 and student_id.isdigit():
        faculty_code = student_id[3:5]
        return PSU_PHUKET_FACULTY_CODES.get(faculty_code, "")
    return ""


def infer_major_from_student_id(student_id: str) -> str:
    """Infer PSU Phuket major/program from digits 4-7 of a 10-digit PSU Student ID."""
    if len(student_id) == 10 and student_id.isdigit():
        program_code = student_id[3:7]
        return PSU_PHUKET_MAJOR_CODES.get(program_code, "")
    return ""


def parse_psu_identity(email: str) -> Dict[str, Optional[str]]:
    """
    Validate that an email belongs to an official PSU domain and extract
    the immutable 10-digit Student ID if present.
    """
    normalized = email.lower().strip()
    if not any(normalized.endswith(domain) for domain in ALLOWED_PSU_DOMAINS):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only PSU university Google accounts (@phuket.psu.ac.th or @psu.ac.th) are allowed."
        )

    match = STUDENT_EMAIL_REGEX.match(normalized)
    if match:
        student_id = match.group(1)
        return {
            "email": normalized,
            "is_student_email": True,
            "student_id": student_id,
            "inferred_faculty": infer_faculty_from_student_id(student_id),
            "inferred_major": infer_major_from_student_id(student_id),
        }

    return {
        "email": normalized,
        "is_student_email": False,
        "student_id": None,
        "inferred_faculty": "",
        "inferred_major": "",
    }
