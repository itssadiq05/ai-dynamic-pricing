import pandas as pd
import numpy as np

FEATURE_COLUMNS = [
    'selling_price', 'competitor_price', 'discount_percent', 'stock_available',
    'is_promotion', 'is_holiday', 'day_of_week', 'month', 'is_weekend',
    'price_diff_competitor', 'discount_amount', 'stock_to_price_ratio',
    'lag_7_sales', 'rolling_7_mean_sales'
]

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Transforms raw sales DataFrame into feature matrix avoiding data leakage.
    """
    data = df.copy()
    data['date'] = pd.to_datetime(data['date'])
    data = data.sort_values(by=['product_id', 'date']).reset_index(drop=True)

    # Date-based features
    data['day_of_week'] = data['date'].dt.dayofweek
    data['month'] = data['date'].dt.month
    data['is_weekend'] = data['day_of_week'].apply(lambda x: 1 if x in [5, 6] else 0)

    # Derived domain features
    data['price_diff_competitor'] = data['competitor_price'] - data['selling_price']
    data['discount_amount'] = data['selling_price'] * (data['discount_percent'] / 100.0)
    data['stock_to_price_ratio'] = data['stock_available'] / (data['selling_price'] + 1e-5)

    # Lag and Rolling features calculated PER product
    data['lag_7_sales'] = data.groupby('product_id')['quantity_sold'].shift(7).fillna(data['quantity_sold'].median())
    data['rolling_7_mean_sales'] = data.groupby('product_id')['quantity_sold'].shift(1).rolling(window=7, min_periods=1).mean().fillna(data['quantity_sold'].median())

    return data

