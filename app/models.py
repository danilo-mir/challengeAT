from django.db import models

# Create your models here.


class Assets(models.Model):
    user = models.CharField(max_length=100)
    ticker = models.CharField(max_length=6)
    lower_tunnel = models.FloatField()
    upper_tunnel = models.FloatField()
    check_period = models.FloatField()

