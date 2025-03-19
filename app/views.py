import os

from dotenv import load_dotenv
import requests
from django.shortcuts import render, redirect

# Create your views here.

load_dotenv()
brapi_key = os.getenv('BRAPI_KEY')


def login(request):
    if request.method == 'POST':
        email = request.POST['email']

        request.session["user_email"] = email

        return redirect("/home")

    return render(request, 'login.html')


def home(request):
    url = "https://brapi.dev/api/quote/list"
    params = {
        'type': 'stock',
        'token': brapi_key
    }

    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        items = []
        for stock in data['stocks']:
            items.append({"id": stock['stock'], "name": stock['stock']})
        return render(request, "home.html", {"items": items})

    raise Exception(f"API request error: {response.status_code}")


