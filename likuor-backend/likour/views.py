from django.contrib.auth.models import User
from rest_framework_simplejwt.authentication import JWTAuthentication
from backend.config import aws_email_sender
from backend.helper import *
from . import models
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Count
from rest_framework import permissions, viewsets
from django.contrib.auth import authenticate
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status
from .serializers import ProductSerializer, CategorySerializer, CarouselSerializer
from datetime import datetime, timedelta
from django.shortcuts import render
import pytz
import random
import string
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import AccessToken

sa_timezone = pytz.timezone('Africa/Johannesburg')

class TestTokenView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                validated_token = AccessToken(token)
                return Response({"user_id": validated_token['user_id']})
            except Exception as e:
                return Response({"error": str(e)}, status=401)
        return Response({"error": "No Bearer token"}, status=401)

class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = models.Product.objects.all().order_by('name')
    serializer_class = ProductSerializer

    def list(self, request, *args, **kwargs):
        print("Request headers:", request.headers)
        print("Authenticated user:", request.user)
        return super().list(request, *args, **kwargs)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Categories to be viewed or edited.
    """
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    serializer_class = CategorySerializer

    def get_queryset(self):
        return models.Category.objects.annotate(product_count=Count('product')).filter(product_count__gt=0).order_by(
            'name')


class CarouselViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Carousels to be viewed or edited
    """
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    queryset = models.Carousel.objects.all()
    serializer_class = CarouselSerializer


