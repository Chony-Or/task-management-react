# Task Management Frontend

A React + Vite frontend for a role-based task management system. It connects to a Laravel backend and allows admins, managers, and team members to manage tasks, teams, and users through a simple dashboard experience.

## Features

- User login with JWT authentication
- Role-based access for admin, manager, and team member
- Create, view, and update tasks
- Assign tasks to team members
- Create teams
- Add and manage users
- Toggle user active/inactive status
- Connected to a deployed Laravel API

## Tech Stack

- React 19
- Vite 8
- React Router
- Axios
- Tailwind CSS

## Project Structure

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

## Roles

- Admin: Full access to tasks, users, teams, and member management
- Manager: Can view all tasks and manage task assignments
- Team Member: Can view only tasks assigned to them

## API Configuration

The frontend is configured to use the deployed Laravel API at:

- https://task-management-laravel-api-production-b3f4.up.railway.app:8000/api

You can override this by setting a Vite environment variable:

```env
VITE_API_BASE_URL=https://your-backend-url/api
```

If you are using a local Laravel backend, update the API base URL in the config file or environment variable accordingly.

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

```bash
npm install
```

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Running Locally

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Production Build

```bash
npm run build
```

## Authentication Flow

1. User signs in from the login page.
2. The backend returns a token.
3. The token is stored in localStorage.
4. The token is attached to API requests in the Authorization header.
5. The dashboard loads tasks and users based on the authenticated role.

## Notes

- The app uses localStorage for the auth token.
- API requests are centralized in the frontend config to make environment changes easier.
- If the backend routes change, update the API base URL and endpoint paths in the relevant page files.
