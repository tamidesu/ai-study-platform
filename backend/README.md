# AI Study Assistant — Backend

> Production-grade Django REST API powering the AI Study Assistant Platform.
> Built with clean architecture, strict separation of concerns, and full OpenAPI documentation.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [AI Module](#ai-module)
- [Authentication Flow](#authentication-flow)
- [Django Admin](#django-admin)
- [API Documentation](#api-documentation)
- [Development Commands](#development-commands)

---

## Overview

The backend is a RESTful API that serves as the sole gateway between the React frontend and all external services (PostgreSQL, Groq AI). The frontend never touches the AI API directly — all LLM calls are proxied, logged, rate-limited, and token-tracked through Django.

**Core capabilities:**

- JWT-based authentication with token blacklisting on logout
- Role-based access control — `user` and `admin` roles
- Full CRUD for study notes with search and pagination
- AI Study Assistant powered by Groq (`llama-3.1-8b-instant`)
- 4 AI modes — explain, quiz, summarize, examples
- Token usage tracking per request
- Per-user rate limiting (configurable)
- Admin panel (Jazzmin theme) + custom admin REST endpoints
- Full OpenAPI 3.0 documentation (Swagger UI + ReDoc)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Django 4.2 + Django REST Framework 3.15 |
| Auth | SimpleJWT 5.3 (access + refresh + blacklist) |
| Database | PostgreSQL 16 (Docker) |
| AI Provider | Groq API — `llama-3.1-8b-instant` |
| Env Config | python-decouple |
| CORS | django-cors-headers |
| API Docs | drf-spectacular (OpenAPI 3.0) |
| Admin UI | django-jazzmin |
| DB Driver | psycopg2-binary |

---

## Architecture

```
┌─────────────────────────────────────┐
│         React Frontend              │
│  (never touches Groq API directly)  │
└──────────────┬──────────────────────┘
               │ HTTP / JWT
               ▼
┌─────────────────────────────────────┐
│           Django REST API           │
│                                     │
│  ┌─────────┐ ┌───────┐ ┌────────┐  │
│  │  users  │ │ notes │ │   ai   │  │
│  │  app    │ │  app  │ │  app   │  │
│  └────┬────┘ └───┬───┘ └───┬────┘  │
│       │          │         │        │
│  ┌────▼──────────▼─────────▼─────┐ │
│  │         services.py           │ │
│  │    (all business logic)       │ │
│  └───────────────────────────────┘ │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       ▼               ▼
 ┌──────────┐    ┌──────────┐
 │PostgreSQL│    │ Groq API │
 │ (Docker) │    │  (LLM)   │
 └──────────┘    └──────────┘
```

**Key architectural decisions:**

- `services.py` per app — zero business logic in views or serializers
- Serializers are validation + transformation only
- `providers/` abstraction in AI app — swap Groq for any LLM by implementing `AIProvider`
- UUID primary keys on all models — no sequential ID leaks
- Custom exception handler wraps all errors as `{"error": ...}`
- Settings split: `base.py` / `development.py` — never one monolithic settings file

---

## Project Structure

```
backend/
├── manage.py
├── requirements.txt
├── .env.example
│
├── config/
│   ├── settings/
│   │   ├── base.py          # All settings, JWT, REST_FRAMEWORK, Jazzmin, Groq
│   │   └── development.py   # Extends base, DEBUG=True
│   ├── urls.py              # Root URL router
│   ├── exceptions.py        # Custom error handler → {"error": ...}
│   └── wsgi.py
│
└── apps/
    ├── users/
    │   ├── models.py         # Custom User (UUID PK, email login, role field)
    │   ├── serializers.py    # Register, Profile, UpdateProfile, AdminUser
    │   ├── views.py          # Register, Login, Logout, Profile
    │   ├── admin_views.py    # Admin-only REST endpoints
    │   ├── admin_urls.py     # /api/admin/* routes
    │   ├── services.py       # register_user, update_profile, toggle_user_block
    │   ├── permissions.py    # IsAdminRole, IsOwnerOrAdmin, IsNotBlocked
    │   └── urls.py           # /api/auth/* routes
    │
    ├── notes/
    │   ├── models.py         # Note (UUID PK, owner FK, title, content)
    │   ├── serializers.py    # NoteSerializer (read), NoteWriteSerializer (write)
    │   ├── views.py          # List/Create, Retrieve/Update/Delete
    │   ├── services.py       # get_notes_for_user (with search), create, update, delete
    │   ├── permissions.py    # IsOwnerOrAdmin
    │   └── urls.py           # /api/notes/* routes
    │
    └── ai/
        ├── models.py         # AIRequest (mode, status, token counts, saved_to_note FK)
        ├── serializers.py    # AIRequestSerializer, GeneratePromptSerializer, SaveToNoteSerializer
        ├── views.py          # Generate, History, SaveToNote, Delete, Stats
        ├── services.py       # generate_ai_response, rate limiting, note context, stats
        ├── permissions.py    # IsOwnerOfAIRequest
        ├── urls.py           # /api/ai/* routes
        └── providers/
            ├── base.py       # AIProvider (abstract) — interface contract
            └── groq_provider.py  # GroqProvider — Groq implementation with retry
```

---

## Prerequisites

- Python 3.12+
- Docker Desktop (running)
- A [Groq API key](https://console.groq.com) (free tier available)

---

## Setup & Installation

### 1. Clone and enter the backend directory

```bash
cd ai_study_platform/backend
```

### 2. Create virtual environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the required values (see [Environment Variables](#environment-variables)).

### 5. Start PostgreSQL via Docker

```bash
# From the project root (where docker-compose.yml lives)
docker compose up -d
```

### 6. Run migrations

```bash
python manage.py migrate
```

### 7. Create a superuser (admin)

```bash
python manage.py createsuperuser
# Prompts for: Email, Username, Password
```

### 8. Start the development server

```bash
python manage.py runserver 8000
```

---

## Environment Variables

Copy `.env.example` to `.env` and set these values:

```env
# Django
SECRET_KEY=your-secret-key-min-50-chars-long-change-this-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# PostgreSQL (matches docker-compose.yml)
POSTGRES_DB=ai_study_db
POSTGRES_USER=ai_study_user
POSTGRES_PASSWORD=ai_study_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5436

# Groq AI
GROQ_API_KEY=gsk_your_actual_groq_key_here
LLM_MODEL=llama-3.1-8b-instant

# Rate limiting
AI_RATE_LIMIT_PER_HOUR=20

# CORS (React dev server)
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

> **Note on ports:** If 5432–5435 are occupied by other PostgreSQL instances,
> the `docker-compose.yml` maps Docker's internal 5432 to host port **5436**.
> Adjust `POSTGRES_PORT` accordingly.

---

## Running the Project

### Start database

```bash
# From project root
docker compose up -d

# Verify it's healthy
docker ps | grep ai_study_db
```

### Start Django server

```bash
# Windows (absolute path to venv python)
"C:\path\to\backend\venv\Scripts\python.exe" manage.py runserver 8000

# macOS / Linux
python manage.py runserver 8000
```

### Verify everything is up

```
✅ API:        http://localhost:8000/api/
✅ Swagger UI: http://localhost:8000/api/docs/
✅ ReDoc:      http://localhost:8000/api/redoc/
✅ Admin:      http://localhost:8000/django-admin/
```

---

## API Endpoints

All protected endpoints require the header:
```
Authorization: Bearer <access_token>
```

All error responses follow the shape:
```json
{ "error": { "detail": "..." } }
```

---

### Auth — `/api/auth/`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register/` | Public | Register new user → returns user profile |
| `POST` | `/api/auth/login/` | Public | Login → returns `access` + `refresh` JWT |
| `POST` | `/api/auth/logout/` | Required | Blacklist the refresh token |
| `POST` | `/api/auth/token/refresh/` | Public | Exchange refresh token for new access token |
| `GET` | `/api/auth/profile/` | Required | Get current user profile |
| `PUT` | `/api/auth/profile/` | Required | Update username or password |

**Register example:**
```json
POST /api/auth/register/
{
  "email": "student@example.com",
  "username": "student",
  "password": "SecurePass123"
}
```

**Login example:**
```json
POST /api/auth/login/
{
  "email": "student@example.com",
  "password": "SecurePass123"
}
```
```json
{
  "access": "eyJhbGci...",
  "refresh": "eyJhbGci..."
}
```

---

### Notes — `/api/notes/`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/notes/` | Required | Paginated list of own notes (admin sees all) |
| `GET` | `/api/notes/?search=query` | Required | Filter notes by title or content |
| `POST` | `/api/notes/` | Required | Create a new note |
| `GET` | `/api/notes/{id}/` | Required | Get note detail |
| `PUT` | `/api/notes/{id}/` | Required | Update note (owner or admin) |
| `DELETE` | `/api/notes/{id}/` | Required | Delete note (owner or admin) |

**Create note:**
```json
POST /api/notes/
{
  "title": "Sorting Algorithms",
  "content": "Quicksort uses a pivot element to partition the array..."
}
```

**Search:**
```
GET /api/notes/?search=quicksort
```

**Paginated response shape:**
```json
{
  "count": 42,
  "next": "http://localhost:8000/api/notes/?page=2",
  "previous": null,
  "results": [ ... ]
}
```

---

### AI — `/api/ai/`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/ai/generate/` | Required | Send prompt to AI, get response |
| `GET` | `/api/ai/history/` | Required | Paginated AI request history |
| `DELETE` | `/api/ai/history/{id}/` | Required | Delete an AI request |
| `POST` | `/api/ai/save/{id}/` | Required | Link AI result to an existing note |
| `GET` | `/api/ai/stats/` | Required | User stats (notes, requests, tokens) |

**Generate request:**
```json
POST /api/ai/generate/
{
  "prompt": "Explain how binary search works",
  "mode": "explain",
  "note_id": "optional-uuid-for-context"
}
```

**Generate response:**
```json
{
  "id": "7a2639e3-...",
  "user": "student@example.com",
  "prompt": "Explain how binary search works",
  "result": "## Binary Search\n\nBinary search is...",
  "model_used": "llama-3.1-8b-instant",
  "mode": "explain",
  "status": "success",
  "prompt_tokens": 68,
  "completion_tokens": 312,
  "total_tokens": 380,
  "saved_to_note": null,
  "created_at": "2026-03-04T13:00:00Z"
}
```

**Save to note:**
```json
POST /api/ai/save/{ai_request_id}/
{
  "note_id": "6b4ce097-a34e-4903-9163-b0c6159783d4"
}
```

**Stats response:**
```json
GET /api/ai/stats/
{
  "notes_count": 12,
  "ai_requests_total": 47,
  "ai_requests_success": 45,
  "tokens_used": {
    "total": 28400,
    "prompt": 8200,
    "completion": 20200
  }
}
```

---

### Admin — `/api/admin/`

> All admin endpoints require a user with `role = "admin"`. Regular users receive **403 Forbidden**.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/users/` | Paginated list of all users |
| `PUT` | `/api/admin/users/{id}/block/` | Toggle block/unblock a user |
| `GET` | `/api/admin/notes/` | Paginated list of all notes |
| `DELETE` | `/api/admin/notes/{id}/` | Delete any note |
| `GET` | `/api/admin/ai-requests/` | All AI request logs |

---

## AI Module

### How it works

```
User request
     │
     ▼
_check_rate_limit()    ← raises 429 if exceeded
     │
     ▼
_get_note_context()    ← optional: fetches note content as context
     │
     ▼
AIRequest.create()     ← status = PENDING
     │
     ▼
GroqProvider.generate()
  ├─ Selects system prompt based on mode
  ├─ Builds user message (with optional note context)
  ├─ Calls Groq API (retry x2 on RateLimit / ConnectionError)
  └─ Returns result + token counts
     │
     ▼
AIRequest.save()       ← status = SUCCESS, tokens stored
     │
     ▼
Response to client
```

### AI Modes

Each mode sends a different system prompt to the LLM:

| Mode | Behaviour |
|---|---|
| `explain` | Clear, in-depth explanation structured for studying |
| `quiz` | 3–5 questions with correct answers |
| `summarize` | Concise, well-structured study summary |
| `examples` | 3–5 concrete, practical examples |

All modes instruct the model to output **raw Markdown** (no wrapping code fences).

### Note as Context

Pass `note_id` in the generate request to inject your note's content into the prompt:

```json
{
  "prompt": "Create a quiz on this topic",
  "mode": "quiz",
  "note_id": "6b4ce097-..."
}
```

The AI will receive:
```
Context from my notes:
Title: Sorting Algorithms
Content: Quicksort uses a pivot element...

Create a quiz on this topic
```

### Rate Limiting

Default: **20 requests per hour per user** (sliding window, DB-backed).

Configure via `.env`:
```env
AI_RATE_LIMIT_PER_HOUR=20
```

Exceeded response:
```json
HTTP 429
{
  "error": {
    "detail": "AI request limit reached (20 per hour). Try again later."
  }
}
```

### Swapping the AI Provider

The provider layer is fully abstracted:

```python
# apps/ai/providers/base.py
class AIProvider(ABC):
    @abstractmethod
    def generate(self, prompt: str, mode: str, context: str) -> dict:
        ...
```

To replace Groq with any other LLM, implement `AIProvider` and swap the import in `services.py`. No other code changes needed.

---

## Authentication Flow

```
1. POST /api/auth/register/  →  user created (role=user)
2. POST /api/auth/login/     →  access token (60 min) + refresh token (7 days)
3. All requests              →  Authorization: Bearer <access_token>
4. POST /api/auth/token/refresh/  →  new access + new refresh (old refresh blacklisted)
5. POST /api/auth/logout/    →  refresh token blacklisted, session ends
```

**Token lifetimes** (configurable in `settings/base.py`):

| Token | Lifetime |
|---|---|
| Access | 60 minutes |
| Refresh | 7 days |

**Rotation:** enabled — every refresh call issues new tokens and blacklists the old refresh token.

---

## Django Admin

URL: `http://localhost:8000/django-admin/`

Powered by **Jazzmin** — dark theme, sidebar navigation, icons per model.

**Theme:** `darkly` (Bootstrap 4 dark)

**Available sections in sidebar:**
- 👤 Users — view, create, block/unblock
- 📝 Notes — view, search, delete
- 🤖 AI Requests — full request log (read-only fields)
- 🔑 JWT Tokens — outstanding and blacklisted tokens

**To create a new admin user:**
```bash
python manage.py createsuperuser
```

**To promote an existing user to admin via shell:**
```bash
python manage.py shell -c "
from apps.users.models import User
u = User.objects.get(email='user@example.com')
u.role = 'admin'
u.is_staff = True
u.save()
"
```

---

## API Documentation

| URL | Description |
|---|---|
| `http://localhost:8000/api/docs/` | **Swagger UI** — interactive, try all endpoints |
| `http://localhost:8000/api/redoc/` | **ReDoc** — clean read-only reference |
| `http://localhost:8000/api/schema/` | Raw OpenAPI 3.0 JSON schema |

**How to authenticate in Swagger UI:**
1. Call `POST /api/auth/login/` → copy the `access` value
2. Click **Authorize** (top right, 🔒 icon)
3. Enter: `Bearer <paste_token_here>`
4. Click **Authorize** → **Close**
5. All protected endpoints are now unlocked

---

## Development Commands

```bash
# Apply migrations
python manage.py migrate

# Create new migrations after model changes
python manage.py makemigrations

# Django system check (should always return 0 issues)
python manage.py check

# Open Django shell
python manage.py shell

# Collect static files (production)
python manage.py collectstatic

# Start dev server
python manage.py runserver 8000

# Docker — start DB
docker compose up -d

# Docker — stop DB
docker compose down

# Docker — view DB logs
docker logs ai_study_db

# Docker — connect to PostgreSQL directly
docker exec -it ai_study_db psql -U ai_study_user -d ai_study_db
```

---

## Test Credentials

> For development only. Change before any deployment.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@admin.com` | `Admin1234!` |
| User | `test@test.com` | `Test1234` |

---

*Backend for AI Study Assistant Platform — built with Django 4.2 + DRF + Groq AI*
