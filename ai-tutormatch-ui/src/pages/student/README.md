# 🎓 AI-TutorMatch

AI-TutorMatch is a full-stack intelligent tutor recommendation system that connects students with suitable tutors based on their subjects, availability, and specialization. The platform includes role-based authentication, tutor management, subject management, booking sessions, and AI-powered tutor recommendations.

---

## 🚀 Features

### 👨‍🎓 Student
- Register and Login
- View available subjects
- Browse tutors by subject
- Book tutoring sessions
- View booking history
- Cancel bookings
- View academic performance
- Receive AI tutor recommendations

### 👨‍🏫 Tutor
- Login
- Manage profile
- View assigned subjects
- View scheduled tutoring sessions
- Accept or decline bookings
- Track tutoring statistics

### 👨‍💼 Admin
- Manage students
- Manage tutors
- Create, update and delete subjects
- Assign tutors to subjects
- View platform statistics
- Manage users
- Monitor bookings

### 🤖 AI Features
- Intelligent tutor recommendation
- Student performance analysis
- Tutor matching based on specialization
- Machine Learning recommendation service

---

# 🛠 Technology Stack

## Backend
- Java 21
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- PostgreSQL
- Maven

## Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide Icons

## AI Service
- Python
- Flask
- Scikit-Learn
- Pandas
- NumPy

## DevOps
- Docker
- Docker Compose
- Nginx
- GitHub Actions
- Terraform (Infrastructure as Code)

---

# 📂 Project Structure

```
ai-tutormatch/
│
├── backend/                 # Spring Boot API
├── ai-tutormatch-ui/        # React Frontend
├── AI-TutorMatch-ML/        # Python ML Service
├── docker-compose.yml
├── docker-compose.local.yml
└── README.md
```

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/<your-username>/ai-tutormatch.git
cd ai-tutormatch
```

---

# Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Runs on:

```
http://localhost:8080
```

---

# Frontend

```bash
cd ai-tutormatch-ui
npm install
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

# AI Service

```bash
cd AI-TutorMatch-ML

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python app.py
```

Runs on:

```
http://localhost:5000
```

---

# Docker

Build all services

```bash
docker compose -f docker-compose.local.yml build
```

Run

```bash
docker compose -f docker-compose.local.yml up
```

Stop

```bash
docker compose -f docker-compose.local.yml down
```

---

# API Documentation

After starting the backend

```
http://localhost:8080/swagger-ui/index.html
```

---

# Authentication

The system uses

- JWT Authentication
- Role-Based Access Control (RBAC)

Roles

- ADMIN
- TUTOR
- STUDENT

---

# Database

PostgreSQL

Main Tables

- users
- students
- tutors
- admins
- subjects
- tutor_subjects
- session_bookings
- student_performance
- tutor_matches

---

# Screens

- Login
- Dashboard
- Student Dashboard
- Tutor Dashboard
- Admin Dashboard
- Subject Management
- Tutor Management
- Student Management
- Booking Management
- AI Recommendation

---

# Future Improvements

- Email Notifications
- Video Tutoring
- Chat System
- Attendance Tracking
- AI Chatbot
- Mobile Application
- Analytics Dashboard
- Payment Integration

---

# Contributors

**Boikanyo Mohlamonyane**

Advanced Diploma in Computer Science

Tshwane University of Technology

---

# License

This project is for educational and research purposes.