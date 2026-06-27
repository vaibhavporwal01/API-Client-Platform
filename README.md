# API Client Platform ⚡

A modern, fast, and beautiful API Client Platform (a lightweight alternative to Postman) designed for testing HTTP requests, managing workspace collections, and configuring environment variables.

Built with a high-performance **FastAPI (Python) backend** and a reactive **Next.js (React/TypeScript) frontend**.

---

## 🛠️ Architecture

*   **Frontend**: Next.js 14 (App Router), Tailwind CSS (for modern aesthetics), Zustand (for state management).
*   **Backend**: FastAPI, SQLAlchemy (ORM), SQLite (database), Pydantic v2 (validation & serialization).

---

## 🚀 Local Quickstart

### 1. Run the Backend
Ensure you have Python 3.10+ installed.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment:
    ```bash
    python -m venv venv
    ```
3.  Activate the virtual environment:
    *   **Windows (PowerShell)**: `.\venv\Scripts\Activate.ps1`
    *   **Mac/Linux**: `source venv/bin/activate`
4.  Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5.  Start the FastAPI development server:
    ```bash
    uvicorn main:app --reload --port 8000
    ```
    The backend will run at `http://127.0.0.1:8000`.

---

### 2. Run the Frontend
Ensure you have Node.js 18+ installed.

1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Next.js development server:
    ```bash
    npm run dev
    ```
    Open **[http://localhost:3000/workspace](http://localhost:3000/workspace)** in your browser.

---

## 🧪 Testing Your Own API (Built-in Test Routes)

The backend comes pre-configured with two mock API endpoints to test requests directly inside your workspace:

### 1. GET Request
*   **URL**: `http://127.0.0.1:8000/api/test-get?name=User`
*   **Response**:
    ```json
    {
      "message": "Hello, User! Your API Client Platform is working!"
    }
    ```

### 2. POST Request
*   **URL**: `http://127.0.0.1:8000/api/test-post`
*   **Body (JSON)**:
    ```json
    {
      "key": "value"
    }
    ```
*   **Response**:
    ```json
    {
      "received_payload": { "key": "value" },
      "status": "success"
    }
    ```

---

## 📦 Setting Up Git & GitHub

Since this project is not yet under version control, follow these steps to upload it to your GitHub profile:

1.  Open your terminal at the project's root folder (`APIClientPlatform`).
2.  Initialize a local Git repository:
    ```bash
    git init
    ```
3.  Add all files to the staging area:
    ```bash
    git add .
    ```
    *(Note: Folder exclusions like `venv/`, `node_modules/`, and `.next/` are automatically ignored thanks to the `.gitignore` file).*
4.  Commit the files:
    ```bash
    git commit -m "initial commit: API Client Platform working build"
    ```
5.  Create a new, empty repository on [GitHub](https://github.com/new). Name it `APIClientPlatform`. Do **NOT** initialize it with a README, gitignore, or license.
6.  Copy the remote repository URL, then run:
    ```bash
    git remote add origin <your-copied-repo-url>
    git branch -M main
    git push -u origin main
    ```

---

## ☁️ Deployment Guide

### Frontend Deployment (Vercel)
Vercel is the recommended host for Next.js.
1.  Import your GitHub repository into [Vercel](https://vercel.com).
2.  Configure the build settings:
    *   **Root Directory**: `frontend`
    *   **Framework Preset**: Next.js
    *   **Environment Variable**: Add `NEXT_PUBLIC_API_URL` set to your live backend domain (e.g., `https://api.yourdomain.com`).
3.  Click **Deploy**.

### Backend Deployment (Render / Railway / VPS)
*   **For VPS (SQLite)**: Deploy using Docker and mount a persistent volume directory to prevent SQLite files from being cleared on restarts.
*   **For PaaS (Render / Railway)**: Connect a PostgreSQL database service and set the connection string environment variable to `DATABASE_URL` (SQLAlchemy will detect this and configure connection details automatically).
