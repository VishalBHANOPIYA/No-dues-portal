# CDGI No-Dues Portal - Backend API

A Django 4.x + Django REST Framework backend API supporting JWT authentication, role management, and PostgreSQL integration. Designed for **Chameli Devi Group of Institutions (CDGI)**.

## 🚀 Quick Start Setup

Follow these steps to run the backend on your host machine:

### 1. Database Setup
Ensure you have **PostgreSQL** installed and running on your system, and create the database named `no_dues_db`:
```sql
CREATE DATABASE no_dues_db;
```

### 2. Dependency Installation
Navigate to the backend directory, activate the virtual environment, and install dependencies:
```bash
cd no_dues_backend
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Environment Secrets
Configure the `.env` file settings (which have been pre-created for you). If needed, update host, port, or password:
```env
SECRET_KEY=django-insecure-cdgi-no-dues-portal-development-secret-key-2026
DEBUG=True
DB_NAME=no_dues_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

### 4. Database Migrations
Initialize the custom User model tables and perform migrations:
```bash
python manage.py makemigrations accounts
python manage.py migrate
```

### 5. Start Development Server
Start the Django development server:
```bash
python manage.py runserver 8000
```
The server will now be accessible at `http://127.0.0.1:8000/`.

---

## 🔑 Authentication Endpoints

* **`POST /api/auth/login`**: Accepts `{email, password, role}`. Returns `{access_token, refresh_token, user}`.
  * *Note: For convenience during development, if a user does not exist in the database, the server will automatically register and seed them upon login!*
* **`POST /api/auth/refresh`**: Accepts `{refresh_token}`. Returns `{access_token}`.
* **`GET /api/auth/me`**: Returns the current authenticated user profile. (Requires `Authorization: Bearer <access_token>` header).
