from celery import shared_task
from django.contrib.auth import get_user_model
from django.core.mail import send_mail

User = get_user_model()

@shared_task
def send_email_notification(user_id, subject, message):
    try:
        user = User.objects.get(id=user_id)
        if user.email:
            send_mail(
                subject=subject,
                message=message,
                from_email=None,  # Uses DEFAULT_FROM_EMAIL from settings
                recipient_list=[user.email],
                fail_silently=False,
            )
            return f"Email sent to {user.email}"
    except User.DoesNotExist:
        return f"User with ID {user_id} not found"
    except Exception as e:
        return f"Error sending email: {str(e)}"
