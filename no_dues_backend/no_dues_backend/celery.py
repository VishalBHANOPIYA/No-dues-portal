import os
from celery import Celery

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'no_dues_backend.settings')

app = Celery('no_dues_backend')

# Load configuration from Django settings, using the CELERY namespace.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Autodiscover tasks from all registered Django apps.
app.autodiscover_tasks()
