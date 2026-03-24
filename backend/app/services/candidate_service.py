from sqlalchemy.orm import Session
from app.db.models.candidate import Candidate

def create_candidate(db: Session, number: str, name: str, photo_url: str = None):
    candidate = Candidate(number=number, name=name, photo_url=photo_url)
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    return candidate

def delete_candidate(db: Session, candidate_id: int):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if candidate:
        db.delete(candidate)
        db.commit()
    return candidate
