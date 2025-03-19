import os

from dotenv import load_dotenv
import requests
from django.shortcuts import render

# Create your views here.

load_dotenv()
brapi_key = os.getenv('BRAPI_KEY')


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
        return render(request, "base.html", {"items": items})

    raise Exception(f"API request error: {response.status_code}")


