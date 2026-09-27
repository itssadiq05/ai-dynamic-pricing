from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.sql_models import Product, Sale, Category

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_products = db.query(Product).count()
    total_sales_units = db.query(func.sum(Sale.quantity_sold)).scalar() or 0
    total_revenue = db.query(func.sum(Sale.revenue)).scalar() or 0.0
    avg_price = db.query(func.avg(Product.current_price)).scalar() or 0.0

    low_stock_count = db.query(Product).filter(Product.current_stock <= Product.min_stock).count()

    return {
        "total_products": total_products,
        "total_sales_units": int(total_sales_units),
        "total_revenue": float(total_revenue),
        "avg_product_price": float(avg_price),
        "low_stock_products": low_stock_count
    }

@router.get("/charts")
def get_dashboard_charts(db: Session = Depends(get_db)):
    # Monthly Revenue Trend
    revenue_trend = db.query(
        func.date_format(Sale.date, '%Y-%m').label('month'),
        func.sum(Sale.revenue).label('revenue'),
        func.sum(Sale.quantity_sold).label('quantity')
    ).group_by('month').order_by('month').all()

    # Category Revenue Breakdown
    category_revenue = db.query(
        Category.name,
        func.sum(Sale.revenue).label('revenue')
    ).join(Product, Product.category_id == Category.id)\
     .join(Sale, Sale.product_id == Product.id)\
     .group_by(Category.name).all()

    # Top Selling Products
    top_products = db.query(
        Product.name,
        func.sum(Sale.quantity_sold).label('total_qty')
    ).join(Sale, Sale.product_id == Product.id)\
     .group_by(Product.id, Product.name)\
     .order_by(func.sum(Sale.quantity_sold).desc()).limit(5).all()

    return {
        "revenue_trend": [{"month": r[0], "revenue": float(r[1]), "quantity": int(r[2])} for r in revenue_trend],
        "category_revenue": [{"category": c[0], "revenue": float(c[1])} for c in category_revenue],
        "top_products": [{"name": p[0], "quantity": int(p[1])} for p in top_products]
    }

