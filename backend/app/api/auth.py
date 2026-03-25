from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.session import get_db

from app.services import voter_service, vote_service
from app.services.audit_service import log_action
from app.db.models.system_state import SystemState
from app.db.models.voted_record import VotedRecord
from app.db.models.voter import Voter

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/voter/login")
def voter_login(matricula: str, request: Request, db: Session = Depends(get_db)):
    voter = voter_service.get_voter_by_matricula(db, matricula)
    if not voter:
        log_action(db, "Unknown", "LOGIN_FAILED", "AUTH_001", f"Matricula {matricula} not found", request.client.host)
        raise HTTPException(status_code=404, detail="Matrícula não encontrada")
    
    has_voted = db.query(VotedRecord).filter(VotedRecord.matricula == matricula).first()
    if has_voted:
        log_action(db, matricula, "LOGIN_REJECTED", "AUTH_002", "Voter already voted", request.client.host)
        raise HTTPException(status_code=400, detail="Eleitor já votou")

    log_action(db, matricula, "LOGIN_STARTED", "AUTH_003", "Voter entered matricula, waiting for admin", request.client.host)
    return {"status": "waiting_confirmation", "voter_name": voter.name}

@router.post("/admin/confirm")
def admin_confirm(matricula: str, request: Request, db: Session = Depends(get_db)):
    # In a real app, this would require Admin Auth. For now, simple endpoint.
    voter = voter_service.authorize_voter(db, matricula)
    if not voter:
        raise HTTPException(status_code=404, detail="Eleitor não encontrado")
    
    log_action(db, "Admin", "VOTER_CONFIRMED", "AUTH_004", f"Admin confirmed voter {matricula}", request.client.host)
    return {"status": "authorized", "voter_name": voter.name}

@router.get("/waiting")
def get_waiting_voters(db: Session = Depends(get_db)):
    voters = db.query(Voter).all()
    voted_records = db.query(VotedRecord.matricula).all()
    voted_matriculas = {record[0] for record in voted_records}
    
    result = []
    for v in voters:
        result.append({
            "id": v.id,
            "matricula": v.matricula,
            "name": v.name,
            "is_authorized": v.is_authorized,
            "has_voted": v.matricula in voted_matriculas
        })
    return result

@router.post("/admin/login")
def admin_login(data: dict):
    # Simple hardcoded check as requested
    if data.get("username") == "mesario" and data.get("password") == "eleicao2026":
        return {"status": "success", "user": "mesario"}
    raise HTTPException(status_code=401, detail="Credenciais Inválidas")

@router.get("/election/status")
def get_election_status(db: Session = Depends(get_db)):
    is_open = vote_service.is_election_open(db)
    return {"is_open": is_open}

@router.post("/election/toggle")
def toggle_election(db: Session = Depends(get_db)):
    state = db.query(SystemState).filter(SystemState.key == "ELECTION_OPEN").first()
    if not state:
        state = SystemState(key="ELECTION_OPEN", value="true")
        db.add(state)
    
    current_val = state.value.lower() == "true"
    new_val = "false" if current_val else "true"
    state.value = new_val
    
    if new_val == "false":
        # Clear VotedRecord when election is closed as requested by the user
        db.query(VotedRecord).delete()
    
    db.commit()
    
    log_action(db, "Admin", "ELECTION_TOGGLE", "ADMIN_005", f"Election set to {'Open' if new_val == 'true' else 'Closed'}", "Server")
    return {"status": "success", "is_open": new_val == "true"}

import io
import pandas as pd
from fastapi import Response

@router.get("/voters/export-voted")
def export_voted(db: Session = Depends(get_db)):
    records = db.query(VotedRecord, Voter).join(Voter, VotedRecord.matricula == Voter.matricula).all()
    
    data = [{
        "matricula": r.VotedRecord.matricula,
        "nome": r.Voter.name,
        "data_hora_voto": r.VotedRecord.voted_at.strftime("%Y-%m-%d %H:%M:%S") if r.VotedRecord.voted_at else ""
    } for r in records]
    
    df = pd.DataFrame(data)
    stream = io.StringIO()
    df.to_csv(stream, index=False)
    
    return Response(
        content=stream.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=eleitores_que_votaram.csv"}
    )


