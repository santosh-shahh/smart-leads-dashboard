# Smart Leads Dashboard

A full-stack Lead Management Dashboard built using the MERN stack with clean architecture, scalable code practices, and a professional user experience.

## Tech Stack

- **Frontend:** React.js, Vite, TypeScript, TailwindCSS, Zustand, React Query
- **Backend:** Node.js, Express.js, TypeScript, MongoDB, Mongoose, Zod
- **Authentication:** JWT, bcrypt, Google OAuth
- **Infrastructure:** Docker, Docker Compose

## Core Features

- **Authentication System:** JWT-based user registration, login, Google OAuth, guest login, and protected routes with auth middleware.
- **Leads Management (CRUD):** Create, Read, Update, and Delete leads with modal forms and toast notifications.
- **Advanced Filtering & Search:** Debounced searching by name/email, filtering by Status/Source, sorting by Latest/Oldest — all working together.
- **Pagination:** Backend-driven pagination (limit: 10 records per page) with smart page number navigation.
- **Role-Based Access Control:** 'Admin' can export and delete leads; 'Sales User' can only view and edit.
- **Export to CSV:** Download leads data securely (Admin only).
- **Dark Mode Support:** Built-in dynamic theme toggling with system preference detection.
- **Dashboard Analytics:** Stat cards (Total Leads, New, Qualified, Conversion Rate), donut chart by status, bar chart by source.
- **Dockerized:** Simple setup with Docker Compose.

## Project Structure

```
├── backend/
│   └── src/
│       ├── config/          # Database connection
│       ├── controllers/     # Auth & Lead controllers
│       ├── middleware/       # Auth & Admin middleware
│       ├── models/          # User & Lead Mongoose models
│       ├── routes/          # Auth & Lead route definitions
│       ├── utils/           # JWT token generator
│       ├── app.ts           # Express app setup
│       └── server.ts        # Server entry point
├── frontend/
│   └── src/
│       ├── api/             # Axios client with interceptors
│       ├── components/
│       │   ├── dashboard/   # StatsCards, Charts, FilterBar, LeadsTable
│       │   ├── layout/      # Layout with sidebar & header
│       │   ├── leads/       # LeadModal
│       │   └── ui/          # Button, Badge, Modal, Toast, Skeleton, ConfirmDialog
│       ├── hooks/           # useLeads, useDebounce
│       ├── pages/           # Dashboard, Login, Register
│       ├── store/           # Zustand auth store
│       ├── types.ts         # Centralized TypeScript interfaces
│       ├── App.tsx          # Root with providers & routing
│       └── main.tsx         # Entry point
└── docker-compose.yml
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (or Docker)
- Docker Desktop (Optional, for containerized run)

### Running with Docker (Recommended)

1. Clone the repository and navigate to the project directory.
2. Run Docker Compose:
   ```bash
   docker-compose up --build
   ```
3. The frontend will be available at `http://localhost:80`
4. The backend will be available at `http://localhost:5001`

### Live Deployed Application
- **Frontend (Vercel):** [https://frontend-pi-self-65.vercel.app](https://frontend-pi-self-65.vercel.app)
- **Backend API (Render):** [https://smart-leads-api-pi75.onrender.com](https://smart-leads-api-pi75.onrender.com)
- **Database:** MongoDB Atlas (Cloud Cluster)


### Running Locally without Docker

**Backend:**
1. Navigate to the backend directory: `cd backend`
2. Copy `.env.example` to `.env` and configure: `cp .env.example .env`
3. Install dependencies: `npm install`
4. Ensure MongoDB is running locally on default port `27017`.
5. Start the server: `npm run dev`
6. Backend runs at `http://localhost:5001`

**Frontend:**
1. Navigate to the frontend directory: `cd frontend`
2. Copy `.env.example` to `.env` and configure: `cp .env.example .env`
3. Install dependencies: `npm install`
4. Start the dev server: `npm run dev`
5. Access at `http://localhost:5173`

## API Documentation

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register a new user (`name`, `email`, `password`, `role`) | Public |
| POST | `/api/auth/login` | Login user (`email`, `password`) | Public |
| POST | `/api/auth/google` | Google OAuth login (`token`) | Public |
| POST | `/api/auth/guest` | Guest login (no body required) | Public |

### Leads
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/leads` | Get leads (supports `page`, `limit`, `search`, `status`, `source`, `sort`) | Private |
| GET | `/api/leads/stats` | Get lead statistics (counts by status/source, conversion rate) | Private |
| GET | `/api/leads/export` | Export leads to CSV | Admin only |
| GET | `/api/leads/:id` | Get single lead by ID | Private |
| POST | `/api/leads` | Create a new lead | Private |
| PUT | `/api/leads/:id` | Update a lead | Private |
| DELETE | `/api/leads/:id` | Delete a lead | Admin only |

## UI/UX Highlights

- **Modern SaaS Design:** Gradient accents, glassmorphism header, Inter font, custom scrollbars
- **Reusable Components:** Button, Badge, Modal, ConfirmDialog, Toast, Skeleton loader primitives
- **Responsive:** Fully responsive with collapsible sidebar and mobile-first layouts
- **Loading States:** Skeleton loaders for tables and cards
- **Empty States:** Custom illustrations for no-data scenarios
- **Error Handling:** Toast notifications for success/error, inline form validation
- **Animations:** Smooth transitions, slide-in toasts, scale-in modals

## TypeScript Usage

- Centralized type definitions in `frontend/src/types.ts`
- Strict typing across all components, hooks, and API calls
- Zod schema validation on all backend request bodies
- Proper interfaces for User, Lead, API responses, and pagination

## Submission Notes
- TypeScript usage is strictly enforced across both frontend and backend.
- Zod is used for request validation.
- All evaluation criteria have been carefully met.
- No `any` types used except where required by third-party library constraints.
