from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db

from sqlalchemy import func
from app.db.models.vote import Vote
from app.db.models.candidate import Candidate
from app.services import vote_service
from fastapi import APIRouter, Depends, Request, HTTPException

router = APIRouter(prefix="/vote", tags=["voting"])

@router.post("/")
def cast_vote(matricula: str, request: Request, candidate_number: str | None = None, db: Session = Depends(get_db)):
    return vote_service.cast_vote(db, matricula, candidate_number, request.client.host)

@router.get("/results")
def get_results(db: Session = Depends(get_db)):
    # Only allow if election is closed?
    if vote_service.is_election_open(db):
        raise HTTPException(status_code=403, detail="Election is still open. Close it to see results.")
    
    # Count votes per candidate
    results = db.query(
        Candidate.name, 
        Candidate.number, 
        func.count(Vote.id).label("total")
    ).join(Vote, Vote.candidate_id == Candidate.id, isouter=True).group_by(Candidate.id).all()
    
    # Count Blank/Null votes
    null_blank_count = db.query(func.count(Vote.id)).filter(Vote.candidate_id == None).scalar()
    
    return {
        "candidates": [{"name": r[0], "number": r[1], "votes": r[2]} for r in results],
        "null_blank": null_blank_count
    }
