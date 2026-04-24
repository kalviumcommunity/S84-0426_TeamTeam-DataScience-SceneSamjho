# Deployment Guide

You can deploy both the backend and frontend to Vercel. The most reliable way to do this for a FastAPI + React project is to treat them as two separate Vercel projects pointing to the same repository.

---

## 1. Backend Deployment (FastAPI)

Vercel supports Python through Serverless Functions.

### Step 1: Add `vercel.json` to the `backend` directory
Create a file at `backend/vercel.json` with this content:
```json
{
  "builds": [
    {
      "src": "main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "main.py"
    }
  ]
}
```

### Step 2: Deploy on Vercel
1.  Go to [Vercel](https://vercel.com) and click **"Add New" -> "Project"**.
2.  Import your GitHub repository.
3.  In the "Project Settings":
    - **Root Directory**: Select `backend`.
    - **Environment Variables**: Add `DATABASE_URL` (your Supabase string).
4.  Click **Deploy**.

---

## 2. Frontend Deployment (React/Vite)

### Step 1: Update Frontend API URL
Ensure your frontend code uses an environment variable for the API URL (e.g., `import.meta.env.VITE_API_URL`). In development, this is `http://localhost:8000`, but in production, it will be your Vercel backend URL.

### Step 2: Deploy on Vercel
1.  Create another **New Project** on Vercel using the same repository.
2.  In the "Project Settings":
    - **Root Directory**: Select `frontend`.
    - **Framework Preset**: Vite.
    - **Build Command**: `npm run build`.
    - **Output Directory**: `dist`.
    - **Environment Variables**: Add `VITE_API_URL` and set it to your **Backend Vercel URL** (e.g., `https://your-backend.vercel.app/api/v1`).
3.  Click **Deploy**.

---

## 3. Important Notes

- **Database**: Vercel is serverless, so you **cannot** use a local Docker database. You must use a cloud database like **Supabase** or **Neon**. Your `DATABASE_URL` is already pointing to Supabase, so it should work fine!
- **CORS**: In `backend/main.py`, ensure `allow_origins` includes your Frontend Vercel URL to prevent "CORS" blocks.
- **Migrations**: Vercel won't automatically run `alembic upgrade head`. You should run this command locally once pointing to your production database before deploying.
