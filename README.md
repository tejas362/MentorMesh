# MentorMesh

> **Tagline:** Connect with Alumni. Build Your Future.

MentorMesh is an open, full-stack alumni networking and mentorship platform designed for university career centers and college students. It bridges the gap between ambitious students and experienced alumni mentors worldwide through explainable AI-inspired matching, a personalized networking message generator, and an accountable 1-on-1 mentorship request workflow.

---

## 🌟 Key Features

1. **Alumni Directory & Search**
   - Search graduates across name, current company, role, skills, or industry.
   - Filter by specific industry, skills, graduation year, or mentorship availability status.
   - Transparent profiles with career journey narratives, verified degrees, and LinkedIn links.

2. **AI-Inspired Mentor Matching Engine**
   - Deterministic matching algorithm scoring student career goals and target industries against alumni mentors.
   - 100% transparent and explainable match scores (0–100%) highlighting overlapping skills, direct industry alignment, and career goal relevance.
   - Fully local implementation with zero paid external AI API requirements.

3. **Personalized Networking Message Generator**
   - Generates structured, professional cold outreach drafts in seconds.
   - Supports 4 tailored tones: **Professional**, **Enthusiastic**, **Casual & Warm**, and **Concise**.
   - Editable draft editor, 1-click copy-to-clipboard, and direct transfer into mentorship requests.

4. **Mentorship Request Workflow**
   - Students submit structured requests specifying discussion topics (Mock Interviews, Resume Reviews, System Design, Career Transition).
   - Duplicate pending request prevention to protect mentors from spam.
   - Alumni review incoming student inquiries, with permissions to Accept (providing meeting instructions or Zoom links) or Decline.
   - Full database persistence across browser sessions and server reboots.

5. **Authentication & Role Authorization**
   - Secure password hashing using PBKDF2-HMAC-SHA256 (100,000 iterations + unique cryptographically secure salts).
   - Signed JWT Bearer token authentication.
   - Student and Alumni role separation with strict permission enforcement on requests and profile edits.

6. **Pre-Seeded Fictional Demo Data & 1-Click Login**
   - Pre-populated with diverse alumni across Technology, Financial Services, Data Science & AI, Healthcare Tech, UX Design, and Management Consulting.
   - Idempotent seed script (`seed_data.py`) with zero duplicate generation.
   - 1-Click Fast Login buttons for rapid evaluator testing.

---

## 🏗️ Architecture & Tech Stack

```
MentorMesh/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI entry point, CORS & startup seed
│   │   ├── config.py             # App settings & environment variables
│   │   ├── database.py           # SQLAlchemy engine & SQLite session
│   │   ├── models.py             # Database models (User, AlumniProfile, StudentProfile, MentorshipRequest)
│   │   ├── schemas.py            # Pydantic v2 schemas with ConfigDict
│   │   ├── auth.py               # PBKDF2 hashing & JWT authorization
│   │   ├── recommender.py        # Deterministic explainable recommendation engine
│   │   ├── message_generator.py  # Local template outreach generator
│   │   ├── seed_data.py          # Idempotent demo seeder
│   │   ├── helpers.py            # Model serialization utilities
│   │   └── routers/              # Clean REST API routers
│   │       ├── auth.py
│   │       ├── alumni.py
│   │       ├── recommendations.py
│   │       ├── requests.py
│   │       ├── messages.py
│   │       └── users.py
│   ├── tests/                    # Pytest test suite (24 tests)
│   │   ├── conftest.py           # In-memory SQLite fixtures
│   │   ├── test_auth.py
│   │   ├── test_alumni.py
│   │   ├── test_recommender.py
│   │   ├── test_requests.py
│   │   ├── test_messages.py
│   │   └── integration_smoke_test.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── AlumniCard.jsx
│   │   │   ├── RecommendationCard.jsx
│   │   │   ├── RequestCard.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Session & role state provider
│   │   ├── pages/                # All 13 application screens
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── AlumniDirectoryPage.jsx
│   │   │   ├── AlumniProfilePage.jsx
│   │   │   ├── RecommendationsPage.jsx
│   │   │   ├── MentorshipRequestPage.jsx
│   │   │   ├── MessageGeneratorPage.jsx
│   │   │   ├── RequestManagementPage.jsx
│   │   │   ├── ProfileEditPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/
│   │   │   └── api.js            # Centralized API service
│   │   ├── styles/
│   │   │   ├── theme.css         # Design tokens & color system
│   │   │   └── index.css         # Responsive styling
│   │   ├── test/                 # Vitest test suite (7 tests)
│   │   │   ├── setup.js
│   │   │   ├── StatusBadge.test.jsx
│   │   │   ├── AlumniCard.test.jsx
│   │   │   └── RecommendationCard.test.jsx
│   │   ├── App.jsx               # React Router layout
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

- **Frontend:** React 19, Vite, React Router 7, Lucide Icons, Plain CSS (Theme variables).
- **Backend:** Python, FastAPI, SQLAlchemy 2, Pydantic v2, PyJWT.
- **Database:** SQLite (local zero-configuration storage, auto-created on launch).
- **Testing:** Pytest (Backend, in-memory isolation) + Vitest / React Testing Library (Frontend) + HTTP Integration Smoke Tests.

---

## ⚡ Quick Start Instructions

### Prerequisites
- Python 3.10+ (Tested on Python 3.14)
- Node.js 18+ (Tested on Node.js v24)
- npm 9+

---

### 1. Backend Setup & Run

Open a terminal in the project root:

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (if not already created)
python -m venv venv

# Activate virtual environment
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server (runs on port 8000)
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

> **Note:** The database tables and demo seed data are initialized automatically upon backend startup. Interactive API Swagger documentation is available at `http://127.0.0.1:8000/docs`.

