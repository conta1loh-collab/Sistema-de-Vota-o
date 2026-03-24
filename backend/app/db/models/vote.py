from sqlalchemy import Column, Integer, ForeignKey
from app.db.session import Base

class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=True) # Null for Blank/Null
