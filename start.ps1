# Script para iniciar o backend e frontend do Sistema de Votação (CIPA)
# Funciona de qualquer diretório graças ao caminho absoluto

$projectPath = "C:\Users\jlyra\Documents\sistemaVoto"

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Iniciando o Sistema de Votação..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# 1. Backend (FastAPI)
Write-Host "`n[1/2] Iniciando Backend (FastAPI) em uma nova janela..." -ForegroundColor Yellow
$backendCmd = "Set-Location '$projectPath\backend'; if (Test-Path '.\venv\Scripts\activate.ps1') { .\venv\Scripts\activate.ps1 } else { Write-Host 'Aviso: Ambiente virtual nao encontrado. Rodando globalmente...' -ForegroundColor Red; Start-Sleep 2 }; uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

# Aguarda o backend subir
Start-Sleep -Seconds 3

# 2. Frontend (React/Vite)
Write-Host "`n[2/2] Iniciando Frontend (React/Vite) em uma nova janela..." -ForegroundColor Green
$frontendCmd = "Set-Location '$projectPath\frontend'; npm run dev -- --host"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "Tudo pronto! Acesse: http://localhost:5173" -ForegroundColor Green
Write-Host "Admin: http://localhost:5173/admin/login   (mesario / eleicao2026)" -ForegroundColor White
Write-Host "==================================" -ForegroundColor Cyan