---

### 2. Frontend Setup & Run

Open a second terminal in the project root:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server (runs on port 5173)
npm run dev -- --host 127.0.0.1 --port 5173
```

Now open your web browser and visit:
👉 **`http://127.0.0.1:5173`**

---

## 🔑 Fictional Demo Accounts (For Instant Testing)

All seed accounts use the default password: **`demo123`**

| Role | Name | Email | Bio / Headline |
| :--- | :--- | :--- | :--- |
| **Student** | Alex Rivera | `student@mentormesh.edu` | Senior CS Undergrad aiming for distributed systems |
| **Student** | Maya Chen | `maya.student@mentormesh.edu` | Junior studying Data Science & Applied ML |
| **Alumni** | Marcus Vance | `alumni@mentormesh.edu` | Staff Software Engineer at CloudScale Systems (Class of 2018) |
| **Alumni** | Elena Rostova | `elena.ai@mentormesh.edu` | Senior ML Scientist at Vertex AI (Class of 2019) |
| **Alumni** | David Kim | `david.fin@mentormesh.edu` | VP Quantitative Strategy at Apex Financial (Class of 2016) |
| **Alumni** | Sarah Jenkins | `sarah.ux@mentormesh.edu` | Principal Product Designer at Lumina Creative Labs (Class of 2020) |
| **Alumni** | Jessica Zhang | `jessica.cloud@mentormesh.edu` | Lead DevOps & Cloud Architect at CyberShield (Class of 2021) |

> 💡 **Tip:** On the [Login Page](http://127.0.0.1:5173/login), you can click the **"⚡ 1-Click Fast Demo Login"** buttons to log in immediately as Alex (Student) or Marcus (Alumni) without typing!

---

## 🧪 Running Automated Tests

### Backend Tests (Pytest)
```bash
cd backend
.\venv\Scripts\pytest -v
```
*Result: 24 passed unit and integration tests.*

### Frontend Tests (Vitest)
```bash
cd frontend
npm test
```
*Result: 7 passed component and UI tests.*

### Production Build Verification
```bash
cd frontend
npm run build
```
*Result: Production build succeeded with zero errors.*

### End-to-End Smoke Test
With the backend server running:
```bash
cd backend
.\venv\Scripts\python tests\integration_smoke_test.py
```
*Result: All 8 live integration checks passed.*

---

## 🛑 How to Stop the Servers

- To stop the backend or frontend servers in the terminal where they are running, press:
  `Ctrl + C` (or `Cmd + C` on macOS).
- To reload demo seed data at any time without resetting the database file manually, navigate to `/about` and click **"Reload Demo Seed Data"** or send a `POST /api/users/reset-demo` request.

---

## 📜 License
Educational MIT Prototype License &copy; 2026 MentorMesh.
