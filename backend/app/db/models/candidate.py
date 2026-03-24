from sqlalchemy import Column, Integer, String
from app.db.session import Base

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(String, unique=True, index=True) # Urna number (e.g. 10)
    name = Column(String)
    photo_url = Column(String, nullable=True)
    role = Column(String, default="Candidate")
