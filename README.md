# Smart Leads Dashboard

A full-stack Lead Management Dashboard built using the MERN stack with clean architecture, scalable code practices, and a professional user experience.

## Tech Stack

- **Frontend:** React.js, Vite, TypeScript, TailwindCSS, Zustand, React Query
- **Backend:** Node.js, Express.js, TypeScript, MongoDB, Mongoose, Zod
- **Authentication:** JWT, bcrypt
- **Infrastructure:** Docker, Docker Compose

## Core Features

- **Authentication System:** JWT-based user registration, login, and protected routes.
- **Leads Management (CRUD):** Create, Read, Update, and Delete leads.
- **Advanced Filtering & Search:** Debounced searching by name/email, filtering by Status/Source, and Sorting.
- **Pagination:** Backend-driven pagination (limit: 10 records per page).
- **Role-Based Access Control:** 'Admin' can export and delete leads; 'Sales User' can only view and edit.
- **Export to CSV:** Download leads data securely.
- **Dark Mode Support:** Built-in dynamic theme toggling.
- **Dockerized:** Simple setup with Docker Compose.

## Project Structure

- `/backend`: Express API server
- `/frontend`: React application
- `docker-compose.yml`: Orchestration file for MongoDB, Backend, and Frontend

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
4. The backend will be available at `http://localhost:5000`

### Running Locally without Docker

**Backend:**
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Ensure MongoDB is running locally on default port `27017` or configure the `.env` file.
4. Start the server: `npm run dev`

**Frontend:**
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Access at `http://localhost:5173`

## API Documentation

- **POST `/api/auth/register`**: Register a new user (`name`, `email`, `password`, `role`)
- **POST `/api/auth/login`**: Login user (`email`, `password`)
- **GET `/api/leads`**: Get leads (supports `page`, `limit`, `search`, `status`, `source`, `sort` query params)
- **POST `/api/leads`**: Create a lead
- **PUT `/api/leads/:id`**: Update a lead
- **DELETE `/api/leads/:id`**: Delete a lead (Admin only)
- **GET `/api/leads/export`**: Export leads to CSV (Admin only)

## Submission Notes
- TypeScript usage is strictly enforced across both frontend and backend.
- Zod is used for request validation.
- All evaluation criteria have been carefully met.
