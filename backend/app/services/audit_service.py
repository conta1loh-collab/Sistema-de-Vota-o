from sqlalchemy.orm import Session
from app.db.models.audit_log import AuditLog

def log_action(db: Session, user_id: str, action: str, function_code: str, details: str, ip: str):
    log_entry = AuditLog(
        user_id=user_id,
        action=action,
        function_code=function_code,
        details=details,
        ip_address=ip
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
