from django.shortcuts import render, redirect, get_object_or_404
from .models import Service, Category
from .forms import ServiceForm, CategoryForm


# LIST
def serviceList(request):
    services = Service.objects.all()
    return render(request, "services1/serviceList.html", {"data": services})


# CREATE
def serviceCreate(request):
    if request.method == "POST":
        form = ServiceForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("service_list")
    else:
        cat_id = request.GET.get("categoryId")
        if cat_id:
            form = ServiceForm(initial={"categoryId": cat_id})
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
    if request.method == "POST":
        service.delete()
        return redirect("service_list")
    return render(request, "services1/serviceConfirmDelete.html", {"service": service})

def createService(request):

    if request.method =="POST":
        form = ServiceForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("service_list")
        else:
            return render(request,"services1/createService.html",{"form":form})    
    else:
        cat_id = request.GET.get("categoryId")
        if cat_id:
            form = ServiceForm(initial={"categoryId": cat_id})
        else:
            form = ServiceForm()
        return render(request,"services1/createService.html",{"form":form})

def categoryCreate(request):
    if request.method == "POST":
        form = CategoryForm(request.POST)
        if form.is_valid():
            category = form.save()
            return redirect(f"/services1/create/?categoryId={category.id}")
    else:
        form = CategoryForm()
    return render(request, "services1/categoryForm.html", {"form": form})
