# Task Management Application

A secure, full-stack Task Management application built with Next.js 15, React, and MongoDB. This application demonstrates advanced full-stack capabilities, including custom robust JWT authentication, AES payload encryption, server-side pagination, sorting, and responsive modern glassmorphism UI.

## Features

**Core Requirements Met:**
- **User Registration & Login**
- **JWT-based Authentication** with secure token storage in HttpOnly cookies.
- **Passwords Hashed** securely using `bcryptjs`.
- **Full CRUD APIs** for tasks (Title, Description, Status, Created Date).
- **Proper Authorization** ensuring users can only access their own tasks.
- **Validation & Error Handling** using `Zod` for strict payload checking.

**Security & Advanced Expectations:**
- Secure cookie configuration (`HttpOnly`, `Secure`, `SameSite`).
- **AES Payload Encryption:** Sensitive login and registration credentials are encrypted on the client side using `crypto-js` before transmission, and decrypted natively on the server.
- Protection against common vulnerabilities (Input validation via Zod, NoSQL injection prevention via Mongoose).
- Environment variables utilized securely without hardcoding.

**Functional Expectations:**
- API & UI **Pagination** for listing tasks.
- API & UI **Filtering** by task status (`PENDING`, `IN_PROGRESS`, `COMPLETED`).
- API & UI **Search** by task title.
- Fully **Protected Frontend Routes**.
- Clean, modern, responsive UI built with Tailwind CSS.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Frontend:** React, Tailwind CSS, Lucide React (Icons)
- **Backend:** Next.js API Routes (`/api/*`)
- **Database:** MongoDB (via Mongoose ODM)
- **Security & Auth:** `jsonwebtoken` (JWT), `bcryptjs`, `crypto-js` (AES Encryption), `zod` (Validation)

---

## Folder Structure

```
src/
├── app/
│   ├── (auth)/        # Authentication UI routes (Login, Register)
│   ├── api/           # Backend API routes
│   │   ├── auth/      # Auth endpoints (login, register, logout, me)
│   │   └── tasks/     # Task CRUD endpoints
│   ├── dashboard/     # Protected Dashboard UI
│   ├── globals.css    # Global Tailwind styles
│   ├── layout.tsx     # Root Layout with AuthProvider
│   └── page.tsx       # Landing Page
├── components/        # Reusable UI components (Navbar, etc.)
├── lib/               # Utility functions (db connection, encryption, auth)
└── models/            # Mongoose schemas (User, Task)
```

---

## Setup Instructions (Local Development)

### 1. Clone or Download the repository
Navigate to the root directory of the project in your terminal:
```bash
cd Task_manager
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add the following keys. Replace the placeholder values with your actual secrets.

```env
# MongoDB Connection String (Required)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/your_db_name

# JWT Secret for signing tokens (Required)
JWT_SECRET=super_secret_jwt_key_for_development

# Symmetric AES Encryption Key (Required - Must match on client & server)
ENCRYPTION_KEY=32_character_encryption_key_here
NEXT_PUBLIC_ENCRYPTION_KEY=32_character_encryption_key_here
```
*Note: `NEXT_PUBLIC_ENCRYPTION_KEY` is required so the frontend can encrypt payloads before sending them to the API. It should be identical to the server `ENCRYPTION_KEY`.*

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment (Production Configuration)

This app is optimized for serverless deployments on platforms like **Vercel**, **Render**, or **Railway**.

### Vercel Deployment Example
1. Push this code to a GitHub repository.
2. Import the project in your Vercel dashboard.
3. In the Vercel **Environment Variables** section, add the same variables from your `.env.local` file:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `ENCRYPTION_KEY`
   - `NEXT_PUBLIC_ENCRYPTION_KEY`
4. Click **Deploy**. Vercel will automatically build the Next.js application and deploy the API routes as Serverless Functions.

---

## Architecture & Data Flow Explanation

### 1. Client-Server Architecture
The application runs as a monolith utilizing the **Next.js App Router**. The React frontend communicates directly with the Node.js backend natively housed in `/app/api`.

### 2. Authentication Flow
- **Registration/Login:** When a user submits their credentials (Email/Password), the frontend encrypts the payload using `CryptoJS` (AES). 
- **Decryption:** The server (`/api/auth/login`) receives the payload, decrypts it using the shared secret, and validates it using `Zod`.
- **JWT Generation:** Upon successful authentication (verifying bcrypt hashes), a JSON Web Token (JWT) is generated containing the `userId`.
- **Cookie Storage:** The server immediately attaches an `HttpOnly`, `Secure` cookie to the response containing the JWT. Because this cookie is `HttpOnly`, it cannot be accessed via Client-Side JavaScript (XSS protection).
- **Session Resolution:** The frontend wraps the application in an `<AuthProvider>` (React Context), which queries the `/api/auth/me` endpoint to read the auth state periodically and manage protected routes gracefully.

### 3. Database Layer & Optimization
- **Mongoose ODM:** Defines strict Schemas (`src/models`).
- **Connection Caching:** The database connection (`src/lib/db.ts`) caches connections globally to prevent connection spikes during serverless cold starts.
- **Indexes:** MongoDB compound indexes are used on the `Task` schema (`{ userId: 1, status: 1 }`, `{ title: "text" }`) to make searching and pagination significantly faster.

### 4. API Endpoints
- `POST /api/auth/register` - Registers a user, hashes passwords, sets cookie.
- `POST /api/auth/login` - Authenticates a user, sets cookie.
- `GET  /api/auth/me` - Verifies current user context via cookie decoding.
- `POST /api/auth/logout` - Destroys the HttpOnly cookie.
- `GET  /api/tasks` - Retrieves tasks with Pagination (`?page=1&limit=10`), Filter (`?status=COMPLETED`), and Search (`?search=query`).
- `POST /api/tasks` - Creates a task.
- `PUT  /api/tasks/:id` - Updates a task.
- `DELETE /api/tasks/:id` - Deletes a task.

All Task API operations automatically check the `HttpOnly` cookie to extract the `userId`, inherently preventing users from interacting with data they do not own.
