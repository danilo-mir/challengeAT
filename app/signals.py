from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Assets
from django.utils import timezone
from django_celery_beat.models import PeriodicTask, IntervalSchedule
import json


@receiver(post_save, sender=Assets)
def new_asset_verification_task(sender, instance, created, **kwargs):
    if created:

        print(f"signal criado para ativo {instance.ticker}")

        interval, _ = IntervalSchedule.objects.get_or_create(
            every=instance.check_period,
            period=IntervalSchedule.MINUTES,
        )

        PeriodicTask.objects.create(
            interval=interval,
            name=f'Verify asset {instance.ticker}',
            task='app.tasks.price_tunnel_check',
            kwargs=json.dumps({'asset_ticker': instance.ticker}),
            start_time=timezone.now(),
            enabled=True
        )
