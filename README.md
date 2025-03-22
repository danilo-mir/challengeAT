# INOA Challenge - Asset Monitoring

This application allows users to select assets from the Brazilian
stock exchange (B3) to monitor based on a price tunnel determined by
the user. Emails are sent to the user with buy or sell alerts for the
configured assets according to the chosen parameters.

## Technologies
- Frontend: HTML, CSS and vanilla Javascript
- Backend: Django
- Asynchronous tasks: Celery
- Database: SQLite

## Run
```bash
git clone https://github.com/danilo-mir/challengeAT.git

cd challengeAT

docker-compose up
```