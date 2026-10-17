import logging
from sqlalchemy.orm import Session
from .models import User, AlumniProfile, StudentProfile, MentorshipRequest
from .auth import hash_password

logger = logging.getLogger("seed_data")

def seed_database(db: Session, force: bool = False):
    """
    Idempotent database seeding for MentorMesh.
    Creates rich fictional demo data for students and alumni.
    """
    existing_users = db.query(User).count()
    if existing_users > 0 and not force:
        logger.info("Database already contains users. Skipping demo seed.")
        return

    default_pw = hash_password("demo123")

    # 1. Demo Student 1: Alex Rivera
    student1 = db.query(User).filter_by(email="student@mentormesh.edu").first()
    if not student1:
        student1 = User(
            email="student@mentormesh.edu",
            hashed_password=default_pw,
            full_name="Alex Rivera",
            role="student",
            headline="Aspiring Full-Stack & Cloud Engineer | Senior CS Undergrad",
            bio="[Demo Student] Passionate 4th-year Computer Science student eager to break into distributed systems, modern web platforms, and cloud infrastructure.",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80"
        )
        db.add(student1)
        db.flush()

        student_prof1 = StudentProfile(
            user_id=student1.id,
            major="Computer Science",
            graduation_year=2026,
            career_goal="Full-Stack Software Engineer at high-scale tech company",
            target_industry="Technology",
            skills_to_learn="React, FastAPI, Docker, System Design, Cloud Architecture"
        )
        db.add(student_prof1)

    # 2. Demo Student 2: Maya Chen
    student2 = db.query(User).filter_by(email="maya.student@mentormesh.edu").first()
    if not student2:
        student2 = User(
            email="maya.student@mentormesh.edu",
            hashed_password=default_pw,
            full_name="Maya Chen",
            role="student",
            headline="Data Science & Applied ML Student | Class of 2027",
            bio="[Demo Student] Junior studying Data Science & Statistics. Interested in deep learning, predictive analytics, and algorithmic fairness.",
            avatar_url="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&auto=format&fit=crop&q=80"
        )
        db.add(student2)
        db.flush()

        student_prof2 = StudentProfile(
            user_id=student2.id,
            major="Data Science & Statistics",
            graduation_year=2027,
            career_goal="Machine Learning Scientist or Quantitative Analyst",
            target_industry="Data Science & AI",
            skills_to_learn="Python, Machine Learning, PyTorch, SQL, Statistics"
        )
        db.add(student_prof2)

    # 3. Alumni Profiles (Diverse Industries & Experiences)
    alumni_seeds = [
        {
            "email": "alumni@mentormesh.edu",
            "name": "Marcus Vance",
            "headline": "Staff Software Engineer at CloudScale Systems | Ex-Meta",
            "bio": "[Demo Alumnus] 8+ years scaling distributed backends and event-driven architectures. Passionate about helping first-generation students master technical interviews and system design.",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80",
            "company": "CloudScale Systems",
            "role": "Staff Software Engineer",
            "industry": "Technology",
            "grad_year": 2018,
            "degree": "B.S. in Computer Science",
            "location": "San Francisco, CA",
            "linkedin": "https://linkedin.com/in/demo-marcus-vance",
            "years_exp": 8,
            "available": True,
            "interests": "System Design, Mock Technical Interviews, Transition into Big Tech, Resume Review",
            "skills": "Python, Go, System Design, Cloud Architecture, Distributed Systems, FastAPI, Docker"
        },
        {
            "email": "elena.ai@mentormesh.edu",
            "name": "Elena Rostova",
            "headline": "Senior ML Scientist at Vertex AI | PhD in Computer Vision",
            "bio": "[Demo Alumnus] Research scientist focused on large vision-language models and edge deployment. Happy to mentor students interested in research labs and applied AI roles.",
            "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80",
            "company": "Vertex AI",
            "role": "Senior Machine Learning Scientist",
            "industry": "Data Science & AI",
            "grad_year": 2019,
            "degree": "M.S. & PhD in Artificial Intelligence",
            "location": "New York, NY",
            "linkedin": "https://linkedin.com/in/demo-elena-rostova",
            "years_exp": 6,
            "available": True,
            "interests": "AI Research, Grad School Applications, PyTorch & Deep Learning, Resume Review",
            "skills": "Python, Machine Learning, PyTorch, Deep Learning, Computer Vision, MLOps, Statistics"
        },
        {
            "email": "david.fin@mentormesh.edu",
            "name": "David Kim",
            "headline": "VP Quantitative Strategy at Apex Financial",
            "bio": "[Demo Alumnus] Financial engineer with a focus on algorithmic trading and market microstructures. Enjoys guiding analytical students toward quantitative finance careers.",
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80",
            "company": "Apex Financial",
            "role": "VP Quantitative Strategy",
            "industry": "Financial Services",
            "grad_year": 2016,
            "degree": "B.S. in Applied Mathematics & Economics",
            "location": "Chicago, IL",
            "linkedin": "https://linkedin.com/in/demo-david-kim",
            "years_exp": 9,
            "available": True,
            "interests": "Quant Finance, Financial Modeling, Math Careers, Networking Advice",
            "skills": "Python, C++, Financial Modeling, Quantitative Analysis, Statistics, SQL, Risk Management"
        },
        {
            "email": "sarah.ux@mentormesh.edu",
            "name": "Sarah Jenkins",
            "headline": "Principal Product Designer at Lumina Creative Labs",
            "bio": "[Demo Alumnus] 6 years crafting intuitive human-centered software. Specialize in design systems, UX research, and product prototyping.",
            "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&auto=format&fit=crop&q=80",
            "company": "Lumina Creative Labs",
            "role": "Principal Product Designer",
            "industry": "Design & Creative Tech",
            "grad_year": 2020,
            "degree": "B.A. in Interactive Media Design",
            "location": "Austin, TX",
            "linkedin": "https://linkedin.com/in/demo-sarah-jenkins",
            "years_exp": 5,
            "available": True,
            "interests": "Portfolio Critique, Design Systems, UX Research, Cross-functional Collaboration",
            "skills": "Figma, UI/UX Design, User Research, Design Systems, Prototyping, Frontend Basics"
        },
        {
            "email": "tariq.pm@mentormesh.edu",
            "name": "Tariq Mansour",
            "headline": "Group Product Manager at Nova Health Tech",
            "bio": "[Demo Alumnus] Former engineer turned product leader. Leading digital health platforms that improve patient outcomes. Happy to guide aspiring PMs through the APM and transition process.",
            "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=250&auto=format&fit=crop&q=80",
            "company": "Nova Health",
            "role": "Group Product Manager",
            "industry": "Healthcare Tech",
            "grad_year": 2017,
            "degree": "B.S. in Biomedical Engineering & Minor in CS",
            "location": "Boston, MA",
            "linkedin": "https://linkedin.com/in/demo-tariq-mansour",
            "years_exp": 8,
            "available": True,
            "interests": "Product Management, APM Interview Prep, Healthcare Tech, Roadmapping",
            "skills": "Product Strategy, User Research, Agile, Roadmapping, SQL, A/B Testing, HealthTech"
        },
        {
            "email": "jessica.cloud@mentormesh.edu",
            "name": "Jessica Zhang",
            "headline": "Lead DevOps & Cloud Architect at CyberShield",
            "bio": "[Demo Alumnus] Helping enterprises secure their cloud native infrastructure on AWS & Kubernetes. Excited to coach students on cloud certifications and real-world ops.",
            "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&auto=format&fit=crop&q=80",
            "company": "CyberShield",
            "role": "Lead DevOps Architect",
            "industry": "Technology",
            "grad_year": 2021,
            "degree": "B.S. in Computer Systems Engineering",
            "location": "Seattle, WA",
            "linkedin": "https://linkedin.com/in/demo-jessica-zhang",
            "years_exp": 4,
            "available": True,
            "interests": "Cloud Certifications, Kubernetes, CI/CD, Cyber Security, Infrastructure as Code",
            "skills": "AWS, Kubernetes, Terraform, Docker, CI/CD, Python, Linux, Cybersecurity"
        },
        {
            "email": "robert.bio@mentormesh.edu",
            "name": "Robert Thorne",
            "headline": "Director of Bioinformatics at Horizon BioTech",
            "bio": "[Demo Alumnus] Bridging biological sciences and computational pipelines. Dedicated to mentoring interdisciplinary students exploring computational genomics.",
            "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=250&auto=format&fit=crop&q=80",
            "company": "Horizon BioTech",
            "role": "Director of Bioinformatics",
            "industry": "BioTech & Pharma",
            "grad_year": 2015,
            "degree": "B.S. & M.S. in Computational Biology",
            "location": "Cambridge, MA",
            "linkedin": "https://linkedin.com/in/demo-robert-thorne",
            "years_exp": 10,
            "available": False,
            "interests": "Computational Biology, Academic to Industry Transition, Scientific Publishing",
            "skills": "Bioinformatics, Nextflow, Python, R, Genomics, Data Analysis, Machine Learning"
        },
        {
            "email": "ananya.consult@mentormesh.edu",
            "name": "Ananya Patel",
            "headline": "Senior Strategy Consultant at Stratagem Consulting",
            "bio": "[Demo Alumnus] Advising Fortune 500 tech and consumer enterprises on digital transformation and market entry. Happy to do case interview prep and resume polishing.",
            "avatar": "https://images.unsplash.com/photo-1534751516642-a171edd2521b?w=250&auto=format&fit=crop&q=80",
            "company": "Stratagem Consulting",
            "role": "Senior Strategy Consultant",
            "industry": "Management Consulting",
            "grad_year": 2022,
            "degree": "B.S. in Business Administration",
            "location": "Atlanta, GA",
            "linkedin": "https://linkedin.com/in/demo-ananya-patel",
            "years_exp": 3,
            "available": True,
            "interests": "Case Interview Prep, Strategy Frameworks, Consulting Recruiting, Slide Crafting",
            "skills": "Management Consulting, Market Analysis, Strategy, Excel Modeling, Client Presentation"
        }
    ]

    alumni_users = []
    for data in alumni_seeds:
        user = db.query(User).filter_by(email=data["email"]).first()
        if not user:
            user = User(
                email=data["email"],
                hashed_password=default_pw,
                full_name=data["name"],
                role="alumni",
                headline=data["headline"],
                bio=data["bio"],
                avatar_url=data["avatar"]
            )
            db.add(user)
            db.flush()

            prof = AlumniProfile(
                user_id=user.id,
                company=data["company"],
                current_role=data["role"],
                industry=data["industry"],
                graduation_year=data["grad_year"],
                degree=data["degree"],
                location=data["location"],
                linkedin_url=data["linkedin"],
                years_of_experience=data["years_exp"],
                is_available_for_mentorship=data["available"],
                mentoring_interests=data["interests"],
                skills=data["skills"]
            )
            db.add(prof)
        alumni_users.append(user)

    db.flush()

    # 4. Sample Mentorship Requests (Pending, Accepted, Rejected) for immediate dashboard exploration
    # Check if requests already exist
    if db.query(MentorshipRequest).count() == 0 and student1 and len(alumni_users) >= 3:
        # Request 1: Pending with Marcus Vance (alumni@mentormesh.edu)
        req1 = MentorshipRequest(
            student_id=student1.id,
            alumni_id=alumni_users[0].id,
            topic="Mock Technical Interview & System Design",
            message="Hi Marcus, I'm a senior preparing for full-stack software engineering interviews. I would love 20 minutes to review my resume and get your feedback on distributed systems interview prep!",
            status="pending"
        )
        db.add(req1)

        # Request 2: Accepted with Jessica Zhang (CyberShield)
        req2 = MentorshipRequest(
            student_id=student1.id,
            alumni_id=alumni_users[5].id,  # Jessica Zhang
            topic="Cloud Architecture & AWS Guidance",
            message="Hi Jessica, I'm currently building projects with Docker and FastAPI, and I'd love to learn how to transition into Kubernetes and Cloud Native DevOps.",
            status="accepted",
            response_note="Happy to connect Alex! Let's schedule a Zoom call this Thursday at 4 PM PST. Excited to help."
        )
        db.add(req2)

        # Request 3: Rejected/Closed example with Robert Thorne (unavailable)
        req3 = MentorshipRequest(
            student_id=student1.id,
            alumni_id=alumni_users[6].id,  # Robert Thorne
            topic="Bioinformatics Career Overview",
            message="Hello Dr. Thorne, I'm exploring intersections between algorithms and biology and wondered if we could chat.",
            status="rejected",
            response_note="Hi Alex, thank you for reaching out! Due to an upcoming product milestone I am currently at capacity for 1:1 mentorship this quarter. Wishing you all the best."
        )
        db.add(req3)

        # Request 4: Maya Chen request to Elena Rostova (Accepted)
        if student2:
            req4 = MentorshipRequest(
                student_id=student2.id,
                alumni_id=alumni_users[1].id,  # Elena Rostova
                topic="AI Research vs Applied ML in Industry",
                message="Hi Elena, I am a junior studying Data Science and wondering whether to pursue a PhD or jump into industry AI engineering. Would love your perspective!",
                status="accepted",
                response_note="Hi Maya! I'd love to share my experience transitioning between academia and industry. Let's set up a coffee chat."
            )
            db.add(req4)

    db.commit()
    logger.info("Successfully seeded demo data into database.")
