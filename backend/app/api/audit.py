from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.audit_log import AuditLog

from app.services.audit_service import log_action
from app.db.models.audit_log import AuditLog
from fastapi import APIRouter, Depends, Response
import io
import pandas as pd

router = APIRouter(prefix="/audit", tags=["audit"])

@router.get("/logs")
def get_logs(db: Session = Depends(get_db)):
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()

@router.get("/export")
def export_logs(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).all()
    # Convert to list of dicts for pandas
    log_data = [{
        "timestamp": l.timestamp,
        "user_id": l.user_id,
        "action": l.action,
        "function_code": l.function_code,
        "details": l.details,
        "ip": l.ip_address
    } for l in logs]
    
    df = pd.DataFrame(log_data)
    stream = io.StringIO()
    df.to_csv(stream, index=False)
    
    return Response(
        content=stream.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=audit_logs.csv"}
    )
