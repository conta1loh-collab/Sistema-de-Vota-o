from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services import voter_service

from app.services import voter_service
from app.services.audit_service import log_action
from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File
import shutil
import os

router = APIRouter(prefix="/voters", tags=["voters"])

@router.get("/")
def list_voters(db: Session = Depends(get_db)):
    return db.query(voter_service.Voter).all()

@router.post("/import")
async def import_voters(request: Request, file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_path = f"data/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        result = voter_service.import_voters_from_file(db, file_path)
        log_action(db, "Admin", "VOTER_IMPORT", "VOTER_001", f"Imported from {file.filename}", request.client.host)
        return result
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
