# 🛠️ TaskFlow - Enterprise Kanban & Task Manager
*A production-grade, secure MERN stack project management and team collaboration dashboard.*

TaskFlow is a multi-tenant Kanban scheduling board featuring full drag-and-drop state modifications, custom analytic progress charts, and robust backend security filters. It is designed to emulate standard Jira/Trello workflows for engineering teams.

---

## 🚀 Key Features

*   **Interactive Kanban Board:** Fluid drag-and-drop system updating card states (`To Do` ➔ `In Progress` ➔ `Done`) instantly, synchronized to database hooks.
*   **Analytics Dashboard:** Dynamic, SVG-rendered donut charts and progress trackers displaying task ratios, priority splits, and completion trends.
*   **JWT Token Authorization:** Secure stateless authentication and registration using signed JSON Web Tokens.
*   **Security Protection System:** Hardened against web attacks:
    *   **Helmet Headers:** Set secure HTTP headers to block Clickjacking and script injection.
    *   **NoSQL Injection Blocker:** Filters operators like `$gt` in query objects (`express-mongo-sanitize`).
    *   **Recursive XSS Filter:** Custom middleware recursively stripping HTML tags (`/<[^>]*>/g`) from input bodies, parameters, and queries.
    *   **DoS Mitigation:** Request payload limits locked at `10kb`.
*   **Task Organization:** Category tagging, priority levels (`low`, `medium`, `high`), due date validations, and search text filters.

---

## 📂 System Architecture

```text
taskflow/
├── backend/                  # RESTful API Server (Node.js & Express)
│   ├── config/               # database singleton configurations
│   ├── controllers/          # Business logic handlers
│   ├── middleware/           # auth validation, XSS and rate limiting guards
│   ├── models/               # MongoDB Mongoose schemas
│   └── routes/               # Express endpoint routing path maps
│
└── frontend/                 # Client SPA (React 18 + Vite)
    ├── src/
    │   ├── components/       # Kanban elements, donut gauges, Layout containers
    │   ├── context/          # Auth context provider
    │   ├── pages/            # View pages (Kanban, Dashboard, Auth)
    │   └── services/         # Axios API connection configurations
```

---

## 🔒 Security Hardening Review

Most portfolio projects lack web safety checks. TaskFlow has been configured with an active security gate:

1. **Helmet Protection:** Shields backend REST API routes from cross-site scripts and packet interception.
2. **Operator Injection Shield:** Intercepts request JSON models and purges Mongo operators, ensuring parameters match strict data types.
3. **HTML Sanitizer:** Prevents Cross-Site Scripting (XSS) by running recursive string filtering to strip tags from text bodies:
    ```javascript
    const stripHtml = (obj) => {
      for (let key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = obj[key].replace(/<[^>]*>/g, '');
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          stripHtml(obj[key]);
        }
      }
    };
    ```

---

## 📊 Database Relational Schema

### User Schema (`User`):
*   `name`: String, required.
*   `email`: String, required, unique, lowercase index.
*   `password`: String (Bcrypt hashed, select: false).
*   `avatar`: String default.

### Task Schema (`Task`):
*   `title`: String, required, trimmed.
*   `description`: String.
*   `status`: String, enum: `['todo', 'in-progress', 'done']`.
*   `priority`: String, enum: `['low', 'medium', 'high']`.
*   `dueDate`: Date.
*   `tags`: Array of Strings.
*   `userId`: ObjectId reference to `User` (Index).

---

## 🛠️ Local Setup Guide

### Prerequisites
*   Node.js (v18+)
*   MongoDB Cluster URL

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Set environment variables. Create a `.env` file matching `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_signature_secret
   CLIENT_URL=http://localhost:5173
   ```
4. Run in development mode:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Boot the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

"
