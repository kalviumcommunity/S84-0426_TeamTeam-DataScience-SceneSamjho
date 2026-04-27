# 🚦 Traffic Accident Correlation Analysis & Insights System

**Team Members:** Akanksha Kumari, Keshav Yadav, Avinash Guleria

## 🚀 Live Demo
- **Frontend:** [https://team-team-scene.vercel.app/](https://team-team-scene.vercel.app/)
- **Backend API:** [https://s84-0426-team-team-data-science-sce-ten.vercel.app/](https://s84-0426-team-team-data-science-sce-ten.vercel.app/)

## 1. The Problem: "Data Rich, Insight Poor."
Traffic police departments routinely collect vast amounts of data on road accidents. However, this data is often archived without deep analysis. Critical correlations—such as how weather interacts with road types, or how time-of-day affects the severity of accidents involving specific vehicle types—remain undiscovered. Without analysis, interventions remain reactive rather than proactive.

## 2. The Solution
This project is a full-stack, data-driven web application designed to transform raw accident logs into actionable intelligence. By capturing granular, localized data and utilizing Data Science processing, the system visualizes hidden patterns. 

The system is divided into two primary modules:
*   **The Admin Portal (Data Ingestion):** A secure React-based form where traffic officers log new accident reports, capturing temporal, environmental, infrastructural, and human factors.
*   **The Analytics Dashboard (Data Science & Visualization):** An interactive dashboard powered by React and Recharts, fueled by Pandas backend processing to display KPI metrics and trend visualizations.

## 3. Technology Stack & Architecture
*   **Frontend (Client-Side):** React.js, Vite, Tailwind CSS, Recharts.
*   **Backend (API & Data Processing):** FastAPI (Python), Pandas & NumPy for data science processing, Pydantic for validation.
*   **Database (Storage):** PostgreSQL (Hosted via Supabase), accessed via SQLAlchemy & Alembic.
*   **Deployment:** Vercel (both Frontend and Backend).

---

## 4. Getting Started (Local Development)

### Prerequisites
*   **Python 3.9+**
*   **Node.js 18+**

### Step 1: Database Setup
Configure your `backend/.env` file with your Supabase connection string:
```env
DATABASE_URL=postgresql+asyncpg://user:password@host:port/dbname
```

### Step 2: Backend Setup
1. Create and activate a virtual environment:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\activate
   ```
2. Install dependencies:
   ```powershell
   pip install -r backend/requirements.txt
   ```
3. Run database migrations:
   ```powershell
   alembic upgrade head
   ```
4. Seed dummy data (optional):
   ```powershell
   python data_pipeline/generate_dummy_db.py
   ```
5. Start the API server:
   ```powershell
   cd backend
   uvicorn main:app --reload --port 8000
   ```

### Step 3: Frontend Setup
1. Navigate to the frontend directory:
   ```powershell
   cd frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the dev server:
   ```powershell
   npm run dev
   ```

---

## 5. Deployment

Both frontend and backend are optimized for deployment on **Vercel**. 
*   **Backend:** Uses Vercel Serverless Functions via the `vercel.json` configuration in the `backend/` folder.
*   **Frontend:** Deployed as a Vite React app.
For full deployment instructions, please see [docs/deployment.md](docs/deployment.md).

## 6. Documentation Reference
For deeper dives into the system architecture and design, please refer to the `docs/` directory:
*   [System Description](docs/description.md)
*   [High-Level Design (HLD)](docs/hld.md)
*   [Low-Level Design (LLD)](docs/lld.md)
*   [Task Split](docs/task_split.md)