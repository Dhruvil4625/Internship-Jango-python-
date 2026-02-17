from django.shortcuts import render, redirect, get_object_or_404
from .models import Service
from .forms import ServiceForm


# LIST
def serviceList(request):
    data = Service.objects.all()
    return render(request, "services1/serviceList.html", {"data": data})


# CREATE
def serviceCreate(request):
    if request.method == "POST":
        form = ServiceForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("service_list")
    else:
        form = ServiceForm()

    return render(request, "services1/serviceForm.html", {"form": form})


# UPDATE
def serviceUpdate(request, id):
    service = get_object_or_404(Service, id=id)

    if request.method == "POST":
        form = ServiceForm(request.POST, instance=service)
        if form.is_valid():
            form.save()
            return redirect("service_list")
    else:
        form = ServiceForm(instance=service)

    return render(request, "services1/serviceForm.html", {"form": form})


# DELETE
def serviceDelete(request, id):
    service = get_object_or_404(Service, id=id)
    service.delete()
    return redirect("service_list")