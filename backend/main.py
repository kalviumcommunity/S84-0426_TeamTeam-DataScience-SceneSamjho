from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from api import router as api_router
import logging

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

# Global exception handler to ensure CORS headers are sent even on 500 errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error", "detail": str(exc)},
        headers={
            "Access-Control-Allow-Origin": "https://team-team-scene.vercel.app",
            "Access-Control-Allow-Credentials": "true",
        }
    )

# Disable strict slashes so /path/ and /path work the same way
app.router.redirect_slashes = False

# Register our entry routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Traffic Accident Insights API is running."}
