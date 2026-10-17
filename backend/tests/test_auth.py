def test_register_student(client):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "newstudent@college.edu",
            "password": "securepassword123",
            "full_name": "Jordan Smith",
            "role": "student",
            "major": "Electrical Engineering",
            "student_grad_year": 2026,
            "career_goal": "Robotics Software Developer",
            "target_industry": "Technology",
            "skills_to_learn": "C++, ROS, Python"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "newstudent@college.edu"
    assert data["user"]["role"] == "student"
    assert data["user"]["student_profile"]["major"] == "Electrical Engineering"

def test_register_duplicate_email_fails(client, test_student):
    response = client.post(
        "/api/auth/register",
        json={
            "email": test_student.email,
            "password": "anotherpassword",
            "full_name": "Duplicate User",
            "role": "student"
        }
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_login_success(client, test_student):
    response = client.post(
        "/api/auth/login",
        json={
            "email": test_student.email,
            "password": "password123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["id"] == test_student.id

def test_login_wrong_password_fails(client, test_student):
    response = client.post(
        "/api/auth/login",
        json={
            "email": test_student.email,
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]

def test_get_current_user_profile(client, test_student, student_auth_headers):
    response = client.get("/api/auth/me", headers=student_auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == test_student.id
    assert data["email"] == test_student.email
    assert data["student_profile"] is not None

def test_unauthorized_access_fails(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401
