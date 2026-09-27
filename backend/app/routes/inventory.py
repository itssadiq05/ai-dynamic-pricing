from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.sql_models import Product, Sale

router = APIRouter(
    prefix="/api/inventory",
    tags=["Inventory"]
)


@router.get("/summary")
def get_inventory_summary(db: Session = Depends(get_db)):

    total_products = db.query(Product).count()

    total_stock = (
        db.query(func.sum(Product.current_stock)).scalar()
        or 0
    )

    low_stock = (
        db.query(Product)
        .filter(Product.current_stock <= Product.min_stock)
        .count()
    )

    out_of_stock = (
        db.query(Product)
        .filter(Product.current_stock <= 0)
        .count()
    )

    inventory_value = (
        db.query(
            func.sum(
                Product.current_stock * Product.cost_price
            )
        ).scalar()
        or 0
    )

    return {
        "total_products": total_products,
        "total_stock_units": int(total_stock),
        "low_stock_products": low_stock,
        "out_of_stock_products": out_of_stock,
        "inventory_value": float(inventory_value)
    }


@router.get("/products")
def get_inventory_products(db: Session = Depends(get_db)):

    products = (
        db.query(Product)
        .order_by(Product.current_stock.asc())
        .all()
    )

    result = []

    for product in products:

        if product.current_stock <= 0:
            stock_status = "Out of Stock"
        elif product.current_stock <= product.min_stock:
            stock_status = "Low Stock"
        else:
            stock_status = "Healthy"

        result.append({
            "id": product.id,
            "name": product.name,
            "current_stock": product.current_stock,
            "min_stock": product.min_stock,
            "cost_price": float(product.cost_price),
            "current_price": float(product.current_price),
            "stock_status": stock_status
        })

    return result