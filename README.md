# API Client Platform ⚡

A modern, fast, and beautiful API Client Platform (a lightweight alternative to Postman) designed for testing HTTP requests, managing workspace collections, and configuring environment variables.

This project is built with a high-performance **FastAPI (Python) backend** and a reactive **Next.js (React/TypeScript) frontend**. It is designed to be fully deployable to modern cloud infrastructure.

---

## 🛠️ Tech Stack & Services

### Frontend
* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (for modern aesthetics)
* **State Management:** Zustand (for reactive, global state)
* **Deployment:** Hosted on **Vercel**

### Backend (The Heavy Lifter)
* **Framework:** FastAPI (High-performance Python web framework)
* **Language:** Python 3.10+
* **ORM:** SQLAlchemy (for database interactions)
* **Data Validation:** Pydantic v2 (serialization and schema validation)
* **Database:** **Neon Serverless PostgreSQL** (Cloud DB)
* **Deployment:** Hosted on **Render.com**

---

## 📂 Project Structure

The repository is structured as a monorepo containing both the frontend and backend applications:

```text
APIClientPlatform/
├── frontend/                 # Next.js Application
│   ├── app/                  # Next.js App Router pages
│   ├── components/           # Reusable UI components
│   ├── lib/                  # Utility functions
│   ├── store/                # Zustand global state stores
│   ├── public/               # Static assets
│   └── package.json          # Frontend dependencies
│
└── backend/                  # FastAPI Application
    ├── main.py               # Application entry point & FastAPI instance
    ├── database.py           # Database connection & SQLAlchemy setup
    ├── models.py             # SQLAlchemy ORM models (Database Tables)
    ├── schemas.py            # Pydantic models (Data validation)
    ├── routers/              # API Endpoints (Collections, Requests, etc.)
    ├── services/             # Core business logic
    ├── seed.py               # Database initialization & dummy data
    └── requirements.txt      # Python dependencies
```

---

## 🧠 Backend Details

The backend is designed to handle the heavy lifting for the platform:
- **Relational Data Management:** Uses SQLAlchemy `models.py` to define tables for `Collections`, `Requests`, and `Environments`, establishing complex foreign key relationships between them.
- **Data Validation:** Before any data touches the database, `schemas.py` validates it using Pydantic, ensuring strict type safety and data integrity.
- **Modular Routing:** Endpoints are cleanly separated in the `routers/` directory, keeping `main.py` lightweight and highly maintainable.
- **Auto-Seeding:** Upon startup, the backend automatically provisions tables and seeds initial data (via `seed.py`) to ensure the platform is immediately usable for testing.

---

## ☁️ Live Deployment

This platform is currently deployed and live!

1. **Frontend (Vercel)**: Automatically builds from the `frontend` directory on GitHub pushes. Environment variables (`NEXT_PUBLIC_API_URL`) are configured to point to the Render backend.
2. **Backend (Render.com)**: Automatically deploys the FastAPI application from the `backend` directory.
3. **Database (Neon)**: A serverless PostgreSQL instance connected to the Render backend via the `DATABASE_URL` environment variable.

---

## 🚀 Local Development Quickstart

### 1. Run the Backend
Ensure you have Python 3.10+ installed.

```bash
cd backend
python -m venv venv
# Activate virtual environment
# Windows: .\venv\Scripts\Activate.ps1
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*The backend will run at `http://127.0.0.1:8000`.*

### 2. Run the Frontend
Ensure you have Node.js 18+ installed.

```bash
cd frontend
npm install
npm run dev
```
*Open **[http://localhost:3000/workspace](http://localhost:3000/workspace)** in your browser.*

---

## 🧪 Built-in API Tests

The backend comes pre-configured with two mock API endpoints to test requests directly inside your workspace:

- **GET Request:** `http://127.0.0.1:8000/api/test-get?name=User`
- **POST Request:** `http://127.0.0.1:8000/api/test-post`
