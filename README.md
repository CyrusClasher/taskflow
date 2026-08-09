# TaskFlow

A simple, responsive team task & project dashboard built with React, Express, and PostgreSQL.

> This README will be expanded as the project is built out in later phases.

## Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS
**Backend:** Node.js, Express.js, TypeScript
**Database:** PostgreSQL + Prisma

## Project Structure

```
taskflow/
├── client/   # React frontend
├── server/   # Express backend
```

## Local Setup (Phase 1 status)

At this stage, both the frontend and backend run independently but are not
yet connected — the database and API routes come in later phases.

### Frontend

```bash
cd client
npm install
npm run dev
```

Visit http://localhost:5173 — you should see a "TaskFlow" heading styled with Tailwind.

### Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Visit http://localhost:5000/api/health — you should see:

```json
{ "success": true, "message": "TaskFlow API is running" }
```
