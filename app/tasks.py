import os
import requests
from dotenv import load_dotenv
from app.models import Assets
from celery import shared_task

load_dotenv()
brapi_key = os.getenv("BRAPI_KEY")


@shared_task
def price_tunnel_check(asset_ticker):
    try:
        asset = Assets.objects.get(ticker=asset_ticker)
        ticker = asset.ticker
        lower_tunnel = asset.lower_tunnel
        print(lower_tunnel)
        upper_tunnel = asset.upper_tunnel
        print(upper_tunnel)

        url = f"https://brapi.dev/api/quote/{ticker}?token={brapi_key}"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            asset_data = data.get("results")

            if asset_data:
                asset_price = asset_data[0].get("regularMarketPrice")
                print(asset_price)

                if asset_price < lower_tunnel:
                    print("Abaixo do tunel")
                # TODO: send buy email

                if asset_price > upper_tunnel:
                    print("Acima do tunel")
                # TODO: send sell email

    except Exception as e:
        print(f"Error trying to verify asset {asset_ticker}: {e}")
