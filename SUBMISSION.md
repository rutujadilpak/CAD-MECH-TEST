# Submission Details

---

## Candidate Information

| Field | Your Details |
|-------|-------------|
| **Full Name** | |
| **Email** | |
| **Phone** | |
| **GitHub Username** | |
| **LinkedIn (optional)** | |
| **Current Location** | |

---

## Repository & Deployment Links

| Link | URL |
|------|-----|
| **GitHub Repo** (forked) | `https://github.com/YOUR-USERNAME/cadmech-fullstack-assessment` |
| **Live Frontend** (GitHub Pages) | `https://YOUR-USERNAME.github.io/cadmech-fullstack-assessment` |
| **Live Backend** (Render) | `https://cadmech-equipment-api.onrender.com` |

---

## Tech Choices

| Choice | Answer |
|--------|--------|
| **Database Used** | PostgreSQL |
| **ORM / Query Builder** | Raw SQL with parameterized queries (`pg` driver) |
| **Additional Frontend Libraries** | None (React 18 + Vite) |
| **Additional Backend Libraries** | `pg` (PostgreSQL driver), `cors`, `dotenv`, `express` |
| **CSS Approach** | Vanilla CSS with CSS custom properties |

---

## Features Implemented

- [x] Dashboard with summary statistics
- [x] Equipment list view (table with description, status badges)
- [x] Add new equipment with validation
- [x] Edit existing equipment (pre-filled form)
- [x] Delete equipment with confirmation dialog
- [x] Search by name, location, and serial number
- [x] Filter by type and/or status
- [x] Responsive design (desktop + mobile)
- [x] REST API with proper error handling and HTTP status codes
- [x] PostgreSQL database with schema and seed data
- [ ] Frontend deployed to GitHub Pages
- [ ] Backend deployed to Render

---

## Self Assessment

### What went well?

Got all CRUD operations working end to end with PostgreSQL. The dashboard counts refresh after add, edit, and delete. Search and type/status filters work together without page reload.

### What was the hardest part?

PostgreSQL setup on Windows and writing the UPDATE query so only changed fields get updated. Also had to handle ENUM types on server restart so it does not throw errors if they already exist.

### What would you do differently with more time?

Add pagination for the equipment list, write a few API tests, and maybe split the app into separate pages with React Router.

### AI Tools Usage

Checked PostgreSQL and Express docs while building the backend. Used online references for Vite proxy and GitHub Pages base path setup. I can walk through the code in the interview.

---

## Time Spent

| Area | Hours |
|------|-------|
| **Frontend UI/UX & Responsive Design** | 7 |
| **Backend API Development & DB** | 5 |
| **Deployment (FE + BE)** | 3 |
| **Documentation & Cleanup** | 2 |
| **Total** | 17 |

---

## Additional Notes

- Backend creates the schema and seed data automatically on first run.
- Search uses PostgreSQL ILIKE on name, location, and serial number.
- Local dev uses Vite proxy; production build uses `VITE_API_BASE` for the Render URL.
