from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.database import get_db
from app.models.sql_models import Product, PriceRecommendation
from app.schemas.pydantic_schemas import DemandPredictRequest, PriceRecommendRequest, PriceRecommendResponse
from app.services.ml_service import predict_demand_single
from app.services.pricing_engine import optimize_price

router = APIRouter(prefix="/api", tags=["Prediction & Pricing"])

@router.post("/predict/demand")
def predict_demand_endpoint(req: DemandPredictRequest, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == req.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    target_date_str = req.target_date.strftime('%Y-%m-%d') if req.target_date else datetime.now().strftime('%Y-%m-%d')
    predicted_qty = predict_demand_single(
        selling_price=req.selling_price,
        competitor_price=req.competitor_price,
        discount_percent=req.discount_percent,
        stock_available=req.stock_available,
        is_promotion=req.is_promotion,
        is_holiday=req.is_holiday,
        target_date=target_date_str
    )

    demand_category = "NORMAL"
    if predicted_qty < 30:
        demand_category = "LOW"
    elif predicted_qty > 75:
        demand_category = "HIGH"
    elif predicted_qty > 110:
        demand_category = "VERY HIGH"

    return {
        "product_id": req.product_id,
        "product_name": product.name,
        "target_date": target_date_str,
        "predicted_demand": predicted_qty,
        "demand_category": demand_category
    }

@router.get("/predict/demand/forecast/{product_id}")
def get_demand_forecast(product_id: int, days: int = 7, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    forecast_data = []
    base_date = datetime.now()

    for d in range(1, days + 1):
        future_date = base_date + timedelta(days=d)
        date_str = future_date.strftime('%Y-%m-%d')
        
        pred_qty = predict_demand_single(
            selling_price=float(product.current_price),
            competitor_price=float(product.competitor_price),
            discount_percent=0.0,
            stock_available=product.current_stock,
            is_promotion=False,
            is_holiday=(future_date.weekday() == 6),
            target_date=date_str
        )
        forecast_data.append({
            "date": date_str,
            "day": future_date.strftime('%a'),
            "predicted_demand": pred_qty
        })

    return {
        "product_id": product_id,
        "product_name": product.name,
        "horizon_days": days,
        "forecast": forecast_data
    }

@router.post("/recommend/price", response_model=PriceRecommendResponse)
def recommend_price_endpoint(req: PriceRecommendRequest, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == req.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Step 1: Get Model Demand Prediction
    predicted_demand = predict_demand_single(
        selling_price=float(product.current_price),
        competitor_price=float(product.competitor_price),
        discount_percent=0.0,
        stock_available=product.current_stock,
        is_promotion=False,
        is_holiday=False
    )

    # Step 2: Run Rules Optimization Engine
    opt = optimize_price(
        cost_price=float(product.cost_price),
        current_price=float(product.current_price),
        competitor_price=float(product.competitor_price),
        current_stock=product.current_stock,
        predicted_demand=predicted_demand,
        min_margin_percent=req.min_margin_percent,
        max_price_increase_percent=req.max_price_increase_percent,
        max_price_decrease_percent=req.max_price_decrease_percent
    )

    demand_level = "NORMAL"
    if predicted_demand > 80:
        demand_level = "HIGH"
    elif predicted_demand < 35:
        demand_level = "LOW"

    # Save to history
    rec_record = PriceRecommendation(
        product_id=product.id,
        recommended_price=opt['recommended_price'],
        current_price=product.current_price,
        predicted_demand=predicted_demand,
        price_change_percent=opt['price_change_percent'],
        explanation=opt['explanation']
    )
    db.add(rec_record)
    db.commit()

    return PriceRecommendResponse(
        product_id=product.id,
        product_name=product.name,
        current_price=float(product.current_price),
        cost_price=float(product.cost_price),
        competitor_price=float(product.competitor_price),
        current_stock=product.current_stock,
        predicted_demand=predicted_demand,
        demand_level=demand_level,
        recommended_price=opt['recommended_price'],
        expected_revenue=opt['expected_revenue'],
        price_change_percent=opt['price_change_percent'],
        explanation=opt['explanation']
    )

