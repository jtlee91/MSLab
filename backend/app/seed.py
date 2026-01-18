"""Seed script to populate initial data."""

import bcrypt

from app.database import SessionLocal
from app.models import Professor, Rack, User


def hash_password(password: str) -> str:
    """Hash password using bcrypt."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def seed_database():
    """Populate database with initial data."""
    db = SessionLocal()

    try:
        # Check if data already exists
        if db.query(User).first():
            print("Database already has data. Skipping seed.")
            return

        # Create admin user
        admin = User(
            email="admin@mslab.com",
            password_hash=hash_password("admin1234"),
            name="관리자",
            role="admin",
        )
        db.add(admin)

        # Create 3 racks (8x8 grid each)
        racks = [
            Rack(name="랙1", rows=8, columns=8, display_order=1),
            Rack(name="랙2", rows=8, columns=8, display_order=2),
            Rack(name="랙3", rows=8, columns=8, display_order=3),
        ]
        db.add_all(racks)

        # Create sample professors with distinct colors
        professors = [
            Professor(name="김교수", student_name="김학생", contact="010-1234-5678", color_code="#EF4444"),
            Professor(name="이교수", student_name="이학생", contact="010-2345-6789", color_code="#3B82F6"),
            Professor(name="박교수", student_name="박학생", contact="010-3456-7890", color_code="#10B981"),
        ]
        db.add_all(professors)

        db.commit()
        print("✅ Seed data created successfully!")
        print(f"   - Admin user: admin@mslab.com / admin1234")
        print(f"   - {len(racks)} racks created")
        print(f"   - {len(professors)} professors created")

    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
