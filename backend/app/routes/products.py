from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.sql_models import Product, Category
from app.schemas.pydantic_schemas import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.get("", response_model=List[ProductResponse])
def list_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    results = []
    for p in products:
        p_dict = ProductResponse.model_validate(p)
        p_dict.category_name = p.category_rel.name if p.category_rel else "Uncategorized"
        results.append(p_dict)
    return results

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == product.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    resp = ProductResponse.model_validate(db_product)
    resp.category_name = category.name
    return resp

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product_update: ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)
    
    resp = ProductResponse.model_validate(db_product)
    resp.category_name = db_product.category_rel.name if db_product.category_rel else "Uncategorized"
    return resp

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return None

