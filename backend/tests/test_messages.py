def test_generate_networking_message(client, test_alumni, student_auth_headers):
    response = client.post(
        "/api/messages/generate",
        json={
            "alumni_id": test_alumni.id,
            "career_goal": "Machine Learning Engineer",
            "reason": "learn about ML careers at AlphaTech",
            "tone": "professional"
        },
        headers=student_auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "AlphaTech" in data["body"]
    assert "Daniel Chen" in data["body"]
    assert "subject" in data
    assert len(data["body"]) > 50

def test_generate_networking_message_different_tones(client, test_alumni):
    for tone in ["enthusiastic", "casual", "concise"]:
        res = client.post(
            "/api/messages/generate",
            json={
                "alumni_id": test_alumni.id,
                "career_goal": "Software Engineer",
                "reason": "seek advice",
                "tone": tone
            }
        )
        assert res.status_code == 200
        assert res.json()["tone"] == tone
        assert len(res.json()["body"]) > 30
