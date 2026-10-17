import re
from typing import List, Tuple
from .models import AlumniProfile, StudentProfile, User

def parse_csv_items(text: str | None) -> List[str]:
    """Parse comma or semicolon separated string into a clean list of lowercased trimmed items."""
    if not text:
        return []
    items = re.split(r'[,;\n]+', text)
    return [item.strip() for item in items if item.strip()]

def calculate_match(
    alumni_profile: AlumniProfile,
    target_industry: str | None = None,
    career_goal: str | None = None,
    skills_to_learn: str | None = None
) -> Tuple[int, List[str], List[str], bool, bool]:
    """
    Deterministic AI-inspired matching engine for alumni mentors.
    Returns: (match_score (0-100), reasons, matching_skills, industry_match, career_goal_match)
    """
    score = 0
    reasons: List[str] = []
    matching_skills: List[str] = []
    industry_match = False
    career_goal_match = False

    # 1. Industry Alignment (Weight: up to 30 pts)
    target_ind = (target_industry or "").strip().lower()
    alumni_ind = (alumni_profile.industry or "").strip().lower()

    if target_ind and alumni_ind:
        if target_ind == alumni_ind:
            score += 30
            industry_match = True
            reasons.append(f"Direct industry match in {alumni_profile.industry}")
        elif target_ind in alumni_ind or alumni_ind in target_ind:
            score += 20
            industry_match = True
            reasons.append(f"Related industry background ({alumni_profile.industry})")
        else:
            # Base cross-industry baseline
            score += 5
    else:
        # Default neutral credit
        score += 10

    # 2. Skill Overlap (Weight: up to 40 pts)
    student_skills = [s.lower() for s in parse_csv_items(skills_to_learn)]
    alumni_skills = parse_csv_items(alumni_profile.skills)
    alumni_skills_lower = {s.lower(): s for s in alumni_skills}

    found_skills = []
    for s_skill in student_skills:
        for a_lower, a_orig in alumni_skills_lower.items():
            if s_skill == a_lower or s_skill in a_lower or a_lower in s_skill:
                if a_orig not in found_skills:
                    found_skills.append(a_orig)

    matching_skills = found_skills
    if student_skills:
        if found_skills:
            # Scale up to 40 points based on ratio and count
            pts = min(40, len(found_skills) * 12)
            score += pts
            reasons.append(f"Shares key skills you want to learn: {', '.join(found_skills[:3])}")
        else:
            score += 5
    else:
        # If student hasn't specified skills yet, evaluate mentor's breadth
        if alumni_skills:
            score += min(20, len(alumni_skills) * 4)

    # 3. Career Goal & Role Alignment (Weight: up to 20 pts)
    goal = (career_goal or "").strip().lower()
    mentor_role = (alumni_profile.current_role or "").lower()
    mentor_interests = (alumni_profile.mentoring_interests or "").lower()
    mentor_company = (alumni_profile.company or "").lower()

    if goal:
        goal_keywords = [w for w in re.split(r'[\s,]+', goal) if len(w) > 3]
        matches_role = any(kw in mentor_role for kw in goal_keywords)
        matches_interests = any(kw in mentor_interests for kw in goal_keywords)
        matches_company = any(kw in mentor_company for kw in goal_keywords)

        if matches_role:
            score += 15
            career_goal_match = True
            reasons.append(f"Current role ({alumni_profile.current_role}) directly aligns with your career target")
        elif matches_interests or matches_company:
            score += 10
            career_goal_match = True
            reasons.append(f"Mentoring focus & company background connect with your target goal: '{career_goal}'")
        else:
            score += 5
    else:
        score += 8

    # 4. Availability & Experience Factor (Weight: up to 10 pts)
    if alumni_profile.is_available_for_mentorship:
        score += 5
        reasons.append("Actively accepting new student mentees")
    
    exp_years = alumni_profile.years_of_experience or 1
    if exp_years >= 5:
        score += 5
        reasons.append(f"Seasoned professional with {exp_years}+ years of industry experience")
    elif exp_years >= 2:
        score += 3
        reasons.append(f"{exp_years} years of industry experience")
    else:
        score += 2

    # Clamp score to 15 - 99 range for realistic feel
    final_score = max(15, min(99, score))

    if not reasons:
        reasons.append(f"Alumnus at {alumni_profile.company} working as {alumni_profile.current_role}")

    return final_score, reasons, matching_skills, industry_match, career_goal_match
