import calendar
import logging
from collections import defaultdict
from decimal import Decimal

from django.db.models import Count, Sum, F
from django.db.models.functions import TruncHour, TruncWeek, TruncMonth
from django.utils.timezone import now

from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.permissions import SAFE_METHODS, BasePermission
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response

from .models import Order, OrderDelivery, OrderShipping, OrderPayment, OrderItem
from .serializers import (
    OrderSerializer,
    OrderDeliverySerializer,
    OrderShippingSerializer,
    OrderPaymentSerializer
)

logger = logging.getLogger(__name__)

class MixedPermission(BasePermission):
    """
    Permite acesso irrestrito a métodos seguros (GET, HEAD, OPTIONS),
    e exige privilégios de administrador para métodos de escrita (POST, PUT, DELETE, PATCH).
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-id')
    serializer_class = OrderSerializer
    permission_classes = [MixedPermission]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class OrderDetailView(RetrieveAPIView):
    """
    Visualização de detalhe de um único pedido (por ID).
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [MixedPermission]
    lookup_field = 'id'

class OrderDeliveryViewSet(viewsets.ModelViewSet):
    serializer_class = OrderDeliverySerializer
    permission_classes = [MixedPermission]

    def get_queryset(self):
        queryset = OrderDelivery.objects.filter(canceled=False)
        order_id = self.request.query_params.get('order')
        if order_id:
            queryset = queryset.filter(order_id=order_id)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            logger.warning("❌ OrderDelivery serializer errors: %s", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        instance = serializer.save()  # lógica customizada do modelo (gera tracking/speed)
        instance.save()  # reforça execução do método save()

        response_serializer = self.get_serializer(instance)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if not serializer.is_valid():
            logger.warning("❌ OrderDelivery partial update errors: %s", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        instance = serializer.save()
        logger.info("✅ OrderDelivery updated: %s", instance.id)

        return Response(self.get_serializer(instance).data)
    
class OrderShippingViewSet(viewsets.ModelViewSet):
    serializer_class = OrderShippingSerializer
    permission_classes = [MixedPermission]

    def get_queryset(self):
        queryset = OrderShipping.objects.filter(canceled=False)
        order_id = self.request.query_params.get('order')
        if order_id:
            queryset = queryset.filter(order_id=order_id)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            logger.warning("❌ OrderDelivery serializer errors: %s", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        instance = serializer.save()  # lógica customizada do modelo (gera tracking/speed)
        instance.save()  # reforça execução do método save()

        response_serializer = self.get_serializer(instance)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if not serializer.is_valid():
            logger.warning("❌ OrderDelivery partial update errors: %s", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        instance = serializer.save()
        logger.info("✅ OrderDelivery updated: %s", instance.id)

        return Response(self.get_serializer(instance).data)
    

class OrderPaymentViewSet(viewsets.ModelViewSet):
    serializer_class = OrderPaymentSerializer
    permission_classes = [MixedPermission]

    def get_queryset(self):
        queryset = OrderPayment.objects.filter(canceled=False)
        order_id = self.request.query_params.get('order')
        if order_id:
            queryset = queryset.filter(order_id=order_id)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            logger.warning("❌ OrderPayment serializer errors: %s", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        instance = serializer.save()  # lógica customizada do modelo (gera tracking/speed)
        instance.save()  # reforça execução do método save()

        response_serializer = self.get_serializer(instance)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if not serializer.is_valid():
            logger.warning("❌ OrderPayment partial update errors: %s", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        instance = serializer.save()
        logger.info("✅ OrderPayment updated: %s", instance.id)

        return Response(self.get_serializer(instance).data)
    
# Dashboard
class TotalEarningView(APIView):
    """
    Retorna o total arrecadado com pedidos finalizados (status='completed'),
    aplicando desconto de 10% sobre o sub_total de cada order.
    """
    permission_classes = [MixedPermission]

    def get(self, request):
        try:
            orders = Order.objects.filter(status='completed')
            total_subtotal = sum((order.sub_total for order in orders), Decimal('0.00'))
            total_discount = total_subtotal * Decimal('0.10')
            total_earning = total_subtotal - total_discount

            logger.info(f"📊 Subtotal bruto: R$ {total_subtotal} | Desconto: R$ {total_discount} | Total líquido: R$ {total_earning}")
            return Response(
                {
                    "subtotal": round(total_subtotal, 2),
                    "discount_10_percent": round(total_discount, 2),
                    "total_earning": round(total_earning, 2)
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            logger.error(f"❌ Error calculating total earning: {e}")
            return Response({"error": "Failed to calculate total earning."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OrderTotalByPeriodView(APIView):
    """
    Retorna o valor total das ordens (.total), com filtro opcional por período:
    - ?period=month → ordens do mês atual
    - ?period=year  → ordens do ano atual
    - (sem ?period) → todas as ordens
    """
    permission_classes = [MixedPermission]

    def get(self, request):
        try:
            today = now()
            period = request.query_params.get('period', 'all').lower()

            orders = Order.objects.all()

            if period == 'month':
                orders = orders.filter(
                    created_at__year=today.year,
                    created_at__month=today.month
                )
            elif period == 'year':
                orders = orders.filter(created_at__year=today.year)

            total = sum((order.total for order in orders), Decimal('0.00'))

            logger.info(f"📦 Total de ordens para período '{period}': R$ {total}")
            return Response({
                "total_order_amount": round(total, 2),
                "period": period
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception("❌ Erro ao calcular total das ordens")
            return Response({"error": "Erro ao calcular total das ordens."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)     

class TotalIncomeView(APIView):
    """
    Returns the total income breakdown:
    - gross = sum of sub_totals
    - discount = 10% fixed on gross
    - net = gross - discount
    - average income per order
    """
    permission_classes = [MixedPermission]

    def get(self, request):
        try:
            period = request.query_params.get('period', 'all').lower()
            today = now()

            orders = Order.objects.filter(status='completed')

            if period == 'month':
                orders = orders.filter(created_at__year=today.year, created_at__month=today.month)
            elif period == 'year':
                orders = orders.filter(created_at__year=today.year)

            total_orders = orders.count()

            gross_income = sum((order.sub_total for order in orders), Decimal('0.00'))
            total_discounts = gross_income * Decimal('0.10')  # 🔁 fixo 10%
            net_income = gross_income - total_discounts
            average_order_income = net_income / total_orders if total_orders > 0 else Decimal('0.00')

            result = {
                "gross_income": round(gross_income, 2),
                "total_discounts": round(total_discounts, 2),
                "net_income": round(net_income, 2),
                "average_order_income": round(average_order_income, 2),
                "total_orders": total_orders,
                "period": period
            }

            logger.info(f"📊 Income breakdown ({period}): {result}")
            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception("❌ Error calculating income breakdown")
            return Response({"error": "Error calculating income breakdown"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class TotalOrdersByStatusView(APIView):
    """
    Returns total number of orders grouped by status.
    """
    permission_classes = [MixedPermission]

    def get(self, request):
        try:
            queryset = Order.objects.values('status').annotate(count=Count('id'))
            result = {entry['status']: entry['count'] for entry in queryset}

            # Assegura todos os status mesmo que nenhum tenha count
            for s, _ in Order.STATUS_CHOICES:
                result.setdefault(s, 0)

            logger.info(f"📊 Orders by status: {result}")
            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception("❌ Error fetching orders by status")
            return Response({"error": "Error fetching order status totals."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  
        
class OrderStatusGrowthView(APIView):
    """
    Retorna crescimento de orders por status agrupado por hora/semana/mês.
    Endpoint para gráfico de barras empilhado por status.
    """
    permission_classes = [MixedPermission]

    def get(self, request):
        try:
            period = request.query_params.get('period', 'month').lower()
            today = now()
            queryset = Order.objects.all()

            if period == 'today':
                queryset = queryset.filter(created_at__date=today.date())
                trunc_fn = TruncHour('created_at')
            elif period == 'month':
                queryset = queryset.filter(created_at__year=today.year, created_at__month=today.month)
                trunc_fn = TruncWeek('created_at')
            else:
                queryset = queryset.filter(created_at__year=today.year)
                trunc_fn = TruncMonth('created_at')

            annotated = queryset.annotate(group=trunc_fn).values('group', 'status').annotate(count=Count('id')).order_by('group')

            group_keys = []
            status_map = defaultdict(lambda: defaultdict(int))  # {status: {group: count}}

            for entry in annotated:
                group = entry['group']
                order_status = entry['status']
                count = entry['count']
                group_keys.append(group)
                status_map[order_status][group] = count

            group_keys = sorted(set(group_keys))

            categories = []
            for g in group_keys:
                if period == 'today':
                    label = g.strftime('%Hh')
                elif period == 'month':
                    week = g.isocalendar()[1] - today.isocalendar()[1] + 1
                    label = f"Week {week if week > 0 else 1}"
                else:
                    label = calendar.month_abbr[g.month]
                categories.append(label)

            series = []
            for order_status, group_data in status_map.items():
                data = [group_data.get(g, 0) for g in group_keys]
                series.append({"name": order_status, "data": data})

            return Response({
                "categories": categories,
                "series": series
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception("❌ Failed to generate OrderStatusGrowthView")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)