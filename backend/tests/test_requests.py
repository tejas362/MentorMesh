def test_create_mentorship_request(client, test_student, test_alumni, student_auth_headers):
    response = client.post(
        "/api/requests",
        json={
            "alumni_id": test_alumni.id,
            "topic": "Career Advice & Code Review",
            "message": "Hi Daniel, I would love to get your thoughts on building AI projects and landing my first internship."
        },
        headers=student_auth_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["student_id"] == test_student.id
    assert data["alumni_id"] == test_alumni.id
    assert data["status"] == "pending"

def test_prevent_duplicate_pending_request(client, test_student, test_alumni, student_auth_headers):
    # First request
    client.post(
        "/api/requests",
        json={
            "alumni_id": test_alumni.id,
            "topic": "First request",
            "message": "Initial mentorship inquiry message for testing."
        },
        headers=student_auth_headers
    )
    # Duplicate request while pending
    dup_response = client.post(
        "/api/requests",
        json={
            "alumni_id": test_alumni.id,
            "topic": "Second request",
            "message": "Duplicate attempt should be rejected."
        },
        headers=student_auth_headers
    )
    assert dup_response.status_code == 400
    assert "already have an active pending mentorship request" in dup_response.json()["detail"]

def test_prevent_self_request(client, test_student, student_auth_headers):
    response = client.post(
        "/api/requests",
        json={
            "alumni_id": test_student.id,
            "topic": "Self request",
            "message": "Cannot request mentorship from oneself."
        },
        headers=student_auth_headers
    )
    assert response.status_code == 400
    assert "cannot submit a mentorship request to yourself" in response.json()["detail"]

def test_alumni_accept_request(client, test_student, test_alumni, student_auth_headers, alumni_auth_headers):
    # Student sends request
    req = client.post(
        "/api/requests",
        json={
            "alumni_id": test_alumni.id,
            "topic": "System Design Advice",
            "message": "Hello Daniel, would love 15 minutes to talk about distributed systems."
        },
        headers=student_auth_headers
    ).json()

    req_id = req["id"]

    # Alumni updates status to accepted
    update_res = client.patch(
        f"/api/requests/{req_id}/status",
        json={
            "status": "accepted",
            "response_note": "Let's connect this Friday at 3pm."
        },
        headers=alumni_auth_headers
    )
    assert update_res.status_code == 200
    updated = update_res.json()
    assert updated["status"] == "accepted"
    assert updated["response_note"] == "Let's connect this Friday at 3pm."

def test_unauthorized_user_cannot_update_request(client, test_student, test_alumni, student_auth_headers):
    # Student sends request
    req = client.post(
        "/api/requests",
        json={
            "alumni_id": test_alumni.id,
            "topic": "System Design Advice",
            "message": "Hello Daniel, would love 15 minutes to talk about distributed systems."
        },
        headers=student_auth_headers
    ).json()

    req_id = req["id"]

    # Student attempts to accept their own request (should be forbidden!)
    res = client.patch(
        f"/api/requests/{req_id}/status",
        json={"status": "accepted"},
        headers=student_auth_headers
    )
    assert res.status_code == 403
