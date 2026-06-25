from django.urls import path
from .views import LoginView, TokenRefreshCustomView, UserProfileView

urlpatterns = [
    path('login', LoginView.as_view(), name='auth_login'),
    path('refresh', TokenRefreshCustomView.as_view(), name='auth_refresh'),
    path('me', UserProfileView.as_view(), name='auth_me'),
]
