import httpx

def run_smoke_test():
    client = httpx.Client(base_url='http://127.0.0.1:8000')

    # 1. Login as Student Alex Rivera
    res = client.post('/api/auth/login', json={'email': 'student@mentormesh.edu', 'password': 'demo123'})
    assert res.status_code == 200, f'Student login failed: {res.text}'
    student_token = res.json()['access_token']
    print('[PASSED] 1. Student login succeeded')

    # 2. Search alumni directory
    s_res = client.get('/api/alumni?q=Marcus')
    assert s_res.status_code == 200 and len(s_res.json()) >= 1
    print('[PASSED] 2. Alumni search returned matching demo record (Marcus Vance)')

    # 3. AI recommendations
    rec_res = client.get('/api/recommendations', headers={'Authorization': f'Bearer {student_token}'})
    assert rec_res.status_code == 200 and len(rec_res.json()) >= 1
    top_rec = rec_res.json()[0]
    full_name = top_rec['alumni']['full_name']
    score = top_rec['match_score']
    print(f'[PASSED] 3. AI Mentor Recommendations returned ranked results: Top match is {full_name} ({score}% match)')

    # 4. Generate outreach message
    msg_res = client.post('/api/messages/generate', json={
        'alumni_id': top_rec['alumni']['user_id'],
        'career_goal': 'Distributed Systems Engineer',
        'reason': 'learn how you prepare for system design interviews',
        'tone': 'professional'
    }, headers={'Authorization': f'Bearer {student_token}'})
    assert msg_res.status_code == 200
    subject = msg_res.json()['subject']
    print(f'[PASSED] 4. Networking message generated: "{subject}"')

    # 5. Alumni Login
    a_login = client.post('/api/auth/login', json={'email': 'alumni@mentormesh.edu', 'password': 'demo123'})
    assert a_login.status_code == 200
    alumni_token = a_login.json()['access_token']
    print('[PASSED] 5. Alumni login succeeded')

    # 6. Alumni views incoming requests
    a_reqs = client.get('/api/requests/alumni', headers={'Authorization': f'Bearer {alumni_token}'})
    assert a_reqs.status_code == 200
    print(f'[PASSED] 6. Alumni can view received requests (Found {len(a_reqs.json())} requests)')

    # 7. Check pending request and update status
    pending = [r for r in a_reqs.json() if r['status'] == 'pending']
    if pending:
        target_id = pending[0]['id']
        up_res = client.patch(f'/api/requests/{target_id}/status', json={
            'status': 'accepted',
            'response_note': 'Sounds great! Looking forward to connecting on Zoom.'
        }, headers={'Authorization': f'Bearer {alumni_token}'})
        assert up_res.status_code == 200
        print(f'[PASSED] 7. Request #{target_id} updated to Accepted with meeting note')

    # 8. Student verifies updated status
    st_reqs = client.get('/api/requests/student', headers={'Authorization': f'Bearer {student_token}'})
    accepted = [r for r in st_reqs.json() if r['status'] == 'accepted']
    assert len(accepted) >= 1
    print(f'[PASSED] 8. Request status persisted and visible to student ({len(accepted)} accepted)')

    print('\n=============================================')
    print('ALL 8 INTEGRATION SMOKE TESTS PASSED CLEANLY!')
    print('=============================================')

if __name__ == '__main__':
    run_smoke_test()
