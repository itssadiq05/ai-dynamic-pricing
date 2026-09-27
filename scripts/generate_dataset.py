import os
import random
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

def generate_synthetic_data():
    os.makedirs('data', exist_ok=True)
    
    np.random.seed(42)
    random.seed(42)

    categories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Fitness']
    
    products_info = [
        {'id': 1, 'name': 'Wireless Noise-Canceling Headphones', 'category': 'Electronics', 'base_price': 1999.0, 'cost_price': 1200.0, 'base_demand': 50},
        {'id': 2, 'name': 'Smart Fitness Watch', 'category': 'Electronics', 'base_price': 2999.0, 'cost_price': 1800.0, 'base_demand': 40},
        {'id': 3, 'name': 'Ergonomic Cotton T-Shirt', 'category': 'Fashion', 'base_price': 499.0, 'cost_price': 200.0, 'base_demand': 100},
        {'id': 4, 'name': 'Slim Fit Denim Jeans', 'category': 'Fashion', 'base_price': 1299.0, 'cost_price': 600.0, 'base_demand': 70},
        {'id': 5, 'name': 'Stainless Steel Water Bottle 1L', 'category': 'Home & Kitchen', 'base_price': 399.0, 'cost_price': 150.0, 'base_demand': 120},
        {'id': 6, 'name': 'Non-Stick Induction Frying Pan', 'category': 'Home & Kitchen', 'base_price': 899.0, 'cost_price': 450.0, 'base_demand': 60},
        {'id': 7, 'name': 'Data Science & Machine Learning Handbook', 'category': 'Books', 'base_price': 699.0, 'cost_price': 300.0, 'base_demand': 80},
        {'id': 8, 'name': 'Adjustable Rubber Dumbbell Set 10kg', 'category': 'Fitness', 'base_price': 1499.0, 'cost_price': 800.0, 'base_demand': 45},
    ]

    start_date = datetime(2025, 1, 1)
    end_date = datetime(2026, 3, 20)
    delta_days = (end_date - start_date).days

    dataset_rows = []

    for p in products_info:
        current_stock = random.randint(200, 500)
        
        for i in range(delta_days):
            current_date = start_date + timedelta(days=i)
            day_of_week = current_date.weekday()
            month = current_date.month
            
            # Seasonality & Holiday factors
            is_weekend = 1 if day_of_week in [5, 6] else 0
            is_holiday = 1 if (month == 10 and current_date.day in [20, 21, 22, 23, 24, 25]) or \
                              (month == 11 and current_date.day in [1, 2, 10, 11, 12]) or \
                              (month == 12 and current_date.day in [24, 25, 31]) or \
                              (month == 1 and current_date.day in [1, 26]) else 0
            
            is_promotion = 1 if random.random() < 0.15 else 0
            
            # Price fluctuations
            discount = float(np.random.choice([0, 5, 10, 15, 20], p=[0.5, 0.2, 0.15, 0.1, 0.05])) if is_promotion else 0.0
            price_variation = np.random.normal(0, p['base_price'] * 0.03)
            selling_price = round(max(p['cost_price'] * 1.05, p['base_price'] + price_variation - (p['base_price'] * (discount / 100.0))), 2)
            
            competitor_price = round(selling_price * np.random.uniform(0.90, 1.12), 2)
            
            # Calculate elasticity-based demand
            price_ratio = selling_price / p['base_price']
            elasticity_factor = (1.0 / (price_ratio ** 1.8))  # Price down -> demand up
            
            competitor_ratio = competitor_price / selling_price
            comp_factor = competitor_ratio ** 1.2  # Competitor higher -> demand up
            
            promo_boost = 1.35 if is_promotion else 1.0
            holiday_boost = 1.6 if is_holiday else 1.0
            weekend_boost = 1.2 if is_weekend else 1.0
            
            noise = np.random.normal(1.0, 0.1)
            
            calculated_demand = int(p['base_demand'] * elasticity_factor * comp_factor * promo_boost * holiday_boost * weekend_boost * noise)
            quantity_sold = max(0, min(calculated_demand, current_stock))
            
            # Stock simulation
            if current_stock - quantity_sold < 20:
                current_stock += random.randint(150, 300)
            else:
                current_stock -= quantity_sold
                
            revenue = round(quantity_sold * selling_price, 2)
            
            dataset_rows.append({
                'date': current_date.strftime('%Y-%m-%d'),
                'product_id': p['id'],
                'product_name': p['name'],
                'category': p['category'],
                'selling_price': selling_price,
                'cost_price': p['cost_price'],
                'competitor_price': competitor_price,
                'discount_percent': discount,
                'stock_available': current_stock,
                'is_promotion': is_promotion,
                'is_holiday': is_holiday,
                'quantity_sold': quantity_sold,
                'revenue': revenue
            })

    df = pd.DataFrame(dataset_rows)
    output_path = os.path.join('data', 'synthetic_ecommerce_data.csv')
    df.to_csv(output_path, index=False)
    print(f"Synthetic dataset generated successfully at {output_path}. Total rows: {len(df)}")

if __name__ == '__main__':
    generate_synthetic_data()

