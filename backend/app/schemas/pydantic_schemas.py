from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    category_id: int
    current_price: float = Field(gt=0)
    cost_price: float = Field(gt=0)
    current_stock: int = Field(ge=0)
    min_stock: int = Field(default=10, ge=0)
    competitor_price: float = Field(gt=0)
    status: Optional[str] = "Active"

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[int] = None
    current_price: Optional[float] = None
    cost_price: Optional[float] = None
    current_stock: Optional[int] = None
    min_stock: Optional[int] = None
    competitor_price: Optional[float] = None
    status: Optional[str] = None

class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    category_name: Optional[str] = None

    class Config:
        from_attributes = True

class SaleBase(BaseModel):
    product_id: int
    date: date
    quantity_sold: int = Field(ge=0)
    selling_price: float = Field(gt=0)
    discount_percent: float = Field(default=0.0, ge=0, le=100)
    competitor_price: float = Field(gt=0)
    stock_available: int = Field(ge=0)
    is_promotion: bool = False
    is_holiday: bool = False

class SaleCreate(SaleBase):
    pass

class SaleResponse(SaleBase):
    id: int
    revenue: float
    product_name: Optional[str] = None

    class Config:
        from_attributes = True

class DemandPredictRequest(BaseModel):
    product_id: int
    selling_price: float
    competitor_price: float
    discount_percent: float = 0.0
    stock_available: int
    is_promotion: bool = False
    is_holiday: bool = False
    target_date: Optional[date] = None

class PriceRecommendRequest(BaseModel):
    product_id: int
    min_margin_percent: float = Field(default=15.0, ge=0.0)
    max_price_increase_percent: float = Field(default=20.0, ge=0.0)
    max_price_decrease_percent: float = Field(default=20.0, ge=0.0)

class PriceRecommendResponse(BaseModel):
    product_id: int
    product_name: str
    current_price: float
    cost_price: float
    competitor_price: float
    current_stock: int
    predicted_demand: int
    demand_level: str
    recommended_price: float
    expected_revenue: float
    price_change_percent: float
    explanation: str

class MLMetricsResponse(BaseModel):
    id: int
    model_name: str
    mae: float
    rmse: float
    r2_score: float
    training_date: datetime
    dataset_size: int
    features_used: List[str]
    is_selected: bool

    class Config:
        from_attributes = True