class AuthViewSet(ViewSet):
    """
    API endpoint to log a user in
    """
    permission_classes = [permissions.AllowAny]

    @staticmethod
    def create(request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.profile.email_confirmed:
                refresh = RefreshToken.for_user(user)
                return Response(
                    {'success': 'Authenticated Successfully.',
                     'user': username,
                     'address': user.profile.address,
                     'access': str(refresh.access_token),
                     'refresh': str(refresh)},
                    status=status.HTTP_200_OK)
            else:
                return Response({'error': 'User not verified'},
                                status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Invalid credentials.'}, status=status.HTTP_400_BAD_REQUEST)


class RegisterViewSet(ViewSet):
    """
    API endpoint to create users
    """
    permission_classes = [permissions.AllowAny]

    @staticmethod
    def create(request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        phone_number = request.data.get('phone_number')
        forgot_password = request.data.get('forgot_password')
        if forgot_password:
            if not User.objects.filter(username=username).exists():
                return Response({'error': f'Username: {username} does not  exists'}, status=status.HTTP_400_BAD_REQUEST)
            user = User.objects.get(username=username)
        else:
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create_user(username=username, password=password, email=email)
            user.profile.phone_number = phone_number
            user.profile.save()
        otp_code = random.randint(1000, 9999)
        otp = models.OTP(
            code=otp_code,
            user_id=user.id
        )
        otp.save()
        html = email_verification_html(otp_code)
        try:
            send_email(body_html=html, email_subject="[Likour] - Please verify your email address", recipient=username,
                       sender=aws_email_sender)
        except Exception as e:
            print(f"Failed to send an email to: {username}. Error: {e}")
            return Response({'error': f'We could not send an email to {username}'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'success': 'User registered successfully'}, status=status.HTTP_201_CREATED)


class VerifyEmailViewSet(ViewSet):
    """
    API endpoint to verify email address
    """
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    @staticmethod
    def create(request):
        username = request.data.get('username')
        code = request.data.get('code')
        user = User.objects.get(username=username)
        if not user:
            return Response({'error': 'Username does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        try:
            otp = models.OTP.objects.get(user_id=user.id)
            otp_code = otp.code
            otp_expiry = datetime.now(sa_timezone) - otp.created_at.astimezone(sa_timezone)
            print(otp_expiry)
            if otp_expiry > timedelta(minutes=10):
                otp.delete()
                return Response({'error': 'Invalid code provided.'}, status=status.HTTP_400_BAD_REQUEST)
            if str(otp_code).strip() == str(code).strip():
                user.profile.email_confirmed = True
                user.profile.save()
                otp.delete()
                return Response({'success': 'Email address verified successfully.'}, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid code provided.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"An error occurred when verifying. Error: {e}")
            return Response({'error': 'Invalid code provided.'}, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(ViewSet):
    """
    API endpoint to get user
    """
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    @staticmethod
    def create(request):
        username = request.data.get('username')
        user = User.objects.get(username=username)
        if not user:
            return Response({'error': 'Username does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        phone_number = user.profile.phone_number
        address = user.profile.address
        return Response({'success': 'Successfully got user details', 'phone_number': phone_number, 'address': address},
                        status=status.HTTP_200_OK)


class OrdersCreateViewSet(ViewSet):
    """
    API endpoint to add orders to database
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    @staticmethod
    def create(request):
        username = request.data.get('username')
        discount = request.data.get('discount')
        total = request.data.get('total')
        address = request.data.get('address')
        order_status = "Order Confirmed"
        current_date = datetime.now()
        time = current_date.strftime("%H:%M:%S.%f")
        order_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        user = User.objects.get(username=username)
        products = request.data.get('products')
        if not user:
            return Response({'error': 'Username does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            try:
                new_order = models.Order(
                    user_id=user.id,
                    date=current_date,
                    time=time,
                    total=total,
                    status=order_status,
                    discount=discount,
                    delivery_address=address,
                    order_id=order_id
                )
                new_order.save()
                for product in products:
                    product_obj = models.Product.objects.get(id=int(product["id"]))
                    new_order_products = models.OrderProducts(
                        order_id=new_order,
                        product_id=product_obj,
                        quantity=product["quantity"]
                    )
                    new_order_products.save()
                return Response({'success': 'Successfully added order'}, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
class OrdersViewSet(ViewSet):
    """
    API endpoint to get orders
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    @staticmethod
    def create(request):
        print(request)
        username = request.data.get('username')
        user = User.objects.get(username=username)
        if not user:
            return Response({'error': 'Username does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            try:
                orders_list = []
                orders = models.Order.objects.filter(user=user).order_by('-id')
                for order in orders:
                    order_products = models.OrderProducts.objects.filter(order_id=order.id)
                    products = []
                    for order_product in order_products:
                        quantity = order_product.quantity
                        product_obj = models.Product.objects.get(id=order_product.product_id.id)
                        products.append({
                            "id": product_obj.id,
                            "name": product_obj.name,
                            "quantity": quantity,
                            "price": product_obj.price
                        })
                    order_obj = {
                        "id": order.id,
                        "order_id": order.order_id,
                        "date": order.date.strftime("%b %d, %Y"),
                        "time": order.time.strftime("%H:%M %p").lower(),
                        "total": order.total,
                        "status": order.status,
                        "delivery": "30",
                        "discount": order.discount,
                        "products": products
                    }
                    orders_list.append(order_obj)
                return Response(orders_list, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)


class UserUpdateViewSet(ViewSet):
    """
    API endpoint to get user
    """
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]


    @staticmethod
    def create(request):
        username = request.data.get('username')
        phone_number = request.data.get('phone_number')
        password = request.data.get('password')
        address = request.data.get('address')
        user = User.objects.get(username=username)
        if not user:
            return Response({'error': 'Username does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        if password:
            user.set_password(password)
            user.save()
            return Response({'success': 'Successfully updated password'}, status=status.HTTP_200_OK)
        else:
            user.profile.phone_number = phone_number
            user.profile.address = address
            user.profile.save()
            return Response({'success': 'Successfully updated user'}, status=status.HTTP_200_OK)


class IndexViewSet(ViewSet):
    permission_classes = [permissions.AllowAny]

    @staticmethod
    def list(request):
        return render(request, 'index.html')
