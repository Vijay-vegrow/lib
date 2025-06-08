# Vegrow Library Management System

A full-stack library management system built with **Ruby on Rails** (API backend) and **React** (frontend).

---

## Project Structure

```
lib/
  users/      # Rails API backend
  frontend/   # React frontend (Vite)
```

---

## Backend (Rails API)

- Ruby on Rails 8, MySQL, JWT authentication
- User roles: member, librarian, admin (admin signup disabled for security)
- CORS enabled for frontend dev

### Setup

```sh
cd users
bundle install
rails db:create db:migrate
rails server
```

---

## Frontend (React)

- React + Vite + Axios + Formik
- Modern, minimal, pale green UI

### Setup

```sh
cd frontend
npm install
npm run dev
```

---

## Usage

- Visit [http://localhost:5173](http://localhost:5173) for the frontend.
- Signup as member or librarian, then login.
- Dashboard routes are protected and require JWT token.

---

## Environment Variables

- Rails: configure DB in `config/database.yml`
- React: if needed, create `.env` for API base URL

