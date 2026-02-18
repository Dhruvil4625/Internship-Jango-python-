from django.shortcuts import render

# Create your views here.

def studentHome(request):
    return render(request, "student/studentHome.html")

def studentDashboard(request):

    courses = [
        "Python for Data Science",
        "Machine Learning Basics",
        "Deep Learning Fundamentals",
        "Django for Web Development",
        "AI Project Development"
    ]

    data = {
        "student_name": "Dhruvil",
        "student_id": "STU2025AI",
        "course_count": len(courses),
        "courses": courses,
        "progress": 72,
        "status": "Active"
    }

    return render(request, "student/studentDashboard.html", data)

def studentAttendance(request):
    data = {
        "total_classes": 120,
        "attended_classes": 102,
        "attendance_percentage": 85,
        "status": "Eligible"
    }
    return render(request, "student/studentAttendance.html", data)

def studentAssignments(request):
    assignments = [
        {"title": "Python Basics", "status": "Completed"},
        {"title": "ML Model Training", "status": "Submitted"},
        {"title": "Django Mini Project", "status": "Pending"},
    ]

    data = {
        "assignments": assignments
    }

    return render(request, "student/studentAssignments.html", data)

def studentNotices(request):
    notices = [
        "AI Project submission on Friday",
        "Machine Learning test on Monday",
        "Internship review meeting next week"
    ]

    data = {
        "notices": notices
    }

    return render(request, "student/studentNotices.html", data)

