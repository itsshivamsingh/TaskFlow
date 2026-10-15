# TaskFlow — Full-Stack MERN Task Management Platform

> **"Plan Better. Work Smarter. Achieve More."**

A complete, production-ready Task Management SaaS website built with the **MERN** stack (**MongoDB, Express.js, React, Node.js**) and **TypeScript** across both frontend and backend. Features robust JWT authentication with secure HttpOnly cookies, full task CRUD, interactive drag-and-drop Kanban board, monthly deadline calendar, advanced multi-criteria filtering, live MongoDB productivity analytics, and light/dark theme switching.

---

## Table of Contents
1. [Project Overview & Key Features](#1-project-overview--key-features)
2. [Technology Stack](#2-technology-stack)
3. [Architecture & Folder Structure](#3-architecture--folder-structure)
4. [Prerequisites](#4-prerequisites)
5. [MongoDB Atlas Setup Guide](#5-mongodb-atlas-setup-guide)
6. [Environment Variables Configuration](#6-environment-variables-configuration)
7. [Installation & Local Development](#7-installation--local-development)
8. [REST API Documentation](#8-rest-api-documentation)
9. [Automated Testing](#9-automated-testing)
10. [Manual Verification Checklist](#10-manual-verification-checklist)
11. [Security Architecture](#11-security-architecture)
12. [Production Deployment Guide](#12-production-deployment-guide)
13. [Troubleshooting & FAQ](#13-troubleshooting--faq)

---

## 1. Project Overview & Key Features

### Public Pages
- **Landing Page**: Modern hero section, headline *"Plan Better. Work Smarter. Achieve More."*, feature cards, workflow walkthrough, and calls-to-action.
- **Register Page**: Client & server Zod validation, password strength requirements (minimum 8 characters, uppercase, lowercase, numbers), duplicate email detection, and bcrypt hashing.
- **Login Page**: Secure credential authentication issuing HttpOnly cookies.
- **Password Reset Flow**: Single-use, expiring SHA-256 hashed reset tokens with configurable SMTP email dispatch and local development token assistance.

### Authenticated Experience
- **Interactive Dashboard**:
  - Live metric cards: Total, Completed, In Progress, Pending (To Do), Overdue, Due Today.
  - Overall task completion percentage ring.
  - **Weekly Productivity Chart**: Recharts bar chart tracking completed tasks over the past 7 days from real MongoDB timestamps.
  - **Status Breakdown**: Donut chart visualizing task distribution across To Do, In Progress, and Completed.
  - **Upcoming Deadlines**: Real-time list of approaching deadlines with priority badges.
  - **Recently Updated**: Audit list of latest tasks edited.
  - **Quick Add Task Modal**: Accessible from sidebar, top navigation, and dashboard.
- **Kanban Board**:
  - 3 dynamic columns: *To Do*, *In Progress*, and *Completed*.
  - Smooth drag-and-drop powered by `@hello-pangea/dnd`.
  - Immediate persistence to MongoDB upon drop with automated error rollback.
- **Task Calendar**:
  - Interactive month view with day cells populated with task chips by due date.
  - Click any day cell to schedule a task directly for that date.
  - Color-coded priority dots and overdue alerts.
- **Task List View**:
  - Search by task title or description.
  - Filters by Status (*All, To Do, In Progress, Completed*).
  - Filters by Priority (*Urgent, High, Medium, Low*).
  - Filters by Category (*Work, Personal, Study, Projects, Other* or custom).
  - Filters by Timeline (*Due Today, Due This Week, Overdue, Upcoming*).
  - Sort by Creation Date, Due Date, Priority, or Title (Ascending/Descending).
  - Pagination controls and Reset Filters action.
- **Profile & Settings**:
  - View and update profile name.
  - View email address (immutable, tied to account).
  - Change password with required current password verification.
  - Theme mode selector: Light, Dark, or System Default.
  - Cascading account deletion: removes user and all associated tasks from MongoDB.

---

## 2. Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS with dark mode class support
- **Routing**: React Router v6
- **HTTP Client**: Axios with `withCredentials: true`
- **Charts**: Recharts
- **Icons**: Lucide React
- **Drag-and-Drop**: `@hello-pangea/dnd`
- **Notifications**: Sonner toast system
- **Dates**: `date-fns`

### Backend
- **Runtime**: Node.js v20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) stored in HttpOnly cookies
- **Password Security**: bcryptjs (12 salt rounds)
- **Validation**: Zod schema validation
- **Security**: Helmet HTTP headers, CORS whitelisting, Express Rate Limiting

---

## 3. Architecture & Folder Structure

```
TaskManage/
├── client/                     # Frontend Application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── calendar/      # CalendarView
│   │   │   ├── common/        # Badges, Skeletons, Modals, Pagination
│   │   │   ├── dashboard/     # Charts, Widgets, StatCards
│   │   │   ├── kanban/        # KanbanBoard, KanbanColumn
│   │   │   ├── layout/        # Navbar, Sidebar, Layout, Footer
│   │   │   └── tasks/         # TaskFormModal, TaskDetailsModal, TaskCard, TaskFilterBar
│   │   ├── context/           # AuthContext, ThemeContext
│   │   ├── hooks/             # useAuth, useTheme, useDebounce
│   │   ├── pages/             # Landing, Login, Register, Dashboard, Tasks, Kanban, Calendar, Profile
│   │   ├── services/          # api, authService, taskService, dashboardService, userService
│   │   ├── types/             # Shared TypeScript interfaces
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                     # Backend Application
│   ├── src/
│   │   ├── config/            # db.ts (MongoDB connection), env.ts
│   │   ├── controllers/       # auth, user, task, dashboard, category controllers
│   │   ├── middleware/        # auth, validate, errorHandler, rateLimiter
│   │   ├── models/            # User, Task, Category, PasswordResetToken
│   │   ├── routes/            # auth, user, task, dashboard, category routes
│   │   ├── utils/             # jwt, logger
│   │   ├── validators/        # Zod input schemas
│   │   ├── app.ts             # Express app setup
│   │   └── server.ts          # Server entrypoint
│   ├── tests/                 # Vitest & Supertest automated test suite
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
├── package.json                # Root package with concurrently scripts
└── README.md
```

---

## 4. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **MongoDB Atlas Account** (or local MongoDB 6+)

---

## 5. MongoDB Atlas Setup Guide

1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Free Cluster (M0 Sandbox) or use an existing cluster.
3. Under **Security > Database Access**:
   - Click **Add New Database User**.
   - Select **Password** authentication.
   - Enter a username and secure password (e.g., `taskflow_admin`).
   - Assign the role `Read and write to any database`.
4. Under **Security > Network Access**:
   - Click **Add IP Address**.
   - Add your development IP address (or `0.0.0.0/0` for initial development access).
5. Under **Deployment > Database**:
   - Click **Connect** on your cluster.
   - Choose **Drivers (Node.js)**.
   - Copy your connection string:
     ```
     mongodb+srv://<username>:<password>@<cluster>.mongodb.net/task_management?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your database user credentials.
   - Ensure the database name is specified before the query parameters (e.g. `/task_management`).

---

## 6. Environment Variables Configuration

### Backend: `server/.env`
Create a `.env` file in the `server/` directory (or copy from `server/.env.example`):

```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/task_management?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret_at_least_32_chars
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
COOKIE_NAME=task_management_token

# Optional SMTP Settings for Password Reset Emails:
# If left blank, dev reset tokens are logged and returned in API responses
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM="TaskFlow Support <noreply@taskflow.dev>"
```

### Frontend: `client/.env`
Create a `.env` file in the `client/` directory (or copy from `client/.env.example`):

```bash
VITE_API_URL=http://localhost:5000/api
```

> **Security Note:** Never add `MONGODB_URI` or `JWT_SECRET` to the frontend environment.

---

## 7. Installation & Local Development

### 1. Install all dependencies across root, server, and client:
```bash
npm run install:all
```

### 2. Configure Environment Variables:
- Copy `server/.env.example` to `server/.env` and paste your real `MONGODB_URI`.
- Copy `client/.env.example` to `client/.env`.

### 3. Run both backend and frontend concurrently:
```bash
npm run dev
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Running services individually (optional):
```bash
# Run backend only
npm run dev:server

# Run frontend only
npm run dev:client
```

---

## 8. REST API Documentation

All API endpoints are prefixed with `/api`.

### Health Check
- `GET /api/health` — Returns service status, uptime, and database connection state.

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user and set auth cookie | No |
| `POST` | `/api/auth/login` | Authenticate user and issue HttpOnly cookie | No |
| `POST` | `/api/auth/logout` | Clear authentication cookie | No |
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile | Yes |
| `POST` | `/api/auth/forgot-password` | Generate single-use reset token | No |
| `POST` | `/api/auth/reset-password` | Reset password using valid token | No |

### User Profile (`/api/users`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/users/me` | Get profile details | Yes |
| `PATCH` | `/api/users/me` | Update name and preferences | Yes |
| `PATCH` | `/api/users/me/password` | Change password (requires current password) | Yes |
| `DELETE` | `/api/users/me` | Cascade delete user account and all tasks | Yes |

### Tasks (`/api/tasks`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/tasks` | List tasks (supports search, filters, sort, pagination) | Yes |
| `POST` | `/api/tasks` | Create new task | Yes |
| `GET` | `/api/tasks/:id` | Get task by ID (scoped to owner) | Yes |
| `PATCH` | `/api/tasks/:id` | Update task fields | Yes |
| `PATCH` | `/api/tasks/:id/status`| Update status only (Kanban drag-and-drop) | Yes |
| `DELETE` | `/api/tasks/:id` | Delete task | Yes |

#### Query Parameters for `GET /api/tasks`:
- `search`: String matching title or description (regex, case-insensitive).
- `status`: `all` | `todo` | `in_progress` | `completed`
- `priority`: `all` | `low` | `medium` | `high` | `urgent`
- `category`: String matching task category.
- `dueDateFilter`: `all` | `today` | `this_week` | `overdue` | `upcoming`
- `sortBy`: `createdAt` | `dueDate` | `priority` | `title`
- `sortOrder`: `asc` | `desc`
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

### Dashboard (`/api/dashboard`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Aggregated task counts, completion rate, status distribution, upcoming deadlines | Yes |
| `GET` | `/api/dashboard/productivity`| Completed tasks over past 7 days | Yes |

### Categories (`/api/categories`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/categories` | Get user custom categories | Yes |
| `POST` | `/api/categories` | Create custom category | Yes |
| `DELETE` | `/api/categories/:id` | Delete custom category | Yes |

---

## 9. Automated Testing

The backend includes a comprehensive test suite using **Vitest** and **Supertest** validating:
- Password hashing with bcrypt
- JWT signature generation and verification
- Zod schema validation for authentication and task creation
- Public route availability (`/api/health`)
- Protected route security (rejecting unauthenticated requests with 401)
- Invalid route and malformed request handling

Run the test suite:
```bash
npm run test
```

---

## 10. Manual Verification Checklist

1. **MongoDB Connection**:
   - Provide your real Atlas URI in `server/.env`.
   - Start the backend and verify the log output:
     `✅ Successfully connected to MongoDB [Database: task_management]`
2. **User Registration**:
   - Navigate to `/register` and create an account.
   - Inspect MongoDB Atlas `users` collection to confirm document creation with hashed password.
3. **Session Persistence**:
   - Refresh the browser; verify that session remains active via HttpOnly cookie.
4. **Task CRUD**:
   - Click **New Task** and create a task with high priority and tomorrow's due date.
   - Verify task card in **Dashboard**, **Task List**, and **Calendar**.
   - Check MongoDB Atlas `tasks` collection to confirm real persistence.
5. **Kanban Drag-and-Drop**:
   - Navigate to `/kanban` and drag the task card from *To Do* to *In Progress*.
   - Refresh the page and confirm the card remains in *In Progress*.
6. **Task Isolation / Multi-User Security**:
   - Log out and register a second account.
   - Confirm the new user cannot see tasks from the first user.
7. **Production Build**:
   - Run `npm run build` to verify both server and client compile cleanly with zero errors.

---

## 11. Security Architecture

- **HttpOnly Cookies**: Authentication tokens are stored in HttpOnly cookies, mitigating XSS token theft.
- **Strict Password Hashing**: Passwords are encrypted using bcrypt with 12 salt rounds.
- **Resource Ownership Scoping**: Every task query, update, and deletion is hard-scoped to `owner: req.user.userId`.
- **Sanitized Logging**: Database credentials and sensitive passwords are automatically masked before logging.
- **Rate Limiting**: Authentication endpoints are rate-limited to 20 attempts per 15 minutes to prevent brute-force attacks.
- **HTTP Security Headers**: Powered by Helmet to prevent clickjacking and MIME-type sniffing.

---

## 12. Production Deployment Guide

### Frontend (e.g. Vercel)
1. Set the root directory to `client`.
2. Set build command: `npm run build`.
3. Set output directory: `dist`.
4. Environment variable:
   `VITE_API_URL=https://your-backend-domain.com/api`
5. Configure SPA rewrite in `client/vercel.json`:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

### Backend (e.g. Render / Railway)
1. Set the root directory to `server`.
2. Build command: `npm run build`.
3. Start command: `node dist/server.js`.
4. Configure environment variables in dashboard:
   - `NODE_ENV=production`
   - `MONGODB_URI=<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET=<Random 32+ character key>`
   - `CLIENT_URL=https://your-frontend-domain.com`
   - `COOKIE_NAME=task_management_token`

---

## 13. Troubleshooting & FAQ

**Q: Server logs `⚠️ Starting server without active MongoDB Atlas connection`**
> Check `server/.env`. Make sure `MONGODB_URI` contains your actual username, password, cluster hostname, and does not have unresolved placeholder values like `YOUR_USERNAME`.

**Q: MongoDB connects but operations time out**
> In MongoDB Atlas, verify **Network Access** includes your current IP address (or `0.0.0.0/0`). Also check that your database user credentials have `readWrite` permissions.

**Q: Kanban cards return to original column after dragging**
> Check the browser console or backend log. If the server is offline or the database connection failed, the optimistic UI safely reverts the change to prevent state divergence.

---

## License
MIT License. Built for high productivity and scalability.
