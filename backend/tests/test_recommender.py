from app.recommender import calculate_match

def test_calculate_match_high_alignment(test_alumni):
    score, reasons, matching_skills, ind_match, goal_match = calculate_match(
        alumni_profile=test_alumni.alumni_profile,
        target_industry="Technology",
        career_goal="ML Engineer or AI researcher",
        skills_to_learn="Python, PyTorch, Distributed Systems"
    )
    assert score >= 75
    assert ind_match is True
    assert goal_match is True
    assert "PyTorch" in matching_skills
    assert len(reasons) >= 2

def test_calculate_match_empty_inputs_handles_gracefully(test_alumni):
    score, reasons, matching_skills, ind_match, goal_match = calculate_match(
        alumni_profile=test_alumni.alumni_profile,
        target_industry=None,
        career_goal=None,
        skills_to_learn=None
    )
    assert 0 <= score <= 100
    assert isinstance(reasons, list)
    assert isinstance(matching_skills, list)

def test_recommendations_endpoint(client, test_student, test_alumni, student_auth_headers):
    response = client.get("/api/recommendations", headers=student_auth_headers)
    assert response.status_code == 200
    recs = response.json()
    assert len(recs) >= 1
    top = recs[0]
    assert "match_score" in top
    assert "reasons" in top
    assert "matching_skills" in top
    assert top["match_score"] > 0
