# 🎓 AI-TutorMatch

AI-TutorMatch is a full-stack intelligent tutor recommendation platform that connects students with suitable tutors based on subject specialization and availability. The system leverages Machine Learning to recommend tutors while providing secure role-based access for Students, Tutors, and Administrators.

The application is built using **Spring Boot**, **React**, **PostgreSQL**, and a **Python Machine Learning service**, and is deployed on **Amazon EC2** using **Docker**, **Docker Compose**, and **Nginx**.

---

# 🌐 Live Demo

🚀 **Application URL**

**http://52.209.138.130/**

### Production Deployment

* ☁️ Amazon EC2
* 🐳 Docker & Docker Compose
* 🌐 Nginx Reverse Proxy
* ☕ Spring Boot Backend
* ⚛️ React Frontend
* 🐘 PostgreSQL
* 🤖 Python Machine Learning Service

---

# 🚀 Features

## 👨‍🎓 Student

* Register and login securely
* Browse available subjects
* View tutors by subject
* Book tutoring sessions
* View booking history
* Cancel bookings
* Track academic performance
* Receive AI-powered tutor recommendations

---

## 👨‍🏫 Tutor

* Secure login
* Manage tutor profile
* View assigned subjects
* View tutoring sessions
* Track tutoring activities

---

## 👨‍💼 Administrator

* Manage students
* Manage tutors
* Create, update, and delete subjects
* Assign tutors to subjects
* View platform statistics
* Monitor bookings
* Manage users

---

## 🤖 Artificial Intelligence

* Intelligent tutor recommendation
* Machine Learning integration
* Student performance analysis
* Tutor matching based on specialization

---

# 🛠 Technology Stack

## Backend

* Java 21
* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA
* Hibernate
* Maven

---

## Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios
* Lucide React

---

## Database

* PostgreSQL

---

## AI Service

* Python
* Flask
* Scikit-learn
* Pandas
* NumPy

---

## DevOps & Cloud

* Docker
* Docker Compose
* Nginx
* Amazon EC2
* Terraform
* GitHub Actions

---

# 📁 Project Structure

```text
AI-TutorMatch/
│
├── backend/                   # Spring Boot REST API
├── ai-tutormatch-ui/          # React Frontend
├── AI-TutorMatch-ML/          # Python Machine Learning Service
├── docker-compose.yml
├── docker-compose.local.yml
├── docker-compose.prod.yml
└── README.md
```

---

# ⚙️ Getting Started

## Clone the Repository

```bash
git clone https://github.com/<your-username>/AI-TutorMatch.git
cd AI-TutorMatch
```

---

## Run Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8080
```

---

## Run Frontend

```bash
cd ai-tutormatch-ui
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## Run AI Service

```bash
cd AI-TutorMatch-ML

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python app.py
```

AI service runs on:

```
http://localhost:5000
```

---

# 🐳 Docker Deployment

Build the containers

```bash
docker compose -f docker-compose.local.yml build
```

Run the application

```bash
docker compose -f docker-compose.local.yml up -d
```

Stop the application

```bash
docker compose -f docker-compose.local.yml down
```

---

# 🔐 Authentication

The platform uses:

* JWT Authentication
* Role-Based Access Control (RBAC)

### Supported Roles

* ADMIN
* TUTOR
* STUDENT

---

# 🗄 Database Schema

Main tables include:

* users
* students
* tutors
* admins
* subjects
* tutor_subjects
* session_bookings
* tutor_matches
* student_performance

---

# 📚 API Documentation

Swagger UI is available after starting the backend:

```
http://localhost:8080/swagger-ui/index.html
```

---

# 📸 Application Modules

* Authentication
* Student Dashboard
* Tutor Dashboard
* Admin Dashboard
* Subject Management
* Tutor Management
* Student Management
* Session Booking
* AI Tutor Recommendation

---

# 🔮 Future Enhancements

* Email notifications
* AI chatbot
* Real-time messaging
* Video tutoring
* Attendance tracking
* Analytics dashboard
* Mobile application
* Payment gateway integration

---

# 👨‍💻 Developer

**Boikanyo Mohlamonyane**

* Advanced Diploma in Computer Science
* Tshwane University of Technology (TUT)

---

# 📄 License

This project is intended for educational, research, and portfolio purposes.

---

## ⭐ If you found this project interesting, consider giving it a star on GitHub!
