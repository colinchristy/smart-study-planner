# Smart Study Planner

Smart Study Planner is a web-based application that helps students manage assignments, track deadlines, and monitor task completion.

## Team
- Dustin De Luna
- Colin Christy
- Aasvi Patel
- Cam Iwema
- Isaiah Lubia

## Features
- Create and manage tasks
- Track due dates
- Mark tasks as completed
- View tasks by class
- Organize tasks using classes

---

## Database Design (ERD)

The following Entity Relationship Diagram represents the current backend database structure.

<img width="1031" height="618" alt="image" src="https://github.com/user-attachments/assets/5609fff1-230b-4657-8933-954da823da0c" />

## Database Schema Documentation

This section describes the database tables, keys, and relationships used in the Smart Study Planner backend.

---

### Tables Overview

| Table Name | Description |
|------------|-------------|
| AUTH_USER | Stores user account information using Django’s built-in authentication system |
| CLASS | Stores classes created by users |
| PLANNER_TASK | Stores tasks created by users and linked to a class |

---

## Table: AUTH_USER

**Description:**  
Stores user authentication and account information. This table is provided by Django’s built-in authentication system.

| Column | Type | Key | Description |
|------|------|------|-------------|
| id | Integer | PK | Unique identifier for each user |
| username | String | | Username used for login |
| email | String | | User email address |
| password | String | | Encrypted password |

**Primary Key**

---

## Table: CLASS

**Description:**  
Stores class information created by users. Each class belongs to a specific user.

| Column | Type | Key | Description |
|------|------|------|-------------|
| id | Integer | PK | Unique identifier for each class |
| name | String | | Name of the class |
| user_id | Integer | FK | References the user who owns the class |

**Primary Key**

---

## Table: PLANNER_TASK

**Description:**  
Stores tasks created by users, linked to a specific class, including deadlines and completion status.

| Column | Type | Key | Description |
|------|------|------|-------------|
| id | Integer | PK | Unique identifier for each task |
| user_id | Integer | FK | References the user who created the task |
| class_id | Integer | FK | References the class associated with the task |
| title | String | | Title of the task |
| due_date | Date | | Deadline for the task |
| status | String | | Current task status (pending or completed) |
| created_at | DateTime | | Timestamp when the task was created |

**Primary Key**

---

## Table Relationships

## Table Relationships

| Relationship | Type |
|--------------|------|
| AUTH_USER → CLASS | One-to-Many |
| AUTH_USER → PLANNER_TASK | One-to-Many |
| CLASS → PLANNER_TASK | One-to-Many |

## Explanation

- One **User** can create multiple **Classes**.
- One **User** can create multiple **Tasks**.
- Each **Class** can contain multiple **Tasks**.
- Each **Task** belongs to one **User** and one **Class**.

Relationship representation:
AUTH_USER (1) -------- (N) CLASS
AUTH_USER (1) -------- (N) PLANNER_TASK
CLASS (1) -------- (N) PLANNER_TASK

---

## Schema Notes

- `AUTH_USER` is managed by Django’s built-in authentication system.
- The `CLASS` table allows users to organize tasks by subject or category.
- The `PLANNER_TASK` table links tasks to both a user and a class.

## Repository Structure

smart-study-planner/
│
├── backend/                                   # Django backend application
│   │
│   ├── planner/                               # Main backend app
│   │   ├── models.py                          # Database models (Task schema)
│   │   ├── serializers.py                     # API serializers
│   │   ├── views.py                           # API endpoints and business logic
│   │   ├── urls.py                            # API routing configuration
│   │   ├── tests.py                           # Backend tests
│   │   └── migrations/                        # Database migrations
│   │
│   ├── smart_study_planner/                   # Django project configuration
│   │   ├── settings.py                        # Project settings
│   │   ├── urls.py                            # Root URL configuration
│   │   ├── asgi.py                            # ASGI server configuration
│   │   └── wsgi.py                            # WSGI server configuration
│   │
│   └── manage.py                              # Django management entry point
│
├── frontend/                                  # Frontend application
│   └── (frontend UI files)                    # Interface components and pages
│
├── docs/                                      # Project documentation
│   ├── Smart_Study_Planner_ERD_v1.png         # Entity Relationship Diagram
│   └── database_schema.md                     # Database schema documentation
│
├── README.md                                  # Project overview and instructions
├── LICENSE                                    # MIT License
└── .gitignore                                 # Git ignored files
