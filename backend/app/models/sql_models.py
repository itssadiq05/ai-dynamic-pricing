from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, Date, DateTime, Boolean, Text, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    products = relationship("Product", back_populates="category_rel")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    current_price = Column(Numeric(10, 2), nullable=False)
    cost_price = Column(Numeric(10, 2), nullable=False)
    current_stock = Column(Integer, default=0, nullable=False)
    min_stock = Column(Integer, default=10, nullable=False)
    competitor_price = Column(Numeric(10, 2), nullable=False)
    status = Column(Enum('Active', 'Inactive', 'Discontinued'), default='Active')
    created_at = Column(DateTime, server_default=func.now())

    category_rel = relationship("Category", back_populates="products")
    sales = relationship("Sale", back_populates="product_rel")
    recommendations = relationship("PriceRecommendation", back_populates="product_rel")

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    quantity_sold = Column(Integer, nullable=False)
    selling_price = Column(Numeric(10, 2), nullable=False)
    discount_percent = Column(Numeric(5, 2), default=0.00)
    competitor_price = Column(Numeric(10, 2), nullable=False)
    stock_available = Column(Integer, nullable=False)
    is_promotion = Column(Boolean, default=False)
    is_holiday = Column(Boolean, default=False)
    revenue = Column(Numeric(12, 2), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    product_rel = relationship("Product", back_populates="sales")

class ModelMetrics(Base):
    __tablename__ = "model_metrics"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(100), nullable=False)
    mae = Column(Numeric(10, 4), nullable=False)
    rmse = Column(Numeric(10, 4), nullable=False)
    r2_score = Column(Numeric(10, 4), nullable=False)
    training_date = Column(DateTime, server_default=func.now())
    dataset_size = Column(Integer, nullable=False)
    features_used = Column(JSON, nullable=False)
    is_selected = Column(Boolean, default=False)

class PriceRecommendation(Base):
    __tablename__ = "price_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    recommended_price = Column(Numeric(10, 2), nullable=False)
    current_price = Column(Numeric(10, 2), nullable=False)
    predicted_demand = Column(Integer, nullable=False)
    price_change_percent = Column(Numeric(5, 2), nullable=False)
    explanation = Column(Text, nullable=False)
    generated_at = Column(DateTime, server_default=func.now())

    product_rel = relationship("Product", back_populates="recommendations")

