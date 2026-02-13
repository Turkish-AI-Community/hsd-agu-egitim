import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .model import load_model, predict
from .schemas import CreditRequest, CreditResponse


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
