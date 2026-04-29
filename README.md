# 💼 HireHorizon — Job Portal Backend

A secure, production-ready RESTful API for a MERN-stack job portal. Built with **Node.js**, **Express.js**, and **MongoDB** — it handles user authentication, company management, job postings, and job applications with file uploads via **Cloudinary**.

> 🚀 **Live Frontend:** [hirehorizonfrontendsystem.vercel.app](https://hirehorizonfrontendsystem.vercel.app)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v4 |
| Database | MongoDB + Mongoose |
| Authentication | JWT + HTTP-only Cookies |
| Password Hashing | bcryptjs |
| File Uploads | Multer + Cloudinary |
| Security | Helmet, CORS |
| Logging | Morgan |
| Deployment | Render / Railway |

---

## ✨ Features

- 🔐 **Auth** — Register, login, logout with JWT stored in HTTP-only cookies
- 👤 **User Profiles** — Update profile with resume/avatar upload via Cloudinary
- 🏢 **Companies** — Register and manage company profiles with logo uploads
- 💼 **Jobs** — Post jobs, browse all listings, filter admin-specific jobs
- 📄 **Applications** — Apply to jobs, track applied jobs, manage applicants, update application status
- 🛡 **Security** — Helmet headers, CORS restricted to frontend origin, async error handling
- 🌐 **404 Handler** — Catches all unmatched routes with a clean error response

---
```
## 📁 Project Structure

hirehorizon-backend/
├── src/
│   ├── config/
│   │   └── db.js                       # MongoDB connection
│   ├── controllers/
│   │   ├── application.controller.js   # Apply, get applicants, update status
│   │   ├── company.controller.js       # Register, fetch, update company
│   │   ├── job.controller.js           # Post, fetch, admin jobs
│   │   └── user.controller.js          # Register, login, logout, update profile
│   ├── middlewares/
│   │   ├── asyncHandler.js             # Async error wrapper
│   │   ├── errorMiddleware.js          # Global error handler
│   │   ├── isAuthenticated.js          # JWT cookie auth guard
│   │   └── multer.js                   # File upload middleware
│   ├── models/
│   │   ├── application.model.js
│   │   ├── company.model.js
│   │   ├── job.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── application.route.js
│   │   ├── company.route.js
│   │   ├── job.route.js
│   │   └── user.route.js
│   ├── utils/
│   │   ├── appError.js                 # Custom error class
│   │   ├── cloudinary.js               # Cloudinary upload helper
│   │   ├── dataUri.js                  # Buffer to DataURI converter
│   │   └── pagination.js               # Pagination helper
│   └── app.js                          # Express app, middleware & route mounting
├── .env
├── .gitignore
├── package.json
└── server.js                           # Entry point

```
---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- [Cloudinary](https://cloudinary.com) account
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/aadiityaasingh/hirehorizon-backend.git
cd hirehorizon-backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
touch .env
# Fill in your values (see below)

# 4. Start the server
npm start        # production
npm run dev      # development with nodemon
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
DB_URI=mongodb://localhost:27017/hirehorizon
SECRET_KEY=your_jwt_secret_key

CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

---

## 📡 API Reference

**Base URL:** `http://localhost:5000`

> 🔒 **[Protected]** — Requires a valid JWT cookie (set automatically on login)

---

### 👤 Users — `/api/user`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/user/register` | Public | Register a new user (with optional avatar upload) |
| POST | `/api/user/login` | Public | Login and receive JWT cookie |
| GET | `/api/user/logout` | Public | Logout and clear JWT cookie |
| POST | `/api/user/profile/update` | 🔒 Protected | Update profile info and resume/avatar |

```json
// POST /api/user/register  (multipart/form-data)
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",       // "student" or "recruiter"
  "file": "<avatar image>"
}

// POST /api/user/login
{
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

---

### 🏢 Companies — `/api/company`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/company/register` | Public | Register a new company |
| GET | `/api/company/get` | 🔒 Protected | Get all companies for logged-in recruiter |
| GET | `/api/company/get/:id` | 🔒 Protected | Get a company by ID |
| PUT | `/api/company/update/:id` | 🔒 Protected | Update company info and logo |

```json
// POST /api/company/register
{
  "companyName": "TechCorp"
}

// PUT /api/company/update/:id  (multipart/form-data)
{
  "name": "TechCorp Inc.",
  "description": "A great tech company",
  "website": "https://techcorp.com",
  "location": "Bangalore",
  "file": "<company logo>"
}
```

---

### 💼 Jobs — `/api/job`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/job/post` | 🔒 Protected | Post a new job |
| GET | `/api/job/get` | 🔒 Protected | Get all jobs (with search/filter) |
| GET | `/api/job/getAdminJobs` | 🔒 Protected | Get jobs posted by logged-in recruiter |
| GET | `/api/job/get/:id` | 🔒 Protected | Get a job by ID |

```json
// POST /api/job/post
{
  "title": "Backend Developer",
  "description": "Build REST APIs",
  "requirements": ["Node.js", "MongoDB"],
  "salary": "8 LPA",
  "location": "Remote",
  "jobType": "Full-time",
  "experience": 2,
  "position": 3,
  "companyId": "<companyId>"
}
```

---

### 📄 Applications — `/api/application`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/application/get` | 🔒 Protected | Get all jobs applied to by logged-in user |
| GET | `/api/application/apply/:id` | 🔒 Protected | Apply to a job by job ID |
| GET | `/api/application/:id/applicants` | 🔒 Protected | Get all applicants for a job |
| POST | `/api/application/status/:id/update` | 🔒 Protected | Update application status |

```json
// POST /api/application/status/:id/update
{
  "status": "accepted"   // "accepted", "rejected", or "pending"
}
```

---

## 🔐 Authentication Flow

1. Register via `POST /api/user/register`
2. Login via `POST /api/user/login` — JWT is set as an **HTTP-only cookie** automatically
3. All subsequent protected requests send the cookie automatically (no manual token handling needed)
4. Logout via `GET /api/user/logout` — cookie is cleared

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

> Built with 💙 as part of the HireHorizon MERN Job Portal