# EduTrack Frontend

Polished Next.js + Tailwind frontend for the EduTrack backend, with a high-contrast dashboard style inspired by the provided design system.

## Features

- Login and signup against existing FastAPI auth endpoints
- Role-aware workspace (`student` and `admin`)
- Course catalog cards in bento layout with cut-out visual treatment
- Student actions: enroll and deregister
- Admin actions: create, update, activate/deactivate, delete courses
- Admin enrollment visibility and seat-capacity snapshot

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Browser-side API client wired to existing backend routes

## Environment

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

If omitted, the app defaults to the same value above.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Backend Requirements

- Backend API should be running separately (no backend changes required)
- Required routes used by frontend:
	- `POST /signup`
	- `POST /login`
	- `GET /users/me`
	- `GET /courses`
	- `POST /courses`
	- `PUT /courses/{id}`
	- `PATCH /courses/{id}`
	- `DELETE /courses/{id}`
	- `POST /enrollments`
	- `DELETE /enrollments/course/{id}`
	- `GET /enrollments` (admin)
