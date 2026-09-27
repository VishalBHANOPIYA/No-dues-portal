from rest_framework import serializers
from django.contrib.auth import get_user_model
from portal.models import (
    Student, Faculty, Subject, Assignment, Submission,
    NoDues, SemesterCycle, Notification,
)

User = get_user_model()


class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'role')


class FacultySerializer(serializers.ModelSerializer):
    user = UserMiniSerializer(read_only=True)

    class Meta:
        model = Faculty
        fields = ('id', 'user', 'department')


class FacultyWriteSerializer(serializers.Serializer):
    """Used by HOD/Admin to add a faculty record."""
    email = serializers.EmailField()
    name = serializers.CharField(max_length=255)
    password = serializers.CharField(write_only=True, required=False, default='password123')
    department = serializers.CharField(max_length=100)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True, default='')
    subject_name = serializers.CharField(max_length=150, required=False, allow_blank=True, default='')
    semester = serializers.CharField(max_length=50, required=False, allow_blank=True, default='VIII')


class StudentSerializer(serializers.ModelSerializer):
    user = UserMiniSerializer(read_only=True)

    class Meta:
        model = Student
        fields = ('id', 'user', 'enrollment_no', 'semester', 'branch')


class SubjectSerializer(serializers.ModelSerializer):
    faculty_detail = FacultySerializer(source='faculty', read_only=True)

    class Meta:
        model = Subject
        fields = (
            'id', 'subject_code', 'subject_name',
            'faculty', 'faculty_detail', 'semester', 'branch',
        )


class AssignmentSerializer(serializers.ModelSerializer):
    subject_detail = SubjectSerializer(source='subject', read_only=True)

    class Meta:
        model = Assignment
        fields = (
            'id', 'title', 'task_type', 'deadline',
            'subject', 'subject_detail', 'description', 'created_at',
        )


class SubmissionSerializer(serializers.ModelSerializer):
    student_detail = StudentSerializer(source='student', read_only=True)
    assignment_detail = AssignmentSerializer(source='assignment', read_only=True)

    class Meta:
        model = Submission
        fields = (
            'id', 'student', 'student_detail',
            'assignment', 'assignment_detail',
            'file_url', 'status', 'remarks',
            'submitted_at', 'reviewed_at',
        )
        read_only_fields = ('student', 'submitted_at', 'reviewed_at', 'file_url')


class NoDuesSerializer(serializers.ModelSerializer):
    student_detail = StudentSerializer(source='student', read_only=True)
    subject_detail = SubjectSerializer(source='subject', read_only=True)
    approved_by_detail = FacultySerializer(source='approved_by', read_only=True)

    class Meta:
        model = NoDues
        fields = (
            'id', 'student', 'student_detail',
            'subject', 'subject_detail',
            'clearance_status', 'coordinator_cleared',
            'approved_by', 'approved_by_detail', 'approved_date',
        )


class StudentDueSummarySerializer(serializers.Serializer):
    """Coordinator class-report per-student summary."""
    student_id = serializers.IntegerField()
    enrollment_no = serializers.CharField()
    student_name = serializers.CharField()
    semester = serializers.CharField()
    branch = serializers.CharField()
    total_dues = serializers.IntegerField()
    cleared_dues = serializers.IntegerField()
    pending_dues = serializers.IntegerField()


class SubjectReportSerializer(serializers.Serializer):
    """HOD report: per-subject clearance counts."""
    subject_id = serializers.IntegerField()
    subject_code = serializers.CharField()
    subject_name = serializers.CharField()
    faculty_name = serializers.CharField()
    cleared_count = serializers.IntegerField()
    pending_count = serializers.IntegerField()


class SemesterToggleSerializer(serializers.Serializer):
    semester = serializers.CharField()
    is_open = serializers.BooleanField()


class SubjectAllocateSerializer(serializers.Serializer):
    subject_id = serializers.IntegerField()
    faculty_id = serializers.IntegerField()


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ('id', 'user', 'message', 'is_read', 'created_at')
        read_only_fields = ('user', 'message', 'created_at')
