from sqlalchemy import Column, Integer, String, Boolean
from app.db.session import Base

class Voter(Base):
    __tablename__ = "voters"

    id = Column(Integer, primary_key=True, index=True)
    matricula = Column(String, unique=True, index=True)
    name = Column(String)
    has_voted = Column(Boolean, default=False)
    is_authorized = Column(Boolean, default=False) # For the 2nd layer confirmation
