from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from app.db.session import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.now)
    user_id = Column(String, nullable=True) # Matricula or 'Admin'
    action = Column(String) # e.g. "VOTE_CAST", "CANDIDATE_ADDED"
    function_code = Column(String) # For transparency req
    details = Column(String) # JSON or text details
    ip_address = Column(String)
