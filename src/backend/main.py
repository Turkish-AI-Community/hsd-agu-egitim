import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .model import load_model, predict
from .schemas import CreditRequest, CreditResponse

# Frontend build output (built during Render build step)
FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load model once at startup
    load_model()
    yield


app = FastAPI(
    title="Credit Risk Prediction API",
    description="LightGBM-based credit risk inference service",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS: allow local dev + Render production origins
_default_origins = "http://localhost:5173,http://127.0.0.1:5173"
_origins = os.getenv("ALLOWED_ORIGINS", _default_origins).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=CreditResponse)
def predict_credit_risk(request: CreditRequest):
    return predict(request)


# Serve frontend static files in production (single-service deploy)
if FRONTEND_DIST.is_dir():
    # Serve static assets (JS, CSS, images)
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="assets")

    # Serve other static files (logo, favicon, etc.)
    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        file_path = FRONTEND_DIST / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        # SPA fallback: return index.html for all non-file routes
        return FileResponse(FRONTEND_DIST / "index.html")
