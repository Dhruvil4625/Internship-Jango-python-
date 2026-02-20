from django.shortcuts import render, redirect, get_object_or_404
from .models import Employee
from .forms import EmployeeForm



# Show all employees (with sorting)
def employeeList(request):
    data = Employee.objects.all()
    sort = request.GET.get("sort")

    if sort:
        data = data.order_by(sort)

    return render(request, "employee/course.html", {"data": data})


# Filter employees (salary > 30000)
def employeeFilter(request):
    data = Employee.objects.filter(salary__gt=30000)
    return render(request, "employee/employeeFilter.html", {"data": data})


# Create employee
def employeeCreate(request):
    if request.method == "POST":
        form = EmployeeForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("employee_list")
    else:
        form = EmployeeForm()

    return render(request, "employee/employeeForm.html", {"form": form})


# Update employee
def employeeUpdate(request, id):
    emp = get_object_or_404(Employee, id=id)

    if request.method == "POST":
        form = EmployeeForm(request.POST, instance=emp)
        if form.is_valid():
            form.save()
            return redirect("employee_list")
    else:
        form = EmployeeForm(instance=emp)

    return render(request, "employee/employeeForm.html", {"form": form})


# Delete employee
def employeeDelete(request, id):
    emp = get_object_or_404(Employee, id=id)
    emp.delete()
    return redirect("employee_list")

