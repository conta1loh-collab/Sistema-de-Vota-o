from fastapi import Request, HTTPException
from app.core.config import settings

def verify_ip(request: Request):
    client_ip = request.client.host
    if client_ip not in settings.ALLOWED_IPS:
        raise HTTPException(status_code=403, detail="IP not allowed")
    return client_ip
