from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import router as api_router

app = FastAPI(
    title="Traffic Accident Insights API",
    description="Backend API for logging and analyzing traffic accidents.",
    version="1.0.0"
)

# Set up CORS so the React frontend can communicate with our API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://team-team-scene.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Disable strict slashes so /path/ and /path work the same way
app.router.redirect_slashes = False

# Register our entry routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Traffic Accident Insights API is running."}
