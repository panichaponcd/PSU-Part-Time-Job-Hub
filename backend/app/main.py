import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from fastapi.responses import RedirectResponse
from app.config import MEDIA_DIR, CORS_ORIGINS
from app.database import Base, engine
from app.routers import (
    auth_router,
    jobs_router,
    applications_router,
    students_router,
    evaluations_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure all database tables exist on startup
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="PSU Part-Time Job Hub API",
    description="High-performance FastAPI Backend for Prince of Songkla University, Phuket Campus",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows local React dev server and Tailscale funnel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dual-endpoint documentation support (for reverse proxies routing /api/*)
@app.get("/api/docs", include_in_schema=False)
async def api_swagger_ui():
    return get_swagger_ui_html(
        openapi_url="/api/openapi.json",
        title=app.title + " - Swagger UI"
    )

@app.get("/api/redoc", include_in_schema=False)
async def api_redoc():
    return get_redoc_html(
        openapi_url="/api/openapi.json",
        title=app.title + " - ReDoc"
    )

@app.get("/openapi.json", include_in_schema=False)
async def openapi_redirect():
    return RedirectResponse(url="/api/openapi.json")

# Mount media static files directory (for posters, certificates, avatar images)
if MEDIA_DIR.exists():
    app.mount("/media", StaticFiles(directory=str(MEDIA_DIR)), name="media")

# Include Routers
app.include_router(auth_router)
app.include_router(jobs_router)
app.include_router(applications_router)
app.include_router(students_router)
app.include_router(evaluations_router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "PSU Part-Time Job Hub API (FastAPI)",
        "version": "2.0.0",
        "docs": "/api/docs",
        "redoc": "/api/redoc"
    }

@app.get("/api")
def api_root():
    return root()

@app.get("/api/health")
def health():
    return {"status": "healthy"}
