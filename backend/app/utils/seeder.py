import json
import argparse
from datetime import datetime, date, time
from pathlib import Path
from app.config import BASE_DIR
from app.database import SessionLocal, Base, engine
from app.models import User, Student, Job, WorkSchedule, Application, Evaluation

def parse_datetime(val):
    if not val:
        return None
    val = val.replace("Z", "+00:00")
    try:
        return datetime.fromisoformat(val)
    except Exception:
        return datetime.utcnow()

def parse_date(val):
    if not val:
        return None
    return date.fromisoformat(val)

def parse_time(val):
    if not val:
        return None
    parts = val.split(":")
    return time(int(parts[0]), int(parts[1]), int(parts[2]) if len(parts) > 2 else 0)

def load_seed_fixture(json_path: str = "seed_data.json", clear: bool = True):
    path = Path(json_path)
    if not path.is_absolute():
        path = BASE_DIR / path

    if not path.exists():
        print(f"Error: Fixture file not found at {path}")
        return False

    with open(path, "r", encoding="utf-8") as f:
        records = json.load(f)

    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        if clear:
            print("Clearing existing records...")
            db.query(Evaluation).delete()
            db.query(Application).delete()
            db.query(WorkSchedule).delete()
            db.query(Job).delete()
            db.query(Student).delete()
            db.query(User).delete()
            db.commit()

        # Group records by model
        order = ["auth.user", "jobs.student", "jobs.job", "jobs.workschedule", "jobs.application", "jobs.evaluation"]
        by_model = {m: [] for m in order}
        for item in records:
            m = item.get("model")
            if m in by_model:
                by_model[m].append(item)

        # 1. Users
        print(f"Loading {len(by_model['auth.user'])} Users...")
        for item in by_model["auth.user"]:
            f = item["fields"]
            db.merge(User(
                id=item["pk"],
                username=f["username"],
                password=f["password"],
                email=f.get("email", ""),
                first_name=f.get("first_name", ""),
                last_name=f.get("last_name", ""),
                is_staff=f.get("is_staff", False),
                is_superuser=f.get("is_superuser", False),
                is_active=f.get("is_active", True),
                last_login=parse_datetime(f.get("last_login")),
                date_joined=parse_datetime(f.get("date_joined")) or datetime.utcnow()
            ))
        db.commit()

        # 2. Students
        print(f"Loading {len(by_model['jobs.student'])} Students...")
        for item in by_model["jobs.student"]:
            f = item["fields"]
            db.merge(Student(
                id=item["pk"],
                user_id=f["user"],
                first_name=f["first_name"],
                last_name=f["last_name"],
                student_id=f["student_id"],
                faculty=f["faculty"],
                major=f["major"],
                religion=f.get("religion", ""),
                allergies=f.get("allergies", ""),
                student_card_image=f.get("student_card_image")
            ))
        db.commit()

        # 3. Jobs
        print(f"Loading {len(by_model['jobs.job'])} Jobs...")
        for item in by_model["jobs.job"]:
            f = item["fields"]
            db.merge(Job(
                id=item["pk"],
                title=f["title"],
                organization_name=f["organization_name"],
                description=f["description"],
                location_type=f["location_type"],
                job_type=f["job_type"],
                compensation_amount=f["compensation_amount"],
                required_amount=f["required_amount"],
                status=f.get("status", "OPEN"),
                academic_term=f["academic_term"],
                academic_year=f["academic_year"],
                poster_image_url=f.get("poster_image_url"),
                line_group_url=f.get("line_group_url"),
                is_active=f.get("is_active", True),
                created_at=parse_datetime(f.get("created_at")) or datetime.utcnow()
            ))
        db.commit()

        # 4. Work Schedules
        print(f"Loading {len(by_model['jobs.workschedule'])} Schedules...")
        for item in by_model["jobs.workschedule"]:
            f = item["fields"]
            db.merge(WorkSchedule(
                id=item["pk"],
                job_id=f["job"],
                date=parse_date(f["date"]),
                start_time=parse_time(f["start_time"]),
                end_time=parse_time(f["end_time"])
            ))
        db.commit()

        # 5. Applications
        print(f"Loading {len(by_model['jobs.application'])} Applications...")
        for item in by_model["jobs.application"]:
            f = item["fields"]
            db.merge(Application(
                id=item["pk"],
                job_id=f["job"],
                student_id=f["student"],
                status=f.get("status", "APPROVED"),
                application_date=parse_datetime(f.get("application_date")) or datetime.utcnow()
            ))
        db.commit()

        # 6. Evaluations
        print(f"Loading {len(by_model['jobs.evaluation'])} Evaluations...")
        for item in by_model["jobs.evaluation"]:
            f = item["fields"]
            db.merge(Evaluation(
                id=item["pk"],
                application_id=f["application"],
                punctuality_rating=f.get("punctuality_rating", 5),
                responsibility_rating=f.get("responsibility_rating", 5),
                grooming_rating=f.get("grooming_rating", 5),
                quality_rating=f.get("quality_rating", 5),
                comment=f.get("comment", ""),
                result_status=f.get("result_status", "PASS"),
                evaluation_date=parse_datetime(f.get("evaluation_date")) or datetime.utcnow()
            ))
        db.commit()

        print("Seeding completed successfully with zero errors!")
        return True
    except Exception as e:
        db.rollback()
        print(f"Seeding failed: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed database fixture using SQLAlchemy")
    parser.add_argument("--fixture", default="seed_data.json", help="Path to json fixture file")
    parser.add_argument("--no-clear", action="store_true", help="Do not clear existing records before loading")
    args = parser.parse_args()

    load_seed_fixture(json_path=args.fixture, clear=not args.no_clear)
