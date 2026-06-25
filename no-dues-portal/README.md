# CDGI - Academic No-Dues Portal

A premium, highly responsive React.js + Tailwind CSS + ShadCN UI portal for managing university dues and clearances. Designed for **Chameli Devi Group of Institutions (CDGI)**.

## 🚀 Getting Started

To run the project on your machine:

### Installation

1. Navigate to the project directory:
   ```bash
   cd no-dues-portal
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

The project directory has been structured as follows:

```text
no-dues-portal/
├── src/
│   ├── assets/       # College logos, banners, icons
│   ├── components/   # Reusable UI components
│   │   ├── NotificationBell.tsx # Navbar live notification bell & dropdown menu
│   │   └── ui/       # Custom ShadCN components (Button, Input, Select, Card, Label)
│   ├── context/      # Authentication/State Context providers
│   ├── hooks/        # Custom React hooks (e.g. useAuth)
│   ├── layouts/      # Shared layout structures
│   │   ├── AuthLayout.tsx       # Side branding + Centered forms
│   │   └── DashboardLayout.tsx  # Top navbar + Sidebar navigation
│   ├── pages/        # Route page views
│   │   ├── Login.tsx            # Form validation, role check, fallback login
│   │   ├── StudentDashboard.tsx # Student dashboard overview (4 stats cards + Activity + Links)
│   │   ├── MyTasks.tsx          # List of tasks, statuses, details modal
│   │   ├── SubmitWork.tsx       # Document submission form (accepts PDF/images, max 5MB)
│   │   ├── MyDues.tsx           # Subject-wise clearance dues checker
│   │   ├── FacultyDashboard.tsx # Faculty dashboard overview (4 stats cards + Submission list)
│   │   ├── CreateAssignment.tsx # Task creation form (Subject, Title, Description, Deadline)
│   │   ├── ReviewSubmissions.tsx# Table log listing all student submissions with filters
│   │   ├── SubmissionDetail.tsx # Review dossier, mock PDF previewer, Approve/Reject modals
│   │   ├── CoordinatorDashboard.tsx # Class overview grid, search, CSV exports
│   │   ├── HODAdminPanel.tsx    # Multi-tab settings, Faculty reg, allocations, SVG reports
│   │   ├── NoDuesCertificate.tsx# Printable clearance certificate design with PDF download
│   │   ├── ClearanceStatus.tsx  # Interactive clearance pipeline timeline
│   │   ├── UserProfile.tsx      # User profile card & details
│   │   └── Settings.tsx         # Account preferences & alerts
│   ├── services/     # API service helpers
│   │   └── api.ts    # Centralized Axios client with JWT header interceptor
│   ├── lib/
│   │   └── utils.ts  # Tailwind merge utilities (cn)
│   ├── App.tsx       # Route definitions, guards, role dispatcher & react-hot-toast setup
│   ├── main.tsx      # App entry point mounting
│   └── index.css     # CSS variables & Tailwind directives
├── .env              # Environment endpoint configurations (VITE_API_URL)
├── package.json      # Dependencies and script commands
├── tailwind.config.js# Tailwind Theme tokens mapping
├── postcss.config.js # PostCSS plugin declarations
├── tsconfig.json     # Root TS options
└── vite.config.ts    # Vite compiler alias configurations
```

---

## ✨ Features Implemented

1. **Centralized API Client (`src/services/api.ts`)**:
   - Uses Axios to communicate with the backend.
   - Automatically loads backend URL from `.env` (`VITE_API_URL`).
   - Automatically attaches JWT Authorization headers using interceptors.

2. **Role-Based Security Guards (`src/App.tsx`)**:
   - Protected routes automatically redirect unauthenticated users to `/auth/login`.
   - Role-based wrappers (`CoordinatorRoute` and `HODAdminRoute`) redirect unauthorized roles to `/dashboard`.
   - Dynamic `DashboardDispatcher` evaluates role state and lands logged-in users on their matching dashboards.

3. **Student Module**:
   - **`StudentDashboard`**: Features 4 stat cards (Total, Submitted, Pending, Cleared), a detailed "Recent Activity" feed, and a "Quick Links" panel for direct actions.
   - **`MyTasks`**: Calls `GET /api/student/tasks` and displays them in a clean status table with actions. Includes a detail popup modal.
   - **`SubmitWork`**: Dynamic dropdown loaded from active tasks, drag-&-drop file upload with a 5MB size limit (validates PDF and images), and remarks field. Submits inputs to `POST /api/student/submissions` with `multipart/form-data`.
   - **`MyDues`**: Calls `GET /api/student/dues` and shows subject dues status with green/red indicator badges and audit notes.

4. **Faculty Module**:
   - **`FacultyDashboard`**: Displays overview cards (Total Subjects, Pending Reviews, Approved, Rejected) and a preview grid of recent student submissions.
   - **`CreateAssignment`**: Submits course requirements to `POST /api/faculty/assignments` through a validated dropdown & guideline form.
   - **`ReviewSubmissions`**: Provides searchable and filterable datatables of student clearances sourced from `GET /api/faculty/submissions`.
   - **`SubmissionDetail`**: Features interactive student/task profile cards, simulated PDF reports, and confirmation dialogs for optional remarks on Approve, Reject, and Request Resubmission actions (making `PATCH /api/faculty/submissions/:id` requests).

5. **Coordinator Module**:
   - **`CoordinatorDashboard`**: Displays a classroom overview grid mapping all student clearance progress (ratios and scrollbars) with status filters and search features.
   - **CSV Export**: Includes a functional browser-based exporter generating formatted `.csv` reports on the current classroom view.

6. **HOD / Admin Panel**:
   - **`HODAdminPanel`**: Features tabs for Faculty Registration (add/delete forms), Course Allocations, Semester controls (opening/closing global clearance cycles), and analytics charts.
   - **Analytics Charts**: Custom, responsive SVG double-bar chart graphing Cleared vs. Pending students per subject checkpoint.

7. **No Dues Certificate**:
   - **`NoDuesCertificate`**: A printable certificate layout with ornamental borders, watermarks, college details, verifier signature indicators, and stamps.
   - **Print stylesheet**: Uses CSS `@media print` directives to hide sidebar, header, and buttons, automatically formatting the certificate perfectly for PDF download or print.

8. **Notification System**:
   - **`NotificationBell`**: Fetches notifications from `GET /api/notifications`. Features unread count badge overlays, dropdown notification cards, and action hooks triggering `PATCH /api/notifications/:id/read` to update read state.
