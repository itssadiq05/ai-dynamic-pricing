import os
import pandas as pd
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.sql_models import Category, Product, Sale, ModelMetrics
from ml.model_trainer import train_and_evaluate_all

def seed_all():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    csv_path = os.path.join('..', 'data', 'synthetic_ecommerce_data.csv')
    if not os.path.exists(csv_path):
        csv_path = os.path.join('data', 'synthetic_ecommerce_data.csv')

    print("Reading dataset...")
    df = pd.read_csv(csv_path)

    # 1. Seed Categories & Products
    print("Seeding Categories and Products...")
    categories_unique = df['category'].unique()
    cat_map = {}
    
    for c_name in categories_unique:
        existing_cat = db.query(Category).filter(Category.name == c_name).first()
        if not existing_cat:
            new_cat = Category(name=c_name, description=f"{c_name} product collection")
            db.add(new_cat)
            db.commit()
            db.refresh(new_cat)
            cat_map[c_name] = new_cat.id
        else:
            cat_map[c_name] = existing_cat.id

    prod_map = {}
    products_unique = df[['product_id', 'product_name', 'category', 'cost_price']].drop_duplicates()
    
    for _, row in products_unique.iterrows():
        p_id = int(row['product_id'])
        existing_p = db.query(Product).filter(Product.id == p_id).first()
        
        # Calculate recent average price & stock
        recent_p = df[df['product_id'] == p_id].iloc[-1]
        
        if not existing_p:
            new_prod = Product(
                id=p_id,
                name=row['product_name'],
                category_id=cat_map[row['category']],
                current_price=recent_p['selling_price'],
                cost_price=row['cost_price'],
                current_stock=int(recent_p['stock_available']),
                min_stock=25,
                competitor_price=recent_p['competitor_price'],
                status='Active'
            )
            db.add(new_prod)
            db.commit()
            prod_map[p_id] = new_prod.id

    # 2. Seed Sales (Limit to last 500 records for performance)
    print("Seeding Sales transactions...")
    if db.query(Sale).count() == 0:
        sales_records = []
        for _, r in df.tail(1000).iterrows():
            sales_records.append(Sale(
                product_id=int(r['product_id']),
                date=r['date'],
                quantity_sold=int(r['quantity_sold']),
                selling_price=float(r['selling_price']),
                discount_percent=float(r['discount_percent']),
                competitor_price=float(r['competitor_price']),
                stock_available=int(r['stock_available']),
                is_promotion=bool(r['is_promotion']),
                is_holiday=bool(r['is_holiday']),
                revenue=float(r['revenue'])
            ))
        db.bulk_save_objects(sales_records)
        db.commit()

    # 3. Train Models & Seed Evaluation Metrics
    print("Training ML Models and generating evaluation report...")
    metrics_list, best_name = train_and_evaluate_all(csv_path)

    db.query(ModelMetrics).delete()
    for m in metrics_list:
        db.add(ModelMetrics(
            model_name=m['model_name'],
            mae=m['mae'],
            rmse=m['rmse'],
            r2_score=m['r2_score'],
            dataset_size=m['dataset_size'],
            features_used=m['features_used'],
            is_selected=m['is_selected']
        ))
    db.commit()
    print("Database seeding & model training completed successfully!")

if __name__ == '__main__':
    seed_all()

