import os
import joblib
import pandas as pd
import numpy as np
from datetime import datetime

MODEL_PATH = os.path.join('saved_models', 'best_model.pkl')

def load_prediction_model():
    if not os.path.exists(MODEL_PATH):
        return None
    return joblib.load(MODEL_PATH)

def predict_demand_single(
    selling_price: float,
    competitor_price: float,
    discount_percent: float,
    stock_available: int,
    is_promotion: bool,
    is_holiday: bool,
    target_date: str = None
) -> int:
    model_artifact = load_prediction_model()
    
    if target_date:
        dt = datetime.strptime(target_date, "%Y-%m-%d")
    else:
        dt = datetime.now()

    day_of_week = dt.weekday()
    month = dt.month
    is_weekend = 1 if day_of_week in [5, 6] else 0

    price_diff_competitor = competitor_price - selling_price
    discount_amount = selling_price * (discount_percent / 100.0)
    stock_to_price_ratio = stock_available / (selling_price + 1e-5)
    
    # Sensible defaults for lag parameters in single ad-hoc predictions
    lag_7_sales = 40.0
    rolling_7_mean_sales = 42.0

    feature_dict = {
        'selling_price': [selling_price],
        'competitor_price': [competitor_price],
        'discount_percent': [discount_percent],
        'stock_available': [stock_available],
        'is_promotion': [1 if is_promotion else 0],
        'is_holiday': [1 if is_holiday else 0],
        'day_of_week': [day_of_week],
        'month': [month],
        'is_weekend': [is_weekend],
        'price_diff_competitor': [price_diff_competitor],
        'discount_amount': [discount_amount],
        'stock_to_price_ratio': [stock_to_price_ratio],
        'lag_7_sales': [lag_7_sales],
        'rolling_7_mean_sales': [rolling_7_mean_sales]
    }

    df_features = pd.DataFrame(feature_dict)

    if model_artifact and 'model' in model_artifact:
        pred = model_artifact['model'].predict(df_features)[0]
        return max(0, int(round(pred)))
    else:
        # Heuristic fall-back if model file is uninitialized
        base_demand = 50
        price_factor = (competitor_price / max(1.0, selling_price)) ** 1.5
        promo_factor = 1.3 if is_promotion else 1.0
        holiday_factor = 1.5 if is_holiday else 1.0
        return max(0, int(round(base_demand * price_factor * promo_factor * holiday_factor)))

