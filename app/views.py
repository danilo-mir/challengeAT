import os
import json
from dotenv import load_dotenv
import requests
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from .models import Assets

# Create your views here.

load_dotenv()
brapi_key = os.getenv('BRAPI_KEY')


def login(request):

    # Saves email to session
    if request.method == 'POST':
        email = request.POST.get("email")
        if email:
            request.session["user_email"] = email
            request.session.modified = True
            return redirect("/home")

    return render(request, 'login.html')


def home(request):
    # Gets user email
    user_email = request.session.get("user_email")
    if not user_email:
        return redirect("login")

    # Gets assets info from BRAPI
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

        # Gets user assets from database
        user_assets = Assets.objects.filter(user=user_email).values(
            'ticker', 'lower_tunnel', 'upper_tunnel', 'check_period'
        )
        assets_list = [
            {
                'id': asset['ticker'],
                'name': asset['ticker'],
                'upperTunnel': str(asset['upper_tunnel']),
                'lowerTunnel': str(asset['lower_tunnel']),
                'checkPeriod': str(asset['check_period'])
            }
            for asset in user_assets
        ]

        return render(request, "home.html", {
            "items": items,
            "user_assets": assets_list
        })

    raise Exception(f"API request error: {response.status_code}")


@csrf_exempt
def save_assets(request):
    if request.method == 'POST':
        user_email = request.session["user_email"]
        if not user_email:
            return JsonResponse({"error": "User not logged in"}, status=401)

        try:
            data = json.loads(request.body)
            assets = data.get('assets', [])

            Assets.objects.filter(user=user_email).delete()

            for asset in assets:
                upper_tunnel = float(asset.get('upperTunnel', 0)) if asset.get('upperTunnel') else 0
                lower_tunnel = float(asset.get('lowerTunnel', 0)) if asset.get('lowerTunnel') else 0
                check_period = float(asset.get('checkPeriod', 0)) if asset.get('checkPeriod') else 0

                Assets.objects.create(
                    user=user_email,
                    ticker=asset['id'],
                    upper_tunnel=upper_tunnel,
                    lower_tunnel=lower_tunnel,
                    check_period=check_period,
                    last_check=datetime.min
                )

            return JsonResponse({"success": True})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)


