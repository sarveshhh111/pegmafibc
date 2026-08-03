# PEGMA FIBC Bag Configurator & AI Visualizer

> **Production-Ready Premium Industrial Web Application for PEGMA**
> Configure Flexible Intermediate Bulk Containers (FIBC / Jumbo Bags) and instantly generate photorealistic 3D product images using Google's Gemini Image API.

---

## 🌟 Key Features

- **Three Column CAD-Style Layout**:
  - **LEFT**: Specification accordions, color pickers, material density (GSM), loop configurations, top/bottom spouts, brand printing options, and multi-select accessories.
  - **CENTER**: High-resolution image canvas with "AI GENERATED PREVIEW" & "Powered by Gemini" badges, fullscreen inspection modal, zoom controls, PNG/JPG downloads, and Framer Motion progress loading skeleton.
  - **RIGHT**: Live updating specification summary, primary "Generate Image ✨" CTA, project saving, link sharing, and recent generations gallery grid.
- **Python FastAPI Backend**:
  - Structured spec-to-prompt engine (`prompt_builder.py`).
  - Google Gemini Image API integration (`imagen-3.0-generate-002` / Gemini Nano Banana).
  - High-fidelity vector rendering engine fallback when offline or without API key.
  - SQLite database for persistent generation history, favorites, saved project specs, and admin prompt audit logs.
- **Premium Design Aesthetics**:
  - Apple/Linear/Framer inspired industrial CAD user experience.
  - Primary Red (`#E53935`), Dark text (`#1A1A1A`), Background (`#F7F8FA`).
  - Seamless dark/light theme switching with persistence.
  - Micro-animations, glowing CTA ripple effects, and glassmorphism.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide React Icons, Axios, React Hook Form
- **Backend**: FastAPI (Python), Pydantic v2, SQLAlchemy, SQLite (PostgreSQL ready), Uvicorn
- **AI Engine**: Google Gemini Image API (`google-genai` SDK)

---

## 🚀 Quick Start Guide

### 1. Backend Setup

```bash
cd backend

# Create virtual environment (optional)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Add your Gemini API key to .env
# GEMINI_API_KEY=AIzaSy...

# Start FastAPI server
python -m uvicorn app.main:app --reload --port 8000
```
Backend will run at: `http://localhost:8000` (API Docs at `http://localhost:8000/docs`).

### 2. Frontend Setup

```bash
cd frontend

# Install node dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend will run at: `http://localhost:5173`.

---

## 📄 License & Branding

© 2026 PEGMA Bulk Packaging Solutions. All rights reserved.
