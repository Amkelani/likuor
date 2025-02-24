"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from likour import views

router = routers.DefaultRouter()
router.register(r'products', views.ProductViewSet)
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'slides', views.CarouselViewSet)
router.register(r'auth/login', views.AuthViewSet, basename='login')
router.register(r'auth/signup', views.RegisterViewSet, basename='signup')
router.register(r'auth/email/verify', views.VerifyEmailViewSet, basename='emailVerify')
router.register(r'auth/user/details', views.UserViewSet, basename='userDetails')
router.register(r'auth/user/update', views.UserUpdateViewSet, basename='userUpdate')
router.register(r'order/create', views.OrdersCreateViewSet, basename='orderCreate')
router.register(r'orders', views.OrdersViewSet, basename='orders')
router.register(r'', views.IndexViewSet, basename='index')
urlpatterns = [
    path('', include(router.urls)),
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/test-token', views.TestTokenView.as_view()),
]
