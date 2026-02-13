from pydantic import BaseModel, Field


class CreditRequest(BaseModel):
    age: int = Field(..., ge=18, description="Customer age in years")
    sex: str = Field(..., description="Gender: male / female")
    job: int = Field(..., ge=0, le=3, description="Job skill level: 0-3")
    housing: str = Field(..., description="Housing: own / rent / free")
    saving_accounts: str | None = Field(None, description="Saving account level: little / moderate / quite rich / rich")
    checking_account: str | None = Field(None, description="Checking account level: little / moderate / rich")
    credit_amount: int = Field(..., gt=0, description="Loan amount in DM")
    duration: int = Field(..., gt=0, description="Loan duration in months")
    purpose: str = Field(..., description="Loan purpose")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "age": 35,
                    "sex": "male",
                    "job": 2,
                    "housing": "own",
                    "saving_accounts": "little",
                    "checking_account": "moderate",
                    "credit_amount": 5000,
                    "duration": 24,
                    "purpose": "car",
                }
            ]
        }
    }


class CreditResponse(BaseModel):
    prediction: str = Field(..., description="Risk prediction: good / bad")
    probability: float = Field(..., description="Probability of 'bad' class")
    threshold: float = Field(..., description="Decision threshold used")
