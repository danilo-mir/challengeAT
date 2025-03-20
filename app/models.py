from django.db import models
from datetime import datetime

# Create your models here.


class Assets(models.Model):
    user = models.CharField(max_length=100)
    ticker = models.CharField(max_length=6)
    lower_tunnel = models.FloatField()
    upper_tunnel = models.FloatField()
    check_period = models.FloatField()
    last_check = models.DateTimeField(default=datetime.min)

