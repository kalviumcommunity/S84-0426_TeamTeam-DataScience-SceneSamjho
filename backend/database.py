import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Create asynchronous engine with specific arguments for PgBouncer compatibility
engine = create_async_engine(
    DATABASE_URL, 
    echo=True,
    connect_args={
        "prepared_statement_cache_size": 0,
        "statement_cache_size": 0
    }
)

# Create session maker attached to the async engine
AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

# Base class for the SQLAlchemy models
Base = declarative_base()

# Dependency dependency to get a database session for endpoints
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session