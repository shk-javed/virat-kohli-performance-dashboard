from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.engine import URL
import os

DATABASE_URL = URL.create(
    drivername="mysql+pymysql",
    username=os.getenv("MYSQLUSER"),
    password=os.getenv("MYSQLPASSWORD"),
    host=os.getenv("MYSQLHOST"),
    port=int(os.getenv("MYSQLPORT")),
    database=os.getenv("MYSQLDATABASE"),
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()