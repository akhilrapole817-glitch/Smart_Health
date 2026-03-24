# Smart Health Assistant

A production-ready full-stack health support web application with AI-driven symptom checking, food interaction rules, and interactive medication scheduling. Built with Django REST and React.

## Features
- **User Authentication**: Secure token-based auth for personal medication tracking.
- **Medicine Dashboard**: Track medicines, schedules, and specific requires-food instructions.
- **Smart Reminders**: Automatically determines active prescriptions dynamically using start and end dates.
- **AI Food Compatibility**: A rule-based engine that checks for dangerous food/medication interactions (e.g. Grapefruit + Statins).
- **AI Symptom Support**: Analyzes user symptoms to provide safe medical alternatives or natural remedies, and cross-checks against current medications to warn against contraindications.

## Tech Stack
- **Backend**: Django 5, Django REST Framework, SQLite (PostgreSQL ready).
- **Frontend**: React, Vite, Axios, React Router, custom beautiful glassmorphism UI.
- **Docs**: Fully documented API via Swagger (`drf-spectacular`).

## Setup Instructions

### 1. Backend (Django API)
Open a terminal and navigate to the project root directory.

```bash
# Initialize virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install django djangorestframework django-cors-headers drf-spectacular

# Run database migrations
python manage.py migrate

# Start the development server
python manage.py runserver
```

### 2. Frontend (React UI)
Open a second terminal window and navigate to the `frontend` directory.

```bash
cd frontend

# Install Node modules
npm install

# Start the React development frontend
npm start
```

### 3. Usage
- Interact with the app in your browser at: `http://localhost:3000`
- Access Backend API Endpoints & Swagger Documentation at: `http://127.0.0.1:8000/api/schema/swagger-ui/`
