# AI Dynamic Pricing & Demand Prediction

B.Tech Data Science & AI/ML project.

## Run
1. Create MySQL database using `database_schema.sql`.
2. In `backend`, create venv, install requirements, copy `.env.example` to `.env`.
3. From root run `python scripts/generate_dataset.py`.
4. From backend run `python seed_data.py`.
5. Run `uvicorn app.main:app --reload --port 8000`.
6. In `frontend`, run `npm install` then `npm run dev`.
