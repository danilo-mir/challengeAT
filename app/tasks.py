import os
import requests
from dotenv import load_dotenv
from app.models import Assets
from celery import shared_task
from app.utils import send_email


@shared_task
def price_tunnel_check(asset_ticker):
    try:
        load_dotenv()

        email_sender_account = str(os.getenv("EMAIL_ACCOUNT"))
        email_sender_password = str(os.getenv("EMAIL_PASSWORD"))

        asset = Assets.objects.get(ticker=asset_ticker)
        user = asset.user
        ticker = asset.ticker
        lower_tunnel = asset.lower_tunnel
        upper_tunnel = asset.upper_tunnel

        brapi_key = os.getenv("BRAPI_KEY")
        url = f"https://brapi.dev/api/quote/{ticker}?token={brapi_key}"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            asset_data = data.get("results")

            if asset_data:
                asset_price = asset_data[0].get("regularMarketPrice")

                if asset_price <= lower_tunnel:
                    email_subject = f"Aviso de compra de {ticker}"
                    email_body = f"""
                    O preço do ativo {ticker} atualmente é de {asset_price}, que está abaixo do valor de túnel inferior
                    configurado, que é de {lower_tunnel}. Portanto, sugere-se a compra do ativo.
                    """
                    send_email(
                        sender=email_sender_account,
                        password=email_sender_password,
                        recipient=user,
                        subject=email_subject,
                        body=email_body
                    )

                if asset_price >= upper_tunnel:
                    email_subject = f"Aviso de venda de {ticker}"
                    email_body = f"""
                    O preço do ativo {ticker} atualmente é de {asset_price}, que está acima do valor de túnel superior
                    configurado, que é de {upper_tunnel}. Portanto, sugere-se a venda do ativo.
                    """
                    send_email(
                        sender=email_sender_account,
                        password=email_sender_password,
                        recipient=user,
                        subject=email_subject,
                        body=email_body
                    )

    except Exception as e:
        print(f"Error trying to verify asset {asset_ticker}: {e}")
