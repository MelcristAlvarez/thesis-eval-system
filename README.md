# CEAFA Faculty Evaluation System
### UST-Legazpi · College of Engineering, Architecture, and Fine Arts
**Web-Based Faculty Performance Evaluation with AI-Guided Explainable Feedback**

---

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Folder Structure](#folder-structure)
3. [Prerequisites](#prerequisites)
4. [Step-by-Step Installation](#step-by-step-installation)
5. [Running the Application](#running-the-application)
6. [Build for Production](#build-for-production)
7. [Key Design Decisions](#key-design-decisions)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   BROWSER (Client)                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │  React 18 SPA (Vite)                            │   │
│  │  ┌──────────┐  ┌──────────────────────────────┐ │   │
│  │  │ Sidebar  │  │ Page Components              │ │   │
│  │  │ Header   │  │  - Dashboard (bento grid)    │ │   │
│  │  │ Footer   │  │  - EvaluationForm            │ │   │
│  │  └──────────┘  │  - AdminView (table/audit)   │ │   │
│  │                │  - About                     │ │   │
│  │                └──────────────────────────────┘ │   │
│  │  ┌──────────────────────────────────────────┐   │   │
│  │  │ Reusable UI: Badge · ScoreBar · StarRating│   │   │
│  │  │             Card · (+ future components) │   │   │
│  │  └──────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
            │ HTTP / REST (future backend integration)
┌─────────────────────────────────────────────────────────┐
│               LOCAL UNIVERSITY SERVER                   │
│   ┌──────────────────┐   ┌──────────────────────────┐  │
│   │   Database       │   │  AI Feedback Engine      │  │
│   │   (MySQL / PG)   │   │  Fine-tuned LLM + QLoRA  │  │
│   │   - Evaluations  │   │  (runs locally, no cloud)│  │
│   │   - Faculty data │   └──────────────────────────┘  │
│   │   - Audit logs   │                                  │
│   └──────────────────┘                                  │
└─────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
ceafa-eval-system/
│
├── public/
│   └── index.html               # HTML entry point, font imports
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx       # Sticky top bar (page title, user chip)
│   │   │   ├── Sidebar.jsx      # Fixed left sidebar with navigation
│   │   │   └── Footer.jsx       # Minimal bottom footer
│   │   │
│   │   └── ui/
│   │       ├── Badge.jsx        # Status pill (excellent/good/average/etc.)
│   │       ├── Card.jsx         # Reusable elevated surface card
│   │       ├── ScoreBar.jsx     # Animated horizontal score bar
│   │       └── StarRating.jsx   # Interactive/read-only star input
│   │
│   ├── data/
│   │   └── mockData.js          # All mock data (replace with API calls)
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx        # Faculty performance overview (bento grid)
│   │   ├── EvaluationForm.jsx   # Student evaluation submission form
│   │   ├── AdminView.jsx        # Program Chair dashboard + audit log
│   │   └── About.jsx            # System info and research basis
│   │
│   ├── styles/
│   │   ├── global.css           # CSS reset, design tokens, animations
│   │   └── theme.js             # Design tokens as JS constants
│   │
│   ├── App.jsx                  # Root component — layout + page router
│   └── main.jsx                 # React DOM entry point
│
├── package.json                 # Dependencies and scripts
├── vite.config.js               # Vite configuration
└── README.md                    # This file
```

---

## Prerequisites

Before installing, make sure the following are on your machine:

| Requirement | Version | Check command        |
|-------------|---------|----------------------|
| Node.js     | ≥ 18.x  | `node --version`     |
| npm         | ≥ 9.x   | `npm --version`      |
| Git         | any     | `git --version`      |

> **Tip:** If you do not have Node.js, follow the installation steps below.

---

## Step-by-Step Installation

### Step 1 — Install Node.js

**Windows / macOS:**
1. Go to https://nodejs.org
2. Download the **LTS** version (recommended).
3. Run the installer and follow the prompts.
4. Verify the installation:
   ```bash
   node --version
   npm --version
   ```
   Both commands should print version numbers.

**Using nvm (optional, recommended for developers):**
```bash
# Install nvm (macOS / Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Restart your terminal, then:
nvm install --lts
nvm use --lts
node --version
```

---

### Step 2 — Get the project files

**Option A — Copy the folder directly**
Place the `ceafa-eval-system/` folder anywhere on your computer, e.g.:
```
C:\Projects\ceafa-eval-system\        (Windows)
/Users/yourname/Projects/ceafa-eval-system/   (macOS / Linux)
```

**Option B — Initialize from Git (future)**
```bash
git clone https://github.com/your-repo/ceafa-eval-system.git
cd ceafa-eval-system
```

---

### Step 3 — Open a terminal in the project folder

**Windows:**
- Open File Explorer, navigate to `ceafa-eval-system/`
- Hold `Shift`, right-click → *Open PowerShell window here*

**macOS:**
- Open Terminal, then type:
  ```bash
  cd /path/to/ceafa-eval-system
  ```

**VS Code (recommended):**
- Open the folder in VS Code (`File → Open Folder`)
- Press `` Ctrl + ` `` (backtick) to open the integrated terminal

---

### Step 4 — Install dependencies

Inside the `ceafa-eval-system/` directory, run:

```bash
npm install
```

This reads `package.json` and downloads all required packages into a
`node_modules/` folder. This only needs to be done **once** (or after
updating `package.json`).

Expected output:
```
added 143 packages in 12s
```

---

### Step 5 — Start the development server

```bash
npm run dev
```

Vite will start a local development server. You should see:

```
  VITE v6.x.x  ready in 350ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

Open your browser and navigate to **http://localhost:5173**

The app will hot-reload automatically whenever you save a file.

---

## Running the Application

| Command            | Description                                  |
|--------------------|----------------------------------------------|
| `npm run dev`      | Start development server (hot-reload)        |
| `npm run build`    | Compile and bundle for production            |
| `npm run preview`  | Preview the production build locally         |

---

## Build for Production

When the system is ready for deployment to the university server:

```bash
npm run build
```

This creates a `dist/` folder containing optimized static files.
Copy the contents of `dist/` to the university web server's public directory.

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Vite** instead of Create React App | Significantly faster dev server and builds |
| **No CSS framework** (no Tailwind/Bootstrap) | Full control over the dark academic aesthetic; avoids bloat |
| **CSS Variables** in `global.css` | Single source of truth for all colors and spacing |
| **mockData.js** as a single data file | Easy to swap for real API calls in production |
| **Component-level inline styles** | Keeps each component self-contained and portable |
| **State-based routing** (no URL change) | Simplifies deployment; no server-side routing config needed |

---

*University of Santo Tomas–Legazpi · CEAFA · BSCS 3G · February 2026*
*Researchers: Alvarez, M.T. · Indiongco, P.J.V. · Jalina, A.G.B.*
*Adviser: Sherry Mae R. Llandelar, LPT, DIT*
