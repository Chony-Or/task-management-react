# Task Management Frontend

This repository contains the React + Vite frontend for the task management application. It provides the user interface for login, dashboard, team management, user administration, and task workflows.

## Architecture

- React 19 + Vite frontend
- React Router for page navigation
- Axios for API requests
- Tailwind CSS for styling
- Communicates with the Laravel backend over REST API routes
- Deployed separately on Vercel, while the backend runs on Railway

## Local setup

### Requirements

- Node.js 18+
- npm

### Steps

```bash
git clone https://github.com/Chony-Or/task-management-react.git
cd task-management-react
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Test credentials

Use any seeded accounts from the Laravel backend:

- Admin: admin@test.com / password123
- Manager: manager@test.com / password123
- Team Member: member@test.com / password123

## Environment variables

Create a .env file in the frontend root if you want to override the API URL:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

If you are using the deployed backend, you can leave it unset and the app will use the default production API URL.

## Deployment URLs

- Frontend (Vercel): https://task-management-react-nine.vercel.app
- Backend (Railway): https://task-management-laravel-api-production-b3f4.up.railway.app

## Available scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## How Laravel + React integrate

1. The React app sends HTTP requests to the Laravel API endpoints.
2. Laravel handles authentication, business logic, and database access.
3. The React app stores the auth token in browser storage and uses it for subsequent requests.
4. Both services are deployed independently, but they work together through the API.

## Project structure

```text
src/
├── App.jsx
├── App.css
├── index.css
├── main.jsx
├── config.js
└── pages/
    ├── Login.jsx
    ├── Dashboard.jsx
    ├── AddTeamForm.jsx
    ├── AddMemberForm.jsx
    └── AdminUserManagement.jsx
```
