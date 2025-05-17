import requests
import logging
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from datetime import datetime

logger = logging.getLogger(__name__)

def send_confirmation_aftership(order):
    delivery = order.deliveries.filter(canceled=False).first()
    if not delivery:
        logger.warning(f"Order {order.id} has no valid delivery to notify AfterShip.")
        return

    tracking_number = delivery.tracking
    carrier_slug = getattr(delivery.carrier, 'slug', None)
    user_email = order.user.email or None
    customer_name = order.user.get_full_name() or order.user.username

    if not tracking_number or not carrier_slug or not user_email:
        logger.warning(f"Missing data to notify AfterShip (Order #{order.id}).")
        return

    headers = {
        "aftership-api-key": settings.AFTERSHIP_API_KEY,
        "Content-Type": "application/json"
    }

    data = {
        "tracking": {
            "slug": carrier_slug,
            "tracking_number": tracking_number,
            "title": f"Order #{order.code}",
            "emails": [user_email],
            "order_id": str(order.id),
            "order_number": order.code,
            "customer_name": customer_name,
        }
    }

    try:
        response = requests.post("https://api.aftership.com/v4/trackings", json=data, headers=headers)
        response.raise_for_status()
        logger.info(f"📦 AfterShip: notification sent successfully for order #{order.code}")

        # Send confirmation email
        tracking_url = f"https://track.aftership.com/{carrier_slug}/{tracking_number}"
        subject = f"Order Confirmation #{order.code}"

        context = {
            "customer_name": customer_name,
            "order_code": order.code,
            "tracking_number": tracking_number,
            "tracking_url": tracking_url,
            "company_name": "Fake Store",
            "current_year": datetime.now().year
        }

        html_message = render_to_string("order_confirmation.html", context)
        plain_message = strip_tags(html_message)

        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_email],
            html_message=html_message,
            fail_silently=False,
        )

        logger.info(f"📧 Confirmation email sent to {user_email}")

    except requests.RequestException as e:
        logger.error(f"❌ AfterShip: failed to notify order #{order.code}: {e}")
    except Exception as e:
        logger.error(f"❌ Failed to send email to {user_email}: {e}")
