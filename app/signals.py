from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Assets
from django.utils import timezone
from django_celery_beat.models import PeriodicTask, IntervalSchedule
import json


@receiver(post_save, sender=Assets)
def new_asset_verification_task(sender, instance, created, **kwargs):
    if created:

        task_name = "_".join((str(instance.user), str(instance.ticker)))

        interval, _ = IntervalSchedule.objects.get_or_create(
            every=instance.check_period,
            period=IntervalSchedule.MINUTES,
        )

        PeriodicTask.objects.create(
            interval=interval,
            name=task_name,
            task="app.tasks.price_tunnel_check",
            kwargs=json.dumps({"asset_ticker": instance.ticker}),
            start_time=timezone.now(),
            enabled=True
        )

        print(f"[Info] Created task {task_name}")


@receiver(post_delete, sender=Assets)
def delete_asset_verification_task(sender, instance, **kwargs):
    task_name = "_".join((str(instance.user), str(instance.ticker)))
    task = PeriodicTask.objects.filter(name=task_name)
    if task.exists():
        task.delete()
        print(f"[Info] Deleted task {task_name}")
    else:
        print(f"[Info] Failed to delete task {task_name}: task already doesn't exist")
