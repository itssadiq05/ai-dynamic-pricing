from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app.database import get_db
from app.models.sql_models import Sale, Product
from app.schemas.pydantic_schemas import SaleCreate, SaleResponse

router = APIRouter(prefix="/api/sales", tags=["Sales"])

@router.get("", response_model=List[SaleResponse])
def get_sales(
    product_id: Optional[int] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    limit: int = Query(default=100, le=1000),
    db: Session = Depends(get_db)
):
    query = db.query(Sale)
    if product_id:
        query = query.filter(Sale.product_id == product_id)
    if start_date:
        query = query.filter(Sale.date >= start_date)
    if end_date:
        query = query.filter(Sale.date <= end_date)

    sales = query.order_by(Sale.date.desc()).limit(limit).all()
    
    results = []
    for s in sales:
        s_resp = SaleResponse.model_validate(s)
        s_resp.product_name = s.product_rel.name if s.product_rel else "Unknown"
        results.append(s_resp)
    return results

@router.post("", response_model=SaleResponse, status_code=status.HTTP_201_CREATED)
def create_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == sale.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    calculated_revenue = round(sale.quantity_sold * sale.selling_price, 2)
    db_sale = Sale(
        **sale.model_dump(),
        revenue=calculated_revenue
    )
    
    # Deduct stock
    product.current_stock = max(0, product.current_stock - sale.quantity_sold)

    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)

    resp = SaleResponse.model_validate(db_sale)
    resp.product_name = product.name
    return resp

