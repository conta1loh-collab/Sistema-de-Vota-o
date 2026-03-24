from sqlalchemy import Column, Integer, String, Boolean
from app.db.session import Base

class SystemState(Base):
    __tablename__ = "system_state"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    value = Column(String)
