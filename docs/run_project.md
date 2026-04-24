# Running the Traffic Accident Insights Project

Follow these steps to set up and run the project locally.

## Prerequisites
- **Python 3.9+**
- **Node.js 18+**
- **Docker Desktop** (optional, for local PostgreSQL)

---

## 1. Database Setup
The backend requires a PostgreSQL database. You can use the local Docker setup or a cloud instance (like Supabase).

### Option A: Local PostgreSQL (Recommended)
Run the following command from the root directory to start a local database container:
```powershell
docker-compose up -d
```

### Option B: Supabase / Cloud Instance
If you are using a cloud database, ensure your `backend/.env` file contains the correct connection string:
```env
DATABASE_URL=postgresql+asyncpg://user:password@host:port/dbname
```

---

## 2. Backend Setup

1.  **Activate Virtual Environment:**
    If you haven't created one, run `python -m venv .venv` in the root.
    ```powershell
    .\.venv\Scripts\activate
    ```

2.  **Install Dependencies:**
    From the **root directory**:
    ```powershell
    pip install -r backend/requirements.txt
    ```

3.  **Run Migrations:**
    This will create the necessary tables in your database. Run this from the **root directory**:
    ```powershell
    alembic upgrade head
    ```

4.  **Seed Data (Optional):**
    To populate the database with realistic dummy traffic data:
    ```powershell
    python data_pipeline/generate_dummy_db.py
    ```

5.  **Start the API Server:**
    ```powershell
    cd backend
    uvicorn main:app --reload --port 8000
    ```

---

## 3. Frontend Setup

1.  **Navigate to Frontend:**
    ```powershell
    cd frontend
    ```

2.  **Install Dependencies:**
    ```powershell
    npm install
    ```

3.  **Start the Dev Server:**
    ```powershell
    npm run dev
    ```

---

## 4. Troubleshooting

- **CORS Errors:** Ensure the backend `main.py` has `allow_origins=["*"]` or includes your frontend port.
- **DB Connection:** If using Docker, ensure the port `5432` isn't being used by another local Postgres service.
- **Alembic Errors:** If migrations fail, double-check your `DATABASE_URL` in `backend/.env`.
