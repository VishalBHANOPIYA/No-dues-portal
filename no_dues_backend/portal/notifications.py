"""
Notification helpers.
send_notification() creates an in-app notification and fires the async
Celery email task (best-effort — if Celery / Redis are not running, the
notification is still saved in the DB).
"""
from portal.models import Notification


def send_notification(user, message):
    """Create an in-app notification and attempt to send an async email."""
    Notification.objects.create(user=user, message=message)

    # Fire Celery email task (best-effort)
    try:
        from portal.tasks import send_email_notification
        send_email_notification.delay(user.id, 'No-Dues Portal Notification', message)
    except Exception:
        # Celery or Redis not available — silently continue
        pass
