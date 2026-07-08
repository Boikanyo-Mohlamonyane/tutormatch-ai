# AI TutorMatch — Frontend

A professional React + Vite single-page app for the AI TutorMatch Spring Boot
backend, with three dedicated workspaces:

- **Admin** — manage students, tutors, subjects, tutor-subject assignments,
  and booking approvals, plus platform-wide stats.
- **Student** — browse subjects, get an AI-matched tutor recommendation,
  book/cancel sessions, and track performance & risk level.
- **Tutor** — manage assigned subjects, approve/reject bookings, view
  student performance, and edit a public profile.

## Stack

- React 18 + Vite 5
- React Router 6 (role-based protected routes)
- Axios (JWT bearer auth via interceptor)
- lucide-react icons
- Hand-rolled design system (`src/index.css`) — no UI framework dependency

## Getting started

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` and proxies `/api/*` requests
to `http://localhost:8080` (your Spring Boot backend) — see `vite.config.js`.

To point at a different backend origin (e.g. in production), copy
`.env.example` to `.env` and set `VITE_API_BASE_URL`.

```bash
npm run build   # production build to dist/
npm run preview # preview the production build locally
```

## Backend contract

The API layer under `src/api/` mirrors the four Spring controllers exactly:

| File               | Controller        | Base path     |
|---------------------|-------------------|---------------|
| `authApi.js`        | `AuthController`  | `/api/auth`   |
| `adminApi.js`       | `AdminController` | `/api/admin`  |
| `studentApi.js`     | `StudentController` | `/api/student` |
| `tutorApi.js`       | `TutorController` | `/api/tutor`  |

`AuthController#login` is expected to return a JSON body containing at
least a `token` field (JWT) plus user info (`id`, `name`/`fullName`,
`email`, `role`). The app is defensive about exact field names — see
`normalizeUser()` in `src/context/AuthContext.jsx` — but if your DTOs use
different names, adjust that function.

Every list/detail screen also reads several possible field-name variants
(e.g. `id` vs `studentId`, `name` vs `fullName`) via the `pick()` helper in
`src/utils/format.js`, since the exact DTO shapes weren't available when
this UI was built. Once you finalize your DTOs, you can simplify those
`pick()` calls to the single correct field name.

## Folder structure

```
src/
  api/            axios client + one file per backend controller
  components/
    layout/       Sidebar, Topbar, DashboardLayout, ProtectedRoute, nav config
    ui/           MasteryRing, StatCard, Badge, Modal, PageHead, etc.
  context/        AuthContext (session), ToastContext (notifications)
  pages/
    auth/         Login, Register
    admin/        Dashboard, Students, Tutors, Subjects, AssignSubject,
                  CreateTutor, CreateAdmin, Bookings
    student/      Dashboard, Subjects, FindTutors, Recommend, MyBookings,
                  Performance
    tutor/        Dashboard, MySubjects, Bookings, StudentPerformance, Profile
  utils/format.js helper functions (pick, date formatting, initials)
  index.css       design tokens + component styles
  App.jsx         route table
  main.jsx        entry point
```

## Design notes

- **Palette**: ink navy (`--ink`) surfaces for the sidebar/headers, warm
  amber (`--accent`) for primary actions and highlights, on a paper-toned
  background — distinct from a generic admin-template look.
- **Type**: Fraunces (display) for headings, Inter (body/UI), JetBrains
  Mono for numeric/tabular data.
- **Signature element**: the "mastery ring" (`components/ui/MasteryRing.jsx`)
  — a radial progress indicator reused across stat cards and performance
  views to keep scores and risk levels legible at a glance.
