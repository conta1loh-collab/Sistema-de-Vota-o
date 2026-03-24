from sqlalchemy import Column, Integer, String, DateTime
from app.db.session import Base
from datetime import datetime

class VotedRecord(Base):
    __tablename__ = "voted_records"

    id = Column(Integer, primary_key=True, index=True)
    matricula = Column(String, unique=True, index=True)
    voted_at = Column(DateTime, default=datetime.now)
