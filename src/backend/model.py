import pickle
from pathlib import Path

import pandas as pd

from .feature_eng import engineer_features
from .schemas import CreditRequest, CreditResponse

MODEL_PATH = Path(__file__).resolve().parent.parent.parent / "models" / "lightgbm_tuned_pipeline.pkl"
THRESHOLD = 0.30

# Column names matching the training data
COLUMNS = [
    "Age", "Sex", "Job", "Housing", "Saving accounts",
    "Checking account", "Credit amount", "Duration", "Purpose",
]

_pipeline = None


def load_model():
    global _pipeline
    with open(MODEL_PATH, "rb") as f:
        _pipeline = pickle.load(f)


def predict(request: CreditRequest) -> CreditResponse:
    # Build a single-row DataFrame with training column names
    row = {
        "Age": request.age,
        "Sex": request.sex,
        "Job": request.job,
        "Housing": request.housing,
        "Saving accounts": request.saving_accounts,
        "Checking account": request.checking_account,
        "Credit amount": request.credit_amount,
        "Duration": request.duration,
        "Purpose": request.purpose,
    }
    df = pd.DataFrame([row])

    # Apply feature engineering (before pipeline)
    df = engineer_features(df)

    # Pipeline handles preprocessing + prediction
    prob_bad = float(_pipeline.predict_proba(df)[:, 1][0])
    prediction = "bad" if prob_bad >= THRESHOLD else "good"

    return CreditResponse(
        prediction=prediction,
        probability=round(prob_bad, 4),
        threshold=THRESHOLD,
    )
