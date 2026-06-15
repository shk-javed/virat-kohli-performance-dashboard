from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
from routes import router

app = FastAPI(title="Virat Kohli Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://virat-kohli-performance-dashboard.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/")
def home():
    return {"status": "API is running"}


@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    try:
        one = db.execute(text("SELECT 1")).scalar()
        tables = db.execute(text("SHOW TABLES")).all()
        return {
            "status": "DB connected",
            "select_1": one,
            "tables": [r[0] for r in tables]
        }
    except Exception as e:
        return {"status": "DB error", "message": str(e)}
