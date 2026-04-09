# 🎓 EduQuiz — JAMB-Style Educational Testing Platform

> A high-performance, role-based online examination platform built with **React + Vite**. Designed for multi-section, structured assessments with a complete Teacher → Admin approval pipeline, digital signature verification, and full offline persistence via localStorage.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [User Roles & Workflow](#-user-roles--workflow)
  - [Student Flow](#-student-flow)
  - [Teacher Flow](#-teacher-flow)
  - [Admin Flow](#-admin-flow)
- [Special Logic Features](#-special-logic-features)
  - [Student ID System](#-student-id-system-centre-number-generation)
  - [Theory View Toggle](#-theory-view-toggle--batch-view)
  - [Question Randomisation](#-question-randomisation)
- [Data Persistence](#-data-persistence-localstorage-architecture)
- [UI & Responsiveness](#-ui--responsiveness)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment & Configuration](#-environment--configuration)

---

## 🏫 Project Overview

**EduQuiz** is a full-featured, client-side examination platform that replicates the structure of the **Joint Admissions and Matriculation Board (JAMB)** computer-based test. It supports:

- **105-question examinations** across **11 graded sections** (10 Objective + 1 Theory)
- **Three distinct user roles** with separate dashboards and strict access controls
- **A complete marking pipeline**: Student submits → Teacher scores theory → Admin reviews and publishes
- **Full offline functionality** using `localStorage` for all data operations — no backend required

---

## 🔗 Live Demo

> GitHub Repository: [https://github.com/GraceOyiza1/bank-form](https://github.com/GraceOyiza1/bank-form)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (hooks-based, no class components) |
| Build Tool | Vite |
| Styling | Vanilla CSS (mobile-first, custom design system) |
| Fonts | Inter (Google Fonts) |
| Signature Capture | `react-signature-canvas` |
| State Persistence | Browser `localStorage` |
| Routing | Single-page application (view-state pattern) |

---

## 👥 User Roles & Workflow

### 🎓 Student Flow

#### 1. Registration & Login
The student login page uses a coordinated **CSS Grid layout** with the following fields:

| Field | Behaviour |
|---|---|
| **First Name** | Free text input |
| **Second Name** | Free text input |
| **Registration Number** | Numeric — restricted to `001` to `050` only |
| **Centre Number** | **Read-only** — auto-generated from Reg No (see [Student ID System](#-student-id-system-centre-number-generation)) |
| **Digital Signature** | `react-signature-canvas` pad — the **Start Quiz** button remains disabled until signed |

The registration validation rejects any `regNo` below `1` or above `50`. Once the student signs and submits, the quiz session is persisted to `localStorage` under the key `quizSession` so a page reload never loses answers or timer state.

#### 2. Taking the Quiz
- **11 sections** presented one at a time via a **Section Navigation Ribbon** (horizontal scroll on mobile, vertical sidebar on desktop)
- Questions are randomised per section on each new session (Fisher-Yates shuffle)
- Answer options for objective questions are also shuffled to prevent pattern-recognition
- A **sticky progress bar** displays questions answered, percentage complete, and a live countdown timer
- Students can jump between sections via the sidebar at any time

#### 3. Theory Section (Section 11)
- Questions are displayed in a user-controlled **Batch View** (see [Theory View Toggle](#-theory-view-toggle--batch-view))
- The final page of Section 11 shows a **"Review Answers"** button

#### 4. Review & Submit
- A dedicated **Review Mode** shows all answers grouped by section before final submission
- The student signs a **submission signature** (separate from the login signature)
- On submit, the score is calculated, results saved to `localStorage`, and the quiz session is cleared

#### 5. Result Search
Students can search for their published results via the **Student Results Portal** by entering their full name and registration number. Results are only visible once the Admin has **published** them.

---

### 🧑‍🏫 Teacher Flow

Teachers log in via the **Access Portal → Teacher** route using credentials created by the Admin.

#### Teacher Dashboard
- Displays a table of all student submissions with their **Objective score**, **Theory score**, **Overall score**, and **Status**
- **Pending** results (theory not yet scored) show only a **Score** button
- **Published** results are locked and show a **Locked** label

#### Scoring Theory Questions
Clicking **Score** opens the **Scoring Modal** which:
- Displays each theory question alongside the student's typed answer and the expected/model answer
- Allows the teacher to assign a score (`0–10`) and written feedback per question
- On **Save Scores**, the result is immediately written to `localStorage` using a fresh read-before-write pattern to prevent stale overwrites
- The result status advances to **Scored** — ready for Admin review

> Teachers cannot **Publish** results. Only the Admin can do that.

---

### 🔐 Admin Flow

Admins authenticate via the **Access Portal → Admin** route using a master password.

#### Admin Dashboard
The Admin Dashboard displays a **responsive 4-widget stats grid**:
- Total Submissions
- Pending Scoring
- Ready to Publish
- Published

#### Managing Teachers
Admins have exclusive access to the **Manage Teachers** panel where they can:
- Add new teacher accounts (username + password)
- Delete existing teachers
- The teacher list is saved to `localStorage` under the `teachers` key and persists across reloads indefinitely

#### Reviewing & Publishing
- The **Review** button appears on results only after a teacher has completed scoring (`!isPending`)
- Clicking **Review** opens the **Scoring Modal in Admin/Read-Only mode**: all score inputs and comment fields are `disabled`, allowing the Admin to read without edits
- The Admin clicks **Approve & Publish** to finalise the result
- Published results become visible to students via the Result Search portal

---

## ⚙️ Special Logic Features

### 🪪 Student ID System — Centre Number Generation

To ensure each student has a **globally unique identifier** that prevents result collisions between different exam centres:

```
Formula: Centre Number = "234" + zero-padded Registration Number

Examples:
  Reg No 005  →  Centre Number 234005
  Reg No 042  →  Centre Number 234042
  Reg No 001  →  Centre Number 234001
```

- The Centre Number field is **read-only** and updates in real-time as the student types their Reg No
- When saving results to `localStorage`, the **Centre Number is used as the unique data key**
- If a student resubmits (e.g., on a retry), their existing record is **overwritten** rather than duplicated
- Future exam centres (e.g., `233XXX` for Ghana) would produce entirely different keys, guaranteeing no cross-centre collisions

---

### 📖 Theory View Toggle & Batch View

In **Section 11 (Theory)**, students can control how many questions are visible per page:

| Mode | Questions Rendered | `Next` increments by |
|---|---|---|
| **Single View** (default) | 1 | 1 |
| **2-Column View** | 2 | 2 |

- A **"Switch to 2-Column View"** toggle button appears in the top-right corner of the card — **desktop only**
- On **mobile** (`≤ 768px`), the toggle is completely hidden and the view is forced to **1 question per page** regardless of the toggle state
- This is enforced by the `isMobile` state variable which listens to `window.resize` events
- The `viewCount` variable drives both the rendering slice and the navigation step:

```javascript
const viewCount = (isDoubleView && !isMobile) ? 2 : 1;
const slicedQuestions = stepQuestions.slice(theoryPageIndex, theoryPageIndex + viewCount);
```

- The view toggle also applies to **all 10 objective sections**, allowing instructors or students to page through questions 1 or 2 at a time throughout the entire 105-question exam
- Switching sections resets `theoryPageIndex` to `0` automatically

---

### 🔀 Question Randomisation

On quiz start, a **Fisher-Yates shuffle** is applied to:
1. The **order of questions** within each section
2. The **order of answer options** (A/B/C/D) for each objective question

This prevents students from memorising answer positions across sessions. The randomised question set is persisted in the quiz session and restored on page reload so the order never changes mid-exam.

---

## 💾 Data Persistence — localStorage Architecture

All application state is stored client-side. No backend server is required.

| Key | Contents | Cleared When |
|---|---|---|
| `quizSession` | Student answers, current section, page index, remaining time, student info | Student submits the quiz |
| `appSession` | Current view (`admin-panel`, `teacher-panel`, `quiz`, etc.) + teacher object | User clicks Exit / Logout |
| `quizResult` | The last submitted result (single object) | Overwritten on each submission |
| `allQuizResults` | Array of all student results indexed by Centre Number | Never (permanent dataset) |
| `teachers` | Array of teacher accounts (`{id, username, password, createdAt}`) | Never (permanent dataset) |

### Session Recovery on Reload

```
Page reloads  →  App reads `appSession` from localStorage
              →  Restores the last active view (admin dashboard, teacher panel, quiz screen)
              →  If the view was 'quiz', reads `quizSession` and restores:
                   - Student's answers
                   - Current section number
                   - Current page index within that section
                   - Remaining countdown time
```

### Safe Write Pattern

To prevent stale React state from overwriting newer localStorage data, `saveTheoryScores` and `publishResults` both use a **read-before-write** strategy:

```javascript
const fresh = getStoredResults(); // Always read direct from localStorage
fresh[resultIndex] = { ...fresh[resultIndex], ...newData };
localStorage.setItem("allQuizResults", JSON.stringify(fresh));
setResults([...fresh]); // Sync React state after writing
```

---

## 📱 UI & Responsiveness

The application uses a **mobile-first CSS architecture** with progressive enhancement via `min-width` media queries.

### Responsive Breakpoints

| Breakpoint | Layout change |
|---|---|
| `< 768px` | Single-column forms, compact padding, theory toggle hidden |
| `≥ 768px` | 2-column student info grid, larger inputs/buttons |
| `≥ 900px` | Quiz sidebar becomes a vertical column; input-grid doubles to 2 columns |

### Key Responsive Components

#### Section Navigation Ribbon
```
Mobile:   Horizontal scrollable ribbon at the top of the quiz area
Desktop:  Vertical sticky sidebar column (120px wide, 11 section buttons)
```

#### Admin Stats Grid (`.stats-grid`)
```
Mobile:  2 × 2 grid (2 columns)
Desktop: 1 × 4 grid (4 columns)
```

#### Glass Card
```
Mobile:  border-radius 20px, padding 24px 16px
Desktop: border-radius 32px, padding 60px
```

#### Typography
All headings use `clamp()` for fluid scaling:
```css
h1 { font-size: clamp(1.4rem, 5vw, 2.5rem); }
h2 { font-size: clamp(1.1rem, 4vw, 1.8rem); }
```

#### Admin Panel Tables
Wrapped in a `.table-scroll-wrap` container (`overflow-x: auto`) so columns remain legible on small screens without layout breakage.

---

## 📁 Project Structure

```
Quiz-demo-form/
├── public/
├── src/
│   ├── App.jsx          # All components (single-file architecture)
│   │   ├── App()                    # Core quiz component (105 questions, timer, pagination)
│   │   ├── AppWithAdmin()           # Top-level router/view-state manager
│   │   ├── AccessMenu()             # Role selection portal
│   │   ├── AdminLogin()             # Admin password gate
│   │   ├── TeacherLogin()           # Teacher credential gate
│   │   ├── AdminPanel()             # Shared Teacher + Admin results dashboard
│   │   ├── AdminManagementPanel()   # Admin-only teacher CRUD
│   │   ├── ScoringModal()           # Theory scoring (teacher) / review (admin)
│   │   └── StudentResultsPortal()   # Student result search
│   └── index.css        # Mobile-first design system
├── index.html
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `≥ 18`
- npm `≥ 9`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/GraceOyiza1/bank-form.git
cd bank-form

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build
```

---

## 🔧 Environment & Configuration

| Setting | Value | Location |
|---|---|---|
| Admin password | `admin123` | Hardcoded in `AdminLogin` component |
| Timer duration | `3600` seconds (1 hour) | `App` component state initialiser |
| Max students | `050` (Reg No 001–050) | `handleInfoSubmit` validation |
| Centre prefix | `234` (Nigeria) | `handleInfoChange` auto-generation logic |
| Total questions | `105` (`TOTAL_GOAL`) | Global constant |
| Total sections | `11` (`TOTAL_STEPS`) | Global constant |

> **Note:** For a production deployment, the Admin password should be moved to a secure environment variable and all data operations should be migrated to a backend database. The current implementation uses `localStorage` exclusively for simplicity and offline support.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <strong>Built with ❤️ by GraceOyiza</strong>
</div>
