# Installation & Deployment Guide — PEGMA FIBC Bag Configurator

This document details step-by-step installation instructions for development and production deployment.

---

## 📋 Prerequisites

- **Node.js**: `v18.0.0` or higher
- **Python**: `3.10` or higher
- **npm** or **yarn** / **pnpm**
- **Google Gemini API Key** (optional, recommended for live AI generation)

---

## 🛠️ Step-by-Step Installation

### Step 1: Clone Repository & Directory Navigation

```bash
cd /path/to/pegmafibc
```

### Step 2: Backend Setup (FastAPI)

1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure Environment Variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your `GEMINI_API_KEY`:
   ```env
   GEMINI_API_KEY=AIzaSy...
   PORT=8000
   HOST=0.0.0.0
   DATABASE_URL=sqlite:///./pegma_fibc.db
   ```
5. Run Backend Server:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

### Step 3: Frontend Setup (React 19 + Vite)

1. In a new terminal tab, navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Access the web app in your browser:
   `http://localhost:5173`

---

## 🧪 Verification & Build

### Test Frontend Build:
```bash
cd frontend
npm run build
```

### API Docs Inspection:
Open `http://localhost:8000/docs` in your browser to inspect interactive OpenAPI documentation for all `/api/generate`, `/api/history`, `/api/templates`, and `/api/admin` endpoints.
