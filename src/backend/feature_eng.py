import pandas as pd


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Apply feature engineering identical to the training notebook."""
    df = df.copy()

    df["credit_per_month"] = df["Credit amount"] / df["Duration"].replace(0, 1)
    df["credit_to_age"] = df["Credit amount"] / df["Age"]

    saving_map = {"little": 1, "moderate": 2, "quite rich": 3, "rich": 4}
    checking_map = {"little": 1, "moderate": 2, "rich": 3}
    df["saving_score"] = df["Saving accounts"].map(saving_map).fillna(0)
    df["checking_score"] = df["Checking account"].map(checking_map).fillna(0)

    return df
