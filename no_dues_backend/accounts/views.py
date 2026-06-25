from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import LoginSerializer, UserSerializer

User = get_user_model()


class LoginView(APIView):
    """
    POST /api/auth/login
    Accepts: {email, password, role}
    Returns: {access_token, refresh_token, user: {id, name, email, role}}
    """
    permission_classes = ()  # Public endpoint

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        role = serializer.validated_data['role']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Auto-seed for development convenience: create the user if they do not exist yet
            user = User.objects.create_user(
                email=email,
                password=password,
                role=role,
                name=email.split('@')[0].replace('.', ' ').title()
            )

        # Check credentials
        if not user.check_password(password):
            return Response(
                {"detail": "Invalid credentials provided."}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Check role match
        if user.role != role:
            return Response(
                {"detail": f"Access denied. User role mismatch (Account role: {user.get_role_display()})."}, 
                status=status.HTTP_403_FORBIDDEN
            )

        # Generate tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
            "user": UserSerializer(user).data
        }, status=status.HTTP_200_OK)


class TokenRefreshCustomView(APIView):
    """
    POST /api/auth/refresh
    Accepts: {refresh_token}
    Returns: {access_token}
    """
    permission_classes = ()  # Public endpoint

    def post(self, request):
        refresh_token = request.data.get('refresh_token') or request.data.get('refresh')
        if not refresh_token:
            return Response(
                {"detail": "refresh_token field is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            refresh = RefreshToken(refresh_token)
            return Response({
                "access_token": str(refresh.access_token)
            }, status=status.HTTP_200_OK)
        except Exception:
            return Response(
                {"detail": "Invalid or expired refresh token."}, 
                status=status.HTTP_401_UNAUTHORIZED
            )


class UserProfileView(APIView):
    """
    GET /api/auth/me
    Returns current user details (JWT-protected)
    """
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
