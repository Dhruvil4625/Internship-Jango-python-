from django.http import HttpResponse
from django.shortcuts import render

# def home(request):
#    return HttpResponse("Hello Django")

def home(request):
    return render(request, "home.html")

def aboutus(request):
    return render(request, "aboutus.html") 

def conatactus(request):
    return render(request, "contactus.html")

def movies(request):
    return render(request, "movies.html")

def shows(request):
    return render(request, "shows.html")

def news(request):
    return render(request, "news.html")

def recape(request):
    return render(request,"recape.html")

from django.shortcuts import render

def recipe(request):
    ingredients = ["Masala", "Tomato"]

    data = {
        "Name": "Maggi",
        "Time": 2,
        "Ingredients": ingredients
    }

    return render(request, "recipe.html", data)

def team(request):
    squadmember = ["Rhohit sharma","Suryakumar Yadav","Tilak Verma","Quinton DE Kock","Hardik Pandya","Michell santer","will jacks","Trent Boult","Depak Chahar","Jasprit Bumrah","Shardul Thakur","Naman Dhir"]
    data = {
        "Name" : "Mumbai Indians",
        "Trophy" : 5,
        "squadmember" : squadmember

    }
    return render(request, "team.html",data)

def python_library(request):
    
    libraries = [
        "NumPy",
        "Pandas",
        "Matplotlib",
        "Seaborn",
        "Scikit-learn",
        "TensorFlow",
        "Keras",
        "PyTorch",
        "OpenCV",
        "NLTK",
    ]

    context = {
        "Name": "AI/ML Python Toolkit",
        "Focus": "Building Intelligent Systems",
        "LibraryCount": len(libraries),
        "Libraries": libraries,
    }

    return render(request, "ailibrary.html", context)