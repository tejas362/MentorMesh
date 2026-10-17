import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db
from app.auth import create_access_token, hash_password
from app.models import User, AlumniProfile, StudentProfile

# Use an in-memory SQLite database for test isolation
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture
def test_student(db_session):
    user = User(
        email="test_student@university.edu",
        hashed_password=hash_password("password123"),
        full_name="Samantha Ray",
        role="student",
        headline="Aspiring AI Engineer",
        bio="Junior studying Computer Science"
    )
    db_session.add(user)
    db_session.flush()

    student_prof = StudentProfile(
        user_id=user.id,
        major="Computer Science",
        graduation_year=2026,
        career_goal="AI Research Engineer",
        target_industry="Technology",
        skills_to_learn="Python, Machine Learning, PyTorch, Cloud Architecture"
    )
    db_session.add(student_prof)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def test_alumni(db_session):
    user = User(
        email="test_alumni@university.edu",
        hashed_password=hash_password("password123"),
        full_name="Daniel Chen",
        role="alumni",
        headline="Principal ML Engineer at AlphaTech",
        bio="10 years leading deep learning and recommendation models."
    )
    db_session.add(user)
    db_session.flush()

    alumni_prof = AlumniProfile(
        user_id=user.id,
        company="AlphaTech",
        current_role="Principal ML Engineer",
        industry="Technology",
        graduation_year=2017,
        degree="B.S. in Computer Science",
        location="San Francisco, CA",
        years_of_experience=9,
        is_available_for_mentorship=True,
        mentoring_interests="System Design, ML Interviews, Career Growth",
        skills="Python, PyTorch, Machine Learning, Distributed Systems, Cloud Architecture"
    )
    db_session.add(alumni_prof)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def student_auth_headers(test_student):
    token = create_access_token(data={"sub": str(test_student.id), "role": test_student.role})
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def alumni_auth_headers(test_alumni):
    token = create_access_token(data={"sub": str(test_alumni.id), "role": test_alumni.role})
    return {"Authorization": f"Bearer {token}"}
