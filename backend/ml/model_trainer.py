import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from ml.feature_engineering import engineer_features, FEATURE_COLUMNS

def train_and_evaluate_all(csv_path: str, save_dir: str = 'saved_models'):
    os.makedirs(save_dir, exist_ok=True)
    raw_df = pd.read_csv(csv_path)
    
    # Feature engineering
    processed_df = engineer_features(raw_df)
    processed_df = processed_df.dropna(subset=FEATURE_COLUMNS + ['quantity_sold'])

    X = processed_df[FEATURE_COLUMNS]
    y = processed_df['quantity_sold']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    models = {
        'Linear Regression': LinearRegression(),
        'Random Forest Regressor': RandomForestRegressor(n_estimators=100, random_state=42),
        'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
        'XGBoost Regressor': XGBRegressor(n_estimators=100, learning_rate=0.08, random_state=42)
    }

    results = []
    best_r2 = -float('inf')
    best_model_obj = None
    best_model_name = ""

    for name, model in models.items():
        model.fit(X_train, y_train)
        preds = model.predict(X_test)

        mae = mean_absolute_error(y_test, preds)
        rmse = np.sqrt(mean_squared_error(y_test, preds))
        r2 = r2_score(y_test, preds)

        is_best = False
        if r2 > best_r2:
            best_r2 = r2
            best_model_obj = model
            best_model_name = name

        results.append({
            'model_name': name,
            'mae': float(mae),
            'rmse': float(rmse),
            'r2_score': float(r2),
            'dataset_size': len(processed_df),
            'features_used': FEATURE_COLUMNS,
            'is_selected': False
        })

    # Mark best model
    for r in results:
        if r['model_name'] == best_model_name:
            r['is_selected'] = True

    # Persist best model artifact
    model_filepath = os.path.join(save_dir, 'best_model.pkl')
    joblib.dump({'model': best_model_obj, 'features': FEATURE_COLUMNS, 'name': best_model_name}, model_filepath)

    return results, best_model_name

