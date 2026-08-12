# AbleSpace Full-Stack Developer Technical Assessment

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-blue?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)

Production-quality, submission-ready full-stack Task & Project Management application created from scratch for the **AbleSpace Developer Technical Assessment**.

---

## 🌟 Overview & Features

### 🔐 1. Guest Authentication & Session Flow
- **1-Click Guest Login**: Instant access to the protected workspace without mandatory third-party OAuth setup.
- **Figma Fidelity**: Styled login card matching the Figma design specs with "Let's get back on track" branding, Google OAuth visual options, and legal footer links.
- **Route Guards**: Protected Next.js pages with automated JWT token validation against NestJS backend.

### 📋 2. Task Management & Views
- **Board View (Kanban)**: 4 columns (*To Do*, *Doing*, *Completed*, *On Hold*) with task cards, member avatars, priority badges, due dates, label tags, and inline task creation.
- **List View (Grouped Table)**: Table grouped by task status with collapsible section headers, customizable table columns via the **Fields Dropdown**, and inline creation rows.
- **View Toggle**: Seamless state retention when switching between Board and List views.

### 🔍 3. Search, Filters & Fields Control
- **Debounced Search**: Live search across task titles, descriptions, and teams.
- **Multi-Category Filters**: Filter by Status, Priority (*Urgent*, *High*, *Medium*, *Low*, *No Priority*), Member, and Team.
- **Fields Dropdown**: Dynamic column/attribute toggle allowing users to show or hide fields (*Priority*, *Members*, *Due Date*, *Labels*, *Status*, *Reporter*, *Team*).

### 📑 4. Task Details Panel & Operations
- **Slide-Over Panel**: Right drawer displaying full task metadata.
- **Editable Attributes**: Title, status selector, priority picker, project assignment, team, and due date.
- **Subtask Management**: Add subtasks, toggle completion states, track progress ratios (e.g. `2/3`), and delete subtasks.
- **Comments & Activity Feed**: Real-time comment posting and author history.

### 📁 5. Project Management
- Project cards displaying task counts, completion progress bars, priority badges, project leads, and target due dates.
- Project detail page listing project metadata and associated tasks with dedicated Board/List views.

### 🎨 6. Theme & Color Mode System
- **Light & Dark Theme**: Toggleable with system fallback and `localStorage` persistence.
- **Accent Color Modes**: 6 accent themes (*Blue*, *Amber*, *Pink*, *Rose*, *Emerald*, *Black*) injected via CSS custom properties and persisted across refreshes.

---

## 🛠️ Architecture & Tech Stack

```
ablespace-task-management/
├── backend/                  # NestJS REST API Server
│   ├── src/
│   │   ├── auth/             # Guest authentication & Passport JWT strategy
│   │   ├── users/            # User profile management & workspace actions
│   │   ├── tasks/            # Task CRUD, filters, search, fields state
│   │   ├── subtasks/         # Subtask CRUD & completion state
│   │   ├── comments/         # Task comment history & posting
│   │   ├── projects/         # Project CRUD & task associations
│   │   ├── labels/           # Label management
│   │   ├── prisma/           # Prisma service & database module
│   │   └── main.ts           # Global ValidationPipe, CORS, and Exception Filter
│   ├── prisma/
│   │   ├── schema.prisma     # Relational PostgreSQL schema definition
│   │   └── seed.ts           # Seeder matching Figma task examples
│   └── test/                 # NestJS end-to-end API tests
├── frontend/                 # Next.js 14 App Router Client
│   ├── app/                  # Pages (/login, /tasks, /projects, /profile)
│   ├── components/           # Reusable UI components & task views
│   ├── hooks/                # Custom React state hooks
│   ├── lib/                  # Typed API client library
│   ├── providers/            # Auth, Theme, and ColorMode context providers
│   └── types/                # TypeScript interfaces matching backend models
└── PART2_ABLESPACE_PRODUCT_UNDERSTANDING.md # AbleSpace "Take Data" feature analysis
```

---

## 🚀 Quick Start & Setup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher
- **PostgreSQL** or **SQLite**: Prisma ORM is pre-configured.

---

### 1. Backend Setup (NestJS + Prisma)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Push database schema & generate Prisma Client
npx prisma db push

# Seed initial database with sample tasks & users
npm run seed

# Start NestJS backend server in development mode
npm run start:dev
```
The NestJS API server will run at `http://localhost:4000/api`.

---

### 2. Frontend Setup (Next.js 14)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```
The Next.js web application will open at `http://localhost:3000`.

---

### 3. Running Backend Tests

```bash
cd backend
npm run test:e2e
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ablespace_db?schema=public"
JWT_SECRET="ablespace-secret-key-assessment-2026"
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## 📄 Part 2 Submission: AbleSpace Product Teardown

For the Part 2 assignment, please view [PART2_ABLESPACE_PRODUCT_UNDERSTANDING.md](PART2_ABLESPACE_PRODUCT_UNDERSTANDING.md). It provides an in-depth analysis of the AbleSpace **Caseload → Take Data** workflow, UI/UX evaluation, and an improvement matrix.
