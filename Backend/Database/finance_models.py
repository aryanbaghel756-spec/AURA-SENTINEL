"""
AURA SENTINEL - Financial Intelligence SQLAlchemy ORM Models
Defines persistent database schemas for user financial profiles,
market data snapshots, suitability analysis results, and scenario simulations.
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Generator

from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    Float,
    String,
    Boolean,
    Text,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import declarative_base, sessionmaker, Session, relationship

DB_DIR = Path(__file__).resolve().parent
DB_PATH = DB_DIR / "aura_sentinel.db"
DATABASE_URL = f"sqlite:///{DB_PATH.as_posix()}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class FinancialProfile(Base):
    __tablename__ = "financial_profiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    investment_amount = Column(Float, nullable=False)
    duration_years = Column(Integer, nullable=False)
    risk_profile = Column(String(50), nullable=False)  # conservative, moderate, aggressive
    liquidity_requirement = Column(String(50), nullable=False)  # low, medium, high
    goal = Column(String(50), nullable=False)  # capital_preservation, balanced_growth, growth
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    analyses = relationship("AnalysisResult", back_populates="profile", cascade="all, delete-orphan")
    simulations = relationship("SimulationResult", back_populates="profile", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "investment_amount": self.investment_amount,
            "duration_years": self.duration_years,
            "risk_profile": self.risk_profile,
            "liquidity_requirement": self.liquidity_requirement,
            "goal": self.goal,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class MarketSnapshot(Base):
    __tablename__ = "market_snapshots"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    provider = Column(String(100), nullable=False)
    is_mock = Column(Boolean, default=True, nullable=False)
    snapshot_json = Column(Text, nullable=False)
    volatility_index = Column(Float, default=0.0, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        try:
            parsed = json.loads(self.snapshot_json)
        except Exception:
            parsed = {}
        return {
            "id": self.id,
            "provider": self.provider,
            "is_mock": self.is_mock,
            "volatility_index": self.volatility_index,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "data": parsed,
        }


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    profile_id = Column(Integer, ForeignKey("financial_profiles.id"), nullable=True)
    category = Column(String(50), nullable=False)
    suitability_score = Column(Float, nullable=False)
    risk_match = Column(Float, nullable=False)
    stability_score = Column(Float, nullable=False)
    liquidity_score = Column(Float, nullable=False)
    explanation = Column(Text, nullable=False)
    breakdown_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    profile = relationship("FinancialProfile", back_populates="analyses")

    def to_dict(self):
        try:
            breakdown = json.loads(self.breakdown_json)
        except Exception:
            breakdown = {}
        return {
            "id": self.id,
            "profile_id": self.profile_id,
            "category": self.category,
            "suitability_score": self.suitability_score,
            "risk_match": self.risk_match,
            "stability_score": self.stability_score,
            "liquidity_score": self.liquidity_score,
            "explanation": self.explanation,
            "breakdown": breakdown,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class SimulationResult(Base):
    __tablename__ = "simulation_results"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    profile_id = Column(Integer, ForeignKey("financial_profiles.id"), nullable=True)
    initial_amount = Column(Float, nullable=False)
    duration_years = Column(Integer, nullable=False)
    category = Column(String(50), nullable=False)
    simulation_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    profile = relationship("FinancialProfile", back_populates="simulations")

    def to_dict(self):
        try:
            sim_data = json.loads(self.simulation_json)
        except Exception:
            sim_data = {}
        return {
            "id": self.id,
            "profile_id": self.profile_id,
            "initial_amount": self.initial_amount,
            "duration_years": self.duration_years,
            "category": self.category,
            "scenarios": sim_data.get("scenarios", {}),
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


def init_finance_db():
    """Initializes SQLAlchemy tables in aura_sentinel.db without disturbing existing tables."""
    Base.metadata.create_all(bind=engine)


def get_finance_db() -> Generator[Session, None, None]:
    """Dependency injection helper for FastAPI endpoints."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
