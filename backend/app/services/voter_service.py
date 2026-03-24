from sqlalchemy.orm import Session
from app.db.models.voter import Voter
import pandas as pd

def get_voter_by_matricula(db: Session, matricula: str):
    return db.query(Voter).filter(Voter.matricula == matricula).first()

def import_voters_from_file(db: Session, file_path: str):
    if file_path.endswith('.csv'):
        df = pd.read_csv(file_path, dtype={'matricula': str})
    elif file_path.endswith('.xlsx') or file_path.endswith('.xls'):
        df = pd.read_excel(file_path, dtype={'matricula': str})
    else:
        raise ValueError("Unsupported file format")
    
    # Expecting columns: 'matricula', 'nome'
    for _, row in df.iterrows():
        matricula = str(row['matricula'])
        name = row['nome']
        
        existing = get_voter_by_matricula(db, matricula)
        if not existing:
            voter = Voter(matricula=matricula, name=name)
            db.add(voter)
    
    db.commit()
    return {"status": "success", "imported": len(df)}

def authorize_voter(db: Session, matricula: str):
    voter = get_voter_by_matricula(db, matricula)
    if voter:
        voter.is_authorized = True
        db.commit()
    return voter

def reset_voter_authorization(db: Session, matricula: str):
    voter = get_voter_by_matricula(db, matricula)
    if voter:
        voter.is_authorized = False
        db.commit()
    return voter
