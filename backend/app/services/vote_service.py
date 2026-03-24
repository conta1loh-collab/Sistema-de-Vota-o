from sqlalchemy.orm import Session
from app.db.models.voter import Voter
from app.db.models.candidate import Candidate
from app.db.models.audit_log import AuditLog
from app.db.models.system_state import SystemState
from app.services.audit_service import log_action
from fastapi import HTTPException

from app.db.models.vote import Vote

def is_election_open(db: Session) -> bool:
    state = db.query(SystemState).filter(SystemState.key == "ELECTION_OPEN").first()
    if not state:
        # Default to open if not set, or initialize it
        new_state = SystemState(key="ELECTION_OPEN", value="true")
        db.add(new_state)
        db.commit()
        return True
    return state.value.lower() == "true"

def cast_vote(db: Session, matricula: str, candidate_number: str, ip: str):
    from app.db.models.voted_record import VotedRecord
    
    # 1. Validate Voter
    voter = db.query(Voter).filter(Voter.matricula == matricula).first()
    if not voter:
        raise HTTPException(status_code=404, detail="Voter not found")
    
    if not is_election_open(db):
        raise HTTPException(status_code=403, detail="Election is closed")
    
    has_voted = db.query(VotedRecord).filter(VotedRecord.matricula == matricula).first()
    if has_voted:
        log_action(db, matricula, "VOTE_REJECTED", "VOTE_001", "Voter already voted", ip)
        raise HTTPException(status_code=400, detail="Voter already voted")
    
    if not voter.is_authorized:
        log_action(db, matricula, "VOTE_REJECTED", "VOTE_002", "Voter not authorized by admin", ip)
        raise HTTPException(status_code=403, detail="Voter not authorized by admin")
    
    # 2. Validate Candidate (or null for Blank/Null)
    candidate_id = None
    if candidate_number:
        candidate = db.query(Candidate).filter(Candidate.number == candidate_number).first()
        if not candidate:
            action_detail = f"Null vote (Number: {candidate_number})"
        else:
            candidate_id = candidate.id
            action_detail = f"Vote for candidate {candidate.name} ({candidate.number})"
    else:
        action_detail = "Blank vote"

    # User requested privacy: Generic message in audit logs
    privacy_action_detail = f"A matricula {matricula} terminou o processo de votação."

    # 3. Record Vote (Secret)
    vote_entry = Vote(candidate_id=candidate_id)
    db.add(vote_entry)

    # 4. Mark Voter as voted in separate table
    voted_record = VotedRecord(matricula=matricula)
    db.add(voted_record)
    
    voter.is_authorized = False # Reset for next security check if applicable
    
    # 5. Audit (Auditable action, but not linked to the 'vote_entry.id' for secrecy)
    log_action(db, matricula, "VOTE_CAST", "VOTE_003", privacy_action_detail, ip)
    
    db.commit()
    return {"status": "success"}
