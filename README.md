LinkVault 🔐

LinkVault is a full-stack web application that allows users to securely share text or files using a unique link. Only users who possess the generated link can access the content, and the content automatically expires after a specified duration.

The project is inspired by systems like Pastebin and Google Drive link sharing.

---

Tech Stack

**Frontend**

* React (Vite)
* Tailwind CSS

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB Atlas

---

Environment & Versions:

This project was developed and tested with:

* Node.js: v18.x
* npm: v10.x
* MongoDB Atlas: Cloud Database
* OS Used During Development: Windows 11

> The project should run on Linux/macOS if Node 18+ is installed.

---

## Features

* Upload plain text or a file
* Generate unique secure shareable link
* Access content only using the exact link
* Automatic expiry (default 10 minutes)
* Copy-to-clipboard for text content
* File download support
* Optional one-time self-destruct links

---

## How It Works (Data Flow)

1. User uploads text/file from frontend
2. Backend stores metadata in MongoDB
3. Unique ID is generated
4. Link is shared with another user
5. User accesses content via link
6. Content expires or deletes after access (if one-time)

---

## Running Locally

### 1. Clone the repository

```
git clone <repo-link>
cd LinkVault
```

---

### 2. Backend Setup

```
cd backend
npm install
```

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Run backend:

```
npm run dev
```

---

### 3. Frontend Setup

Open another terminal:

```
cd frontend
npm install
npm run dev
```

Open in browser:

```
http://localhost:5173
```

---

## API Overview

| Method | Endpoint          | Description           |
| ------ | ----------------- | --------------------- |
| POST   | /api/upload       | Upload text           |
| POST   | /api/upload/file  | Upload file           |
| GET    | /api/content/:id  | Retrieve text content |
| GET    | /api/download/:id | Download file         |

---

## Important Notes

* Backend and frontend must run in separate terminals
* MongoDB Atlas must allow your IP address
* If port 5000 is busy, change PORT in `.env`
* Do NOT upload `.env` publicly (contains secrets)

---

## Assumptions & Limitations

* No authentication system implemented
* File storage is local (not cloud storage)
* Database must be configured manually for local run
* Expiry deletion depends on backend access

---

## Design Decisions

* Secure unique IDs generated using crypto random bytes
* MongoDB TTL index used for automatic expiry
* Separate endpoints for text and file handling
* Clean separation of frontend, backend and database layers

---

## Author

Shila Mitra
