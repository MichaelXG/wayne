from django.http import JsonResponse
from django.db import connection
import os


def health_check(request):
    health_status = {
        "status": "ok",
        "environment": os.getenv("ENV", "unknown"),
        "backend_url": os.getenv("BACKEND_URL", "unknown")
    }

    # ✅ Testa conexão com o banco de dados
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        health_status["database"] = "connected"
    except Exception as e:
        health_status["database"] = f"error: {str(e)}"
        health_status["status"] = "error"

    # ✅ Adiciona info opcional sobre o serviço
    health_status["service"] = os.getenv("SERVICE_NAME", "django-backend")

    return JsonResponse(health_status, status=200 if health_status["status"] == "ok" else 500)
