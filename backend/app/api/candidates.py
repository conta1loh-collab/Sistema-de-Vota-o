from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services import candidate_service

from app.services import candidate_service
from app.services.audit_service import log_action
from fastapi import APIRouter, Depends, Request

router = APIRouter(prefix="/candidates", tags=["candidates"])

@router.get("/")
def list_candidates(db: Session = Depends(get_db)):
    return db.query(candidate_service.Candidate).all()

@router.post("/")
def add_candidate(number: str, name: str, request: Request, photo_url: str = None, db: Session = Depends(get_db)):
    candidate = candidate_service.create_candidate(db, number, name, photo_url)
    log_action(db, "Admin", "CANDIDATE_ADDED", "CAND_001", f"Added {name} ({number})", request.client.host)
    return candidate

@router.delete("/{candidate_id}")
def remove_candidate(candidate_id: int, request: Request, db: Session = Depends(get_db)):
    candidate = candidate_service.delete_candidate(db, candidate_id)
    if candidate:
        log_action(db, "Admin", "CANDIDATE_REMOVED", "CAND_002", f"Removed ID {candidate_id}", request.client.host)
    return {"status": "deleted"}
