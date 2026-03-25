# Sistema de Votação CIPA 🗳️

Este é um sistema de votação eletrônica completo desenvolvido para eleições da Comissão Interna de Prevenção de Acidentes (CIPA). O objetivo do projeto é modernizar, proteger e auditar digitalmente a eleição corporativa. 

O sistema simula com precisão a interface de uma urna eletrônica brasileira e oferece um painel administrativo seguro.

!!!Atenção esse é um sistema desenvolvido por vibe coding, use por conta e risco!!!

## Funcionalidades Principais
- 🔒 **Interface Premium e Responsiva**: Simulação exata de teclado e visor da urna eletrônica.
- 👥 **Controle de Eleitores e Mesários**: Votação em duas etapas (login da matrícula + autorização manual do mesário no painel).
- 📊 **Painel Administrativo Analítico**: Gerencie configurações, cadastre candidatos, e visualize eleitores coloridos por status de votação (votou/pendente).
- 🛡️ **Auditoria e Privacidade**: Todo o sistema gera um arquivo de log auditável e à prova de adulteração. Os votos são matematicamente e em banco de dados desvinculados dos eleitores. Não é possível descobrir "quem votou em quem".
- 📥 **Importação e Exportação**: Importe listas de eleitores via arquivos `.csv` e exporte listas de comparecimento oficiais ao final do pleito.

## Tecnologias 
* **Backend**: Python, FastAPI, SQLAlchemy, SQLite (Banco de dados relacional sem dependência de serviços externos), Pandas.
* **Frontend**: React 18, Vite, Vanilla CSS/Glassmorphism, Lucide Icons.

## Como Executar Localmente

### Pré-requisitos
- Node.js (v18+)
- Python (v3.10+)

### 1. Backend (API & Banco de Dados)
Navegue até o diretório `backend` e instale as dependências.
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # No Windows
pip install -r requirements.txt
```

Inicie o servidor local FastAPI:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
A API estará rodando em `http://localhost:8000`. A documentação nativa do FastAPI pode ser acessada em `http://localhost:8000/docs`.

### 2. Frontend (React UI)
Navegue até o diretório `frontend` e instale as dependências do Node.
```bash
cd frontend
npm install
```

Inicie o servidor de desenvolvimento:
```bash
npm run dev -- --host
```
O frontend estará acessível em `http://localhost:5173`. O parâmetro `--host` permite acessar em outras máquinas da sua rede local informando seu IP.

## Credenciais Padrão (Ambiente de Teste)
O painel admin pode ser acessado na rota `/admin/login` com as seguintes credenciais embutidas no código para demonstração de setup inicial:
* **Usuário:** `suporte`
* **Senha:** `f1i8x3k7`

> ⚠️ Atenção: Num ambiente de produção real, certifique-se de abstrair essas credenciais em variáveis de ambiente `.env`.

---
*Projeto arquitetado focando em transparência democrática corporativa.*
