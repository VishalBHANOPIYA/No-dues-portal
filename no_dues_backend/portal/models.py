from django.db import models
from django.conf import settings


class Faculty(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='faculty_profile'
    )
    department = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = 'Faculties'

    def __str__(self):
        return f"{self.user.name or self.user.email} - {self.department}"


class Student(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='student_profile'
    )
    enrollment_no = models.CharField(max_length=50, unique=True)
    semester = models.CharField(max_length=50)
    branch = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.enrollment_no} - {self.user.name or self.user.email}"


class Subject(models.Model):
    subject_code = models.CharField(max_length=50, unique=True)
    subject_name = models.CharField(max_length=150)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='subjects')
    semester = models.CharField(max_length=50)
    branch = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.subject_code} - {self.subject_name}"


class Assignment(models.Model):
    TASK_TYPE_CHOICES = (
        ('lab_manual', 'Lab Manual'),
        ('assignment', 'Assignment'),
        ('case_study', 'Case Study'),
        ('mini_project', 'Mini Project'),
        ('certificate', 'Certificate'),
    )
    title = models.CharField(max_length=200)
    task_type = models.CharField(max_length=50, choices=TASK_TYPE_CHOICES)
    deadline = models.DateTimeField()
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='assignments')
    description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Submission(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('resubmit', 'Resubmit'),
    )
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='submissions')
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    file_url = models.URLField(max_length=500)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    remarks = models.TextField(blank=True, default='')
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Submission by {self.student.enrollment_no} for {self.assignment.title}"


class NoDues(models.Model):
    CLEARANCE_STATUS_CHOICES = (
        ('cleared', 'Cleared'),
        ('pending', 'Pending'),
    )
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='no_dues')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='no_dues')
    clearance_status = models.CharField(max_length=20, choices=CLEARANCE_STATUS_CHOICES, default='pending')
    approved_by = models.ForeignKey(
        Faculty, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_no_dues'
    )
    approved_date = models.DateTimeField(null=True, blank=True)
    # Coordinator clearance (separate from faculty subject clearance)
    coordinator_cleared = models.BooleanField(default=False)

    class Meta:
        unique_together = ('student', 'subject')
        verbose_name_plural = 'No Dues'

    def __str__(self):
        return f"{self.student.enrollment_no} - {self.subject.subject_code} ({self.clearance_status})"


class SemesterCycle(models.Model):
    """Tracks whether the No-Dues cycle is open or closed for a given semester."""
    semester = models.CharField(max_length=50)
    is_open = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('semester',)

    def __str__(self):
        status = 'Open' if self.is_open else 'Closed'
        return f"Semester {self.semester} — {status}"


class Notification(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications'
    )
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{'Read' if self.is_read else 'Unread'}] {self.message[:60]}"
