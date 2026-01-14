# 🚀 GigFlow – Freelance Marketplace Platform

GigFlow is a full-stack freelance marketplace application that connects **clients** with **freelancers**.
Clients can post projects, freelancers can place bids, and clients can hire freelancers — all in a **secure, real-time enabled environment**.

---

## 🌐 Live Demo

**Frontend (Vercel)**
🔗 [https://gig-flow-frontend-three.vercel.app](https://gig-flow-frontend-three.vercel.app)

**Backend API (Render)**
🔗 [https://gigflow-backend-2xzz.onrender.com](https://gigflow-backend-2xzz.onrender.com)

---

## ✨ Key Features

### 🔐 Authentication

* User registration & login
* Secure JWT-based authentication
* HttpOnly cookies for session handling
* Protected routes for authorized users

### 📌 Gigs

* Create and post gigs (clients)
* Browse and search available gigs
* View gig details (budget, description, status)

### 💰 Bidding System

* Freelancers can place bids on open gigs
* Prevents duplicate bids on the same gig
* Clients can view all bids received on their gigs
* Hire a freelancer (automatic status updates)

### 🔔 Real-Time Notifications

* Socket.IO integration
* Freelancers receive real-time notification when hired

### 📊 Dashboard

* View gigs posted by the logged-in user
* View bids received on posted gigs
* Clean tab-based UI for better UX

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* TypeScript
* Tailwind CSS
* React Query
* Wouter (Routing)
* Axios
* Socket.IO Client

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Socket.IO
* CORS & Cookie-based sessions

---

## 🚀 Deployment

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas

---

## 📁 Project Structure

### Frontend

```
frontend/
├─ src/
│  ├─ components/
│  ├─ pages/
│  ├─ hooks/
│  ├─ lib/
│  └─ main.tsx
├─ vite.config.ts
├─ package.json
└─ README.md
```

### Backend

```
backend/
├─ src/
│  ├─ controllers/
│  ├─ routes/
│  ├─ models/
│  ├─ middleware/
│  ├─ config/
│  ├─ app.js
│  └─ server.js
├─ package.json
└─ README.md
```

---

## 🔑 Environment Variables

### Backend (`.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=https://gig-flow-frontend-three.vercel.app
NODE_ENV=production
```

### Frontend (`.env`)

```env
VITE_API_URL=https://gigflow-backend-2xzz.onrender.com/api
```

---

## 🧪 Local Setup Instructions

### Clone the Repository

```bash
git clone https://github.com/your-username/gigflow.git
cd gigflow
```

---

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs at:
➡️ `http://localhost:5000`

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:
➡️ `http://localhost:5173`

---

## 📡 API Overview (Sample)

| Method | Endpoint                | Description        |
| ------ | ----------------------- | ------------------ |
| POST   | `/api/auth/register`    | Register user      |
| POST   | `/api/auth/login`       | Login user         |
| GET    | `/api/auth/me`          | Get current user   |
| GET    | `/api/gigs`             | List gigs          |
| POST   | `/api/gigs`             | Create gig         |
| POST   | `/api/bids`             | Place bid          |
| GET    | `/api/bids/:gigId`      | Get bids for a gig |
| PATCH  | `/api/bids/:bidId/hire` | Hire freelancer    |

---

## 🎯 What This Project Demonstrates

* Full-stack application architecture
* Secure authentication & authorization
* RESTful API design
* Real-time communication using Socket.IO
* Clean UI/UX with reusable components
* Production-ready deployment with CORS & environment handling


## 👩‍💻 Author

**Lavanya Jain**
Full-Stack Developer
🔗 [https://github.com/lavanya-jain13](https://github.com/lavanya-jain13)

