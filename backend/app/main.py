from fastapi import FastAPI, Depends
from app.core.config import settings
from app.core.security import verify_ip
from app.db.session import engine, Base

from app.api import voters, candidates, auth, voting, audit
from app.db.models.voter import Voter
from app.db.models.candidate import Candidate
from app.db.models.vote import Vote
from app.db.models.audit_log import AuditLog
from app.db.models.system_state import SystemState
from app.db.models.voted_record import VotedRecord

from fastapi.middleware.cors import CORSMiddleware

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allow all. Or specify http://localhost:5173
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(voters.router)
app.include_router(candidates.router)
app.include_router(voting.router)
app.include_router(audit.router)

@app.get("/", dependencies=[Depends(verify_ip)])
async def root():
    return {"message": "CIPA Voting System API is running"}
