from django.shortcuts import render, redirect, get_object_or_404
from .models import Service, Category
from django.contrib import messages
from .forms import ServiceForm, CategoryForm


# LIST
def serviceList(request):
    services = Service.objects.all()
    q = request.GET.get("q")
    if q:
        services = services.filter(service_name__icontains=q)
    cat = request.GET.get("categoryId")
    if cat:
        services = services.filter(categoryId_id=cat)
    status = request.GET.get("status")
    if status == "active":
        services = services.filter(is_active=True)
    elif status == "inactive":
        services = services.filter(is_active=False)
    price_min = request.GET.get("price_min")
    price_max = request.GET.get("price_max")
    if price_min:
        services = services.filter(price__gte=price_min)
    if price_max:
        services = services.filter(price__lte=price_max)
    order = request.GET.get("order")
    if order in ["id", "-id", "price", "-price", "duration", "-duration"]:
        services = services.order_by(order)
    else:
        services = services.order_by("-id")
    from django.core.paginator import Paginator
    paginator = Paginator(services, 9)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)
    from urllib.parse import urlencode
    params = request.GET.copy()
    if "page" in params:
        params.pop("page")
    qstr = urlencode(params, doseq=True)
    categories = Category.objects.all()
    return render(request, "services1/serviceList.html", {"page_obj": page_obj, "qstr": qstr, "categories": categories})


# CREATE
def serviceCreate(request):
    if request.method == "POST":
        form = ServiceForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Service created successfully.")
            return redirect("service_list")
        messages.error(request, "Please correct the errors below.")
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
            messages.success(request, "Service updated successfully.")
            return redirect("service_list")
        messages.error(request, "Please correct the errors below.")
    else:
        form = ServiceForm(instance=service)

    return render(request, "services1/serviceForm.html", {"form": form})


# DELETE
def serviceDelete(request, id):
    service = get_object_or_404(Service, id=id)
    if request.method == "POST":
        service.delete()
        messages.success(request, "Service deleted.")
        return redirect("service_list")
    return render(request, "services1/serviceConfirmDelete.html", {"service": service})

def createService(request):

    if request.method =="POST":
        form = ServiceForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Service created successfully.")
            return redirect("service_list")
        else:
            messages.error(request, "Please correct the errors below.")
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
            messages.success(request, "Category created.")
            return redirect(f"/services1/create/?categoryId={category.id}")
    else:
        form = CategoryForm()
    return render(request, "services1/categoryForm.html", {"form": form})
