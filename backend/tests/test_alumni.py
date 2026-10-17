def test_get_alumni_directory(client, test_alumni):
    response = client.get("/api/alumni")
    assert response.status_code == 200
    alumni_list = response.json()
    assert len(alumni_list) >= 1
    found = any(a["user_id"] == test_alumni.id for a in alumni_list)
    assert found

def test_search_alumni_by_name(client, test_alumni):
    response = client.get("/api/alumni?q=Daniel")
    assert response.status_code == 200
    results = response.json()
    assert len(results) >= 1
    assert results[0]["full_name"] == "Daniel Chen"

def test_search_alumni_by_company(client, test_alumni):
    response = client.get("/api/alumni?q=AlphaTech")
    assert response.status_code == 200
    results = response.json()
    assert len(results) >= 1
    assert results[0]["company"] == "AlphaTech"

def test_filter_alumni_by_industry(client, test_alumni):
    response = client.get("/api/alumni?industry=Technology")
    assert response.status_code == 200
    assert len(response.json()) >= 1

    response_empty = client.get("/api/alumni?industry=NonExistentIndustry")
    assert response_empty.status_code == 200
    assert len(response_empty.json()) == 0

def test_filter_alumni_by_skill(client, test_alumni):
    response = client.get("/api/alumni?skill=PyTorch")
    assert response.status_code == 200
    assert len(response.json()) >= 1

def test_filter_alumni_by_graduation_year(client, test_alumni):
    response = client.get("/api/alumni?graduation_year=2017")
    assert response.status_code == 200
    assert len(response.json()) >= 1

def test_get_alumni_by_id(client, test_alumni):
    response = client.get(f"/api/alumni/{test_alumni.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["company"] == "AlphaTech"
    assert "PyTorch" in data["skills"]

def test_get_alumni_not_found(client):
    response = client.get("/api/alumni/999999")
    assert response.status_code == 404
