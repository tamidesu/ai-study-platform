# AI Study Platform — Frontend

React 18 + Vite + TailwindCSS frontend for the AI Study Assistant Platform.

## Stack

- **React 18** with React Router v6
- **Vite** dev server (port 5173)
- **TailwindCSS** for styling
- **Axios** with JWT interceptors + auto-refresh

## Setup

```bash
npm install
npm run dev
```

Backend должен работать на `http://localhost:8000`.  
Vite proxy автоматически перенаправляет `/api/*` → `http://localhost:8000/api/*`.

## Pages

| Route | Page | Access |
|-------|------|--------|
| `/` | Home landing | Public |
| `/login` | Login form | Public |
| `/register` | Registration | Public |
| `/dashboard` | Stats + recent notes | Auth |
| `/notes` | Notes list | Auth |
| `/notes/new` | Create note | Auth |
| `/notes/:id` | Note detail | Auth |
| `/notes/:id/edit` | Edit note | Auth/Admin |
| `/ai` | AI Study Assistant | Auth |
| `/profile` | Edit profile | Auth |
| `/admin` | Admin panel | Admin only |

## Project Structure

```
src/
├── api/
│   └── axios.js          # Axios instance + JWT interceptors
├── components/
│   ├── Layout.jsx         # App wrapper with nav + footer
│   ├── Navbar.jsx         # Sticky navigation
│   └── ProtectedRoute.jsx # Auth guard
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Notes/
│   │   ├── NoteList.jsx
│   │   ├── NoteCreate.jsx
│   │   ├── NoteDetail.jsx
│   │   └── NoteEdit.jsx
│   ├── AI.jsx
│   ├── Profile.jsx
│   ├── Admin.jsx
│   └── NotFound.jsx
├── store/
│   └── AuthContext.jsx    # Auth state via React Context
└── App.jsx                # Routes
```

## Auth Flow

1. Login/Register → получаем `access` + `refresh` JWT токены
2. Токены хранятся в `localStorage`
3. Axios интерсептор добавляет `Authorization: Bearer <token>` к каждому запросу
4. При 401 — автоматически обновляем токен через `/api/auth/token/refresh/`
5. Если refresh тоже истёк — редирект на `/login`
