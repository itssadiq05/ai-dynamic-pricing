from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import products, sales, dashboard, prediction, ml_info, inventory

# Initialize Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Dynamic Pricing & Demand Prediction API",
    version="1.0.0",
    description="Backend API for B.Tech Data Science & AI Project Demonstration"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach Routers
app.include_router(products.router)
app.include_router(sales.router)
app.include_router(dashboard.router)
app.include_router(prediction.router)
app.include_router(ml_info.router)
app.include_router(inventory.router)


@app.get("/")
def read_root():
    return {
        "status": "Online",
        "system": "AI Dynamic Pricing & Demand Prediction Engine",
        "docs_url": "/docs"
    }