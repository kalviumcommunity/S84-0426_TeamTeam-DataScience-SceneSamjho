from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import router as api_router

app = FastAPI(
    title="Traffic Accident Insights API",
    description="Backend API for logging and analyzing traffic accidents.",
    version="1.0.0"
)

# Set up CORS so the React frontend can communicate with our API without getting blocked
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, we allow all ports (e.g., localhost:3000)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register our entry routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Traffic Accident Insights API is running."}
