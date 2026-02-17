# Learning26 Django Project

This is a Django-based project developed for learning and practicing core Django concepts including:

- App creation
- Models
- Migrations
- CRUD operations
- Forms (ModelForm)
- Filtering
- Sorting
- PostgreSQL integration
- Template structure
- Admin panel usage

---

# 🛠 Technology Used

- Python 3.11
- Django 5.2
- PostgreSQL
- pgAdmin4
- HTML (Django Templates)

---

# 🗂 Project Structure

learning26/
│
├── student/
├── employee/
├── services1/
├── test1/
├── learning26/
├── templates/
└── manage.py

---

# 📦 Installed Apps
- "student",
- "employee",
- "services1",
- "test1",

---

# 🧩 Apps Description

---

# 1️⃣ Student App

## Features:
- Student Model
- Product Model
- Marketing Campaign
- Course
- Enrollment
- Category
- User Account
- Profile (One-to-One relationship)
- Foreign Key relationships
- Normalization concepts

## Relationships:
- One-to-One → Student ↔ Profile
- One-to-Many → Course → Enrollment
- User → Order (FK concept practiced)

## Templates:
student/templates/student/

Files include:
- studentList.html
- product.html
- marketing.html
- course.html
- enrollment.html

---

# 2️⃣ Employee App

## Features:
- Employee Model
- CRUD operations
- ModelForm usage
- Sorting (ID & Name)
- Filtering (Salary > 30000)
- Update
- Delete
- DateField validation
- PostgreSQL table creation

## Employee Fields:
- name
- age
- salary
- join_date
- post

## Templates:

employee/templates/employee/

- course.html (List Page)
- employeeForm.html (Create & Update)
- employeeFilter.html (Filter Page)

## URLs:
- /employee/employeeList/
- /employee/create/
- /employee/update/<id>/
- /employee/delete/<id>/
- /employee/filter/

---

# 3️⃣ Services1 App

## Features:
- Service Model
- CRUD Operations
- ModelForm
- BooleanField
- DateField
- Duration tracking
- PostgreSQL table creation

## Service Fields:
- service_name
- price
- description
- duration
- is_active
- created_date

## Templates:

services1/templates/services1/

- serviceList.html
- serviceForm.html

## URLs:
- /services1/list/
- /services1/create/
- /services1/update/<id>/
- /services1/delete/<id>/

---

# 4️⃣ Test1 App

## Purpose:
- Practice relationships
- Order Model
- Foreign Key implementation
- Normalization practice

## Concepts Practiced:
- One-to-Many relationship
- Database normalization
- Model registration warning understanding

---

# 🗄 Database Configuration

Using PostgreSQL:
ENGINE: django.db.backends.postgresql
NAME: learning26
USER: postgres
PORT: 5432


Tables created:
- employee_employee
- services1_service
- student_student
- test1_order
- auth tables
- django_admin_log

---

# 🧠 Concepts Practiced

- makemigrations
- migrate
- showmigrations
- dbshell
- ModelForm
- ForeignKey
- OneToOneField
- QuerySet filtering
- order_by()
- request.GET
- request.POST
- URL routing
- Template rendering
- Admin panel usage

---

# 🚀 How To Run Project

1. Activate virtual environment
2. Install dependencies
3. Configure PostgreSQL
4. Run:
- python manage.py makemigrations
- python manage.py migrate
- python manage.py runserver


5. Open:
http://127.0.0.1:8000/


---

# 📚 Learning Outcome

This project demonstrates:

- Complete CRUD implementation
- Multi-app Django project structure
- Database relationships
- Template folder structuring
- PostgreSQL integration
- Real-world Django development workflow

---

# 👨‍💻 Developed By

Dhruvil  
B.Tech CSE Student  
Django Learning Project

