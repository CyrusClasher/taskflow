# TaskFlow

A responsive team task & project dashboard, built as a full-stack portfolio
project. TaskFlow lets you create projects, break them into tasks, and track
progress on a Trello/Linear-style board with search, filtering, and sorting.

## Features

- Create, edit, and delete projects
- Create, edit, and delete tasks within a project
- Three-column task board (Todo / In Progress / Done)
- Change task status, priority, and due date
- Search tasks by title/description
- Filter tasks by status and priority (combinable)
- Sort tasks by due date, priority, or creation date
- Project-level stats (total tasks, tasks per status, % complete)
- Loading, empty, and error states throughout
- Fully responsive: desktop, tablet, and mobile
- Form validation on both frontend and backend

## Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router
**Backend:** Node.js, Express.js, TypeScript, Zod
**Database:** PostgreSQL, Prisma ORM

## Architecture

```mermaid
flowchart LR
    A[React + TypeScript<br/>Vite / Tailwind] -- REST (fetch) --> B[Express API<br/>TypeScript]
    B -- Prisma Client --> C[(PostgreSQL)]
```

The frontend is a single-page React app that talks to the Express API over a
plain REST interface (`fetch`, JSON). The API validates input with Zod,
performs CRUD operations through Prisma, and returns a consistent
`{ success, data }` / `{ success, message }` response shape. There's no
authentication in this version — see [Future Improvements](#future-improvements).

## Project Structure

```
taskflow/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Reusable UI pieces (cards, forms, modals, states)
│       ├── pages/          # Dashboard, ProjectPage
│       ├── hooks/          # useFilteredTasks (search/filter/sort)
│       ├── services/       # API layer (fetch wrapper + project/task calls)
│       ├── types/          # Shared TypeScript types
│       └── utils/          # Formatting helpers
│
├── server/                 # Express backend
│   ├── prisma/
│   │   ├── schema.prisma   # Project + Task models
│   │   ├── migrations/
│   │   └── seed.ts
│   └── src/
│       ├── routes/
│       ├── controllers/
│       ├── middleware/     # Centralized error handler
│       └── lib/            # Prisma client, Zod schemas
│
└── README.md
```

## Local Setup

### Prerequisites

- Node.js 18+
- A PostgreSQL database (local install, or a free hosted instance like
  [Neon](https://neon.tech))

### 1. Clone and install

```bash
git clone <your-repo-url>
cd taskflow

cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

**server/.env** (copy from `server/.env.example`):

```
DATABASE_URL="postgresql://user:password@localhost:5432/taskflow"
PORT=5000
```

**client/.env** (copy from `client/.env.example`):

```
VITE_API_URL=http://localhost:5000/api
```

### 3. Set up the database

```bash
cd server
npx prisma generate
npx prisma migrate dev
npm run db:seed
```

This creates the `Project` and `Task` tables and adds 3 sample projects with
realistic tasks, so the app isn't empty on first run.

### 4. Run the app

```bash
# Terminal 1 — backend
cd server
npm run dev        # http://localhost:5000

# Terminal 2 — frontend
cd client
npm run dev         # http://localhost:5173
```

Visit **http://localhost:5173**.

## API Endpoints

All routes are prefixed with `/api`. Every response is either
`{ "success": true, "data": ... }` or `{ "success": false, "message": ... }`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects` | List all projects (with their tasks) |
| POST | `/projects` | Create a project |
| GET | `/projects/:id` | Get one project and its tasks |
| PUT | `/projects/:id` | Update a project |
| DELETE | `/projects/:id` | Delete a project (cascades to its tasks) |
| GET | `/projects/:projectId/tasks` | List tasks in a project |
| POST | `/projects/:projectId/tasks` | Create a task in a project |
| GET | `/tasks/:id` | Get one task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |
| PATCH | `/tasks/:id/status` | Update only a task's status |

## Screenshots

_Add screenshots here once deployed — dashboard view, project board (desktop),
and mobile view are good ones to include._

## Deployment

**Frontend (Vercel)**
1. Import the repo into Vercel, set the root directory to `client`.
2. Set the environment variable `VITE_API_URL` to your deployed backend URL
   (e.g. `https://your-api.onrender.com/api`).
3. Build command `npm run build`, output directory `dist` (Vercel detects
   this automatically for a Vite project).

**Backend (Render or Railway)**
1. Create a new web service pointing at the `server` directory.
2. Build command: `npm install && npx prisma generate && npm run build`
3. Start command: `npm start`
4. Set environment variables: `DATABASE_URL` (from your Postgres provider)
   and `PORT` (most providers set this automatically).
5. Run migrations once against the production database:
   `npx prisma migrate deploy`

**Database (Neon or another free PostgreSQL host)**
1. Create a project/database and copy the connection string into
   `DATABASE_URL` on the backend host.

After deploying, confirm the frontend can reach the backend by opening the
deployed site and checking that projects load — if not, double check
`VITE_API_URL` and that CORS on the backend allows the frontend's domain.

## Future Improvements

These are intentionally out of scope for this version:

- Authentication (per-user projects)
- Drag-and-drop tasks between columns
- Team collaboration / multiple users per project
- Notifications / email reminders for due dates
