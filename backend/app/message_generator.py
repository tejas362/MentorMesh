from typing import Dict
from .models import AlumniProfile, User

def generate_networking_message(
    student_name: str,
    student_major: str | None,
    career_goal: str | None,
    alumni_name: str,
    alumni_role: str,
    alumni_company: str,
    alumni_skills: str | None,
    reason: str | None,
    tone: str = "professional"
) -> Dict[str, str]:
    """
    Generates a personalized, professional outreach draft based on selected tone and background details.
    """
    first_name = alumni_name.split()[0] if alumni_name else "there"
    primary_reason = (reason or "").strip() or "learn from your experience and explore career paths"
    goal_statement = (career_goal or "").strip() or "develop my skills and enter the industry"
    major_str = f" studying {student_major}" if student_major else ""

    if tone == "enthusiastic":
        subject = f"Aspiring {goal_statement} inspired by your journey at {alumni_company}"
        body = (
            f"Hi {first_name},\n\n"
            f"I hope you're having a wonderful week! My name is {student_name}, and I am a fellow university student{major_str}. "
            f"I came across your profile on MentorMesh and was genuinely excited to see your impressive path as a {alumni_role} at {alumni_company}.\n\n"
            f"My dream is to {goal_statement}, and I would love to {primary_reason}. "
            f"Your work and expertise in this field are truly motivating to students like me.\n\n"
            f"If you have 15-20 minutes in the coming weeks, I would be thrilled to connect for a brief coffee chat or virtual Q&A. "
            f"Either way, thank you so much for giving back to our university alumni community!\n\n"
            f"Best regards,\n"
            f"{student_name}"
        )

    elif tone == "concise":
        subject = f"Alumni Connection: {student_name} / {goal_statement}"
        body = (
            f"Hi {first_name},\n\n"
            f"I'm {student_name}, a student{major_str} aiming to {goal_statement}. "
            f"I noticed your experience as {alumni_role} at {alumni_company} and would greatly value your perspective.\n\n"
            f"I am reaching out to {primary_reason}. Would you have 15 minutes for a brief chat sometime this month?\n\n"
            f"Thanks for your time and guidance,\n"
            f"{student_name}"
        )

    elif tone == "casual":
        subject = f"Fellow alum connection - quick chat about {alumni_company}?"
        body = (
            f"Hi {first_name},\n\n"
            f"Hope all is well with you! I'm {student_name}, currently a student{major_str}. "
            f"I saw you graduated from our university and are now working as a {alumni_role} at {alumni_company}.\n\n"
            f"I'm working towards a career goal to {goal_statement}, and I wanted to reach out to {primary_reason}. "
            f"I'd love to hear how your journey unfolded and any tips you might have for someone starting out.\n\n"
            f"No worries if you're swamped, but if you have a few minutes for a quick chat, it would mean a lot!\n\n"
            f"Cheers,\n"
            f"{student_name}"
        )

    else:  # default "professional"
        subject = f"University Alumni Mentorship Inquiry: {student_name} - {alumni_company}"
        body = (
            f"Dear {alumni_name},\n\n"
            f"I hope this message finds you well. My name is {student_name}, and I am currently a university student{major_str}. "
            f"I discovered your profile through the MentorMesh alumni network and noticed your role as {alumni_role} at {alumni_company}.\n\n"
            f"As someone preparing to {goal_statement}, I am reaching out to {primary_reason}. "
            f"Given your background and professional experience, I would be deeply grateful for the opportunity to ask you a few targeted questions.\n\n"
            f"If your schedule permits, could we schedule a brief 15 to 20-minute informational interview or mentorship session at your convenience?\n\n"
            f"Thank you very much for your time and consideration.\n\n"
            f"Sincerely,\n"
            f"{student_name}"
        )

    return {
        "subject": subject,
        "body": body,
        "alumni_name": alumni_name,
        "alumni_company": alumni_company,
        "tone": tone
    }
