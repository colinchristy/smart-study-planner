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
- View tasks by course

---

## Database Design (ERD)

The following Entity Relationship Diagram represents the current backend database structure.

https://github.com/colinchristy/smart-study-planner/blob/729d9d7aaf471951d10abd793d6338af16b37512/Smart_Study_Planner_ERD_v1.png

## Database Schema Documentation

This section describes the database tables, keys, and relationships used in the Smart Study Planner backend.

---

### Tables Overview

| Table Name | Description |
|------------|-------------|
| AUTH_USER | Stores user account information using Django’s built-in authentication system |
| PLANNER_TASK | Stores tasks created by users including course information, due dates, and completion status |

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

## Table: PLANNER_TASK

**Description:**  
Stores tasks created by users including course association, due dates, progress tracking, and status.

| Column | Type | Key | Description |
|------|------|------|-------------|
| id | Integer | PK | Unique identifier for each task |
| user_id | Integer | FK | References the user who created the task |
| title | String | | Title of the task |
| course | String | | Course associated with the task |
| due_date | Date | | Deadline for the task |
| percent_complete | Integer | | Percentage of task completion (0–100) |
| status | String | | Current task status (pending or completed) |
| created_at | DateTime | | Timestamp when the task was created |

**Primary Key**


---

## Table Relationships

| Relationship | Type |
|--------------|------|
| AUTH_USER → PLANNER_TASK | One-to-Many |

**Explanation**

- One **User** can create multiple **Tasks**.
- Each **Task** belongs to exactly one **User**.

Relationship representation:

---

## Schema Notes

- `AUTH_USER` is managed by Django’s built-in authentication system.
- `percent_complete` supports the **progress tracking dashboard** feature of the application.
- `status` indicates whether a task is pending or completed.
- Each task is associated with a user through the `user_id` foreign key.

## Repository Structure

```text
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
