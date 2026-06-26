from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from portal.models import Student, SemesterCycle, Notification

User = get_user_model()

class PortalAPITests(APITestCase):

    def setUp(self):
        # Create a student user and profile
        self.student_user = User.objects.create_user(
            email='student@cdgi.edu.in',
            password='testpassword123',
            role='student',
            name='Test Student'
        )
        self.student = Student.objects.create(
            user=self.student_user,
            enrollment_no='0812CS221001',
            semester='VIII',
            branch='CS'
        )

        # Create a coordinator user
        self.coordinator_user = User.objects.create_user(
            email='coordinator@cdgi.edu.in',
            password='testpassword123',
            role='coordinator',
            name='Test Coordinator'
        )

        # Create a HOD Admin user
        self.admin_user = User.objects.create_user(
            email='hod@cdgi.edu.in',
            password='testpassword123',
            role='hod_admin',
            name='Test HOD'
        )

    def test_admin_config_endpoint(self):
        """Test retrieving the admin cycle config."""
        # Unauthenticated request should fail
        url = reverse('admin-config')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Authenticated request should succeed
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['isCycleOpen'])

    def test_coordinator_students_endpoint(self):
        """Test retrieving coordinator student dues list."""
        url = reverse('coordinator-students')

        # Student user shouldn't be authorized
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Coordinator user should succeed
        self.client.force_authenticate(user=self.coordinator_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['enrollmentNo'], '0812CS221001')


    def test_coordinator_pending_students_endpoint(self):
        """Test retrieving coordinator pending students dues list."""
        # Create a pending due for the student
        from portal.models import Subject, NoDues, Faculty
        faculty_user = User.objects.create_user(
            email='faculty@cdgi.edu.in',
            password='testpassword123',
            role='faculty',
            name='Test Faculty'
        )
        faculty = Faculty.objects.create(user=faculty_user, department='CS')
        subject = Subject.objects.create(
            subject_name='Database Management Systems',
            subject_code='CS-801',
            semester='VIII',
            branch='CS',
            faculty=faculty
        )
        NoDues.objects.create(
            student=self.student,
            subject=subject,
            clearance_status='pending'
        )

        url = reverse('coordinator-pending-students')
        self.client.force_authenticate(user=self.coordinator_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['enrollmentNo'], '0812CS221001')
        self.assertEqual(response.data[0]['status'], 'Pending')

    def test_notifications_endpoint(self):
        """Test notification listing and mark as read."""
        # Create a notification
        notif = Notification.objects.create(
            user=self.student_user,
            message='Test notification message'
        )

        url = reverse('notifications-list')
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['message'], 'Test notification message')
        self.assertFalse(response.data[0]['isRead'])

        # Mark read
        read_url = reverse('notification-mark-read', kwargs={'pk': notif.id})
        response = self.client.patch(read_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify read status
        notif.refresh_from_db()
        self.assertTrue(notif.is_read)
