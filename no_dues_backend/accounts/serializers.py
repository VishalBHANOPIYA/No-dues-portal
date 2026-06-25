from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'role')


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    role = serializers.CharField()

    def validate_role(self, value):
        # Normalize frontend role strings to match model choice keys
        # e.g., "HOD-Admin" -> "hod_admin", "Student" -> "student"
        normalized = value.lower().replace('-', '_').strip()
        valid_roles = [choice[0] for choice in User.ROLE_CHOICES]
        if normalized not in valid_roles:
            raise serializers.ValidationError(f"Invalid role designation. Choose from: {valid_roles}")
        return normalized
