import os
import django
from django.utils import timezone
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'no_dues_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from portal.models import Student, Faculty, Subject, Assignment, Submission, NoDues, SemesterCycle, Notification

User = get_user_model()

def seed():
    print("Seeding CDGI Portal Database...")

    # 1. Semester Cycle
    SemesterCycle.objects.get_or_create(semester='VIII', defaults={'is_open': True})

    # 2. HOD / Admin User
    hod_user, _ = User.objects.get_or_create(
        email='hod@cdgi.edu.in',
        defaults={
            'name': 'Dr. Amit Mukherjee',
            'role': 'hod_admin',
            'is_staff': True,
            'is_superuser': True,
        }
    )
    hod_user.set_password('password123')
    hod_user.save()

    # 3. Coordinator User
    coord_user, _ = User.objects.get_or_create(
        email='coordinator@cdgi.edu.in',
        defaults={
            'name': 'Prof. Sunita Patel',
            'role': 'coordinator',
        }
    )
    coord_user.set_password('password123')
    coord_user.save()

    # 4. Faculty Users
    faculty_user1, _ = User.objects.get_or_create(
        email='faculty@cdgi.edu.in',
        defaults={
            'name': 'Dr. Rajesh Verma',
            'role': 'faculty',
        }
    )
    faculty_user1.set_password('password123')
    faculty_user1.save()
    fac1, _ = Faculty.objects.get_or_create(user=faculty_user1, defaults={'department': 'Computer Science & Engineering'})

    faculty_user2, _ = User.objects.get_or_create(
        email='sharma@cdgi.edu.in',
        defaults={
            'name': 'Prof. Anjali Sharma',
            'role': 'faculty',
        }
    )
    faculty_user2.set_password('password123')
    faculty_user2.save()
    fac2, _ = Faculty.objects.get_or_create(user=faculty_user2, defaults={'department': 'Computer Science & Engineering'})

    # 5. Student Users & Profiles
    student_user1, _ = User.objects.get_or_create(
        email='student@cdgi.edu.in',
        defaults={
            'name': 'Aarav Sharma',
            'role': 'student',
        }
    )
    student_user1.set_password('password123')
    student_user1.save()
    stud1, _ = Student.objects.get_or_create(
        user=student_user1,
        defaults={
            'enrollment_no': '0812CS211045',
            'semester': 'VIII',
            'branch': 'CS'
        }
    )

    student_user2, _ = User.objects.get_or_create(
        email='priya@cdgi.edu.in',
        defaults={
            'name': 'Priya Verma',
            'role': 'student',
        }
    )
    student_user2.set_password('password123')
    student_user2.save()
    stud2, _ = Student.objects.get_or_create(
        user=student_user2,
        defaults={
            'enrollment_no': '0812CS211078',
            'semester': 'VIII',
            'branch': 'CS'
        }
    )

    student_user3, _ = User.objects.get_or_create(
        email='rohit@cdgi.edu.in',
        defaults={
            'name': 'Rohit Singh',
            'role': 'student',
        }
    )
    student_user3.set_password('password123')
    student_user3.save()
    stud3, _ = Student.objects.get_or_create(
        user=student_user3,
        defaults={
            'enrollment_no': '0812CS211092',
            'semester': 'VIII',
            'branch': 'CS'
        }
    )

    # 6. Subjects
    sub1, _ = Subject.objects.get_or_create(
        subject_code='CS-801',
        defaults={
            'subject_name': 'Cloud Computing & Virtualization',
            'faculty': fac1,
            'semester': 'VIII',
            'branch': 'CS'
        }
    )
    sub2, _ = Subject.objects.get_or_create(
        subject_code='CS-802',
        defaults={
            'subject_name': 'Machine Learning & AI',
            'faculty': fac1,
            'semester': 'VIII',
            'branch': 'CS'
        }
    )
    sub3, _ = Subject.objects.get_or_create(
        subject_code='CS-803',
        defaults={
            'subject_name': 'Network & Information Security',
            'faculty': fac2,
            'semester': 'VIII',
            'branch': 'CS'
        }
    )
    sub4, _ = Subject.objects.get_or_create(
        subject_code='CS-804',
        defaults={
            'subject_name': 'Internet of Things (IoT) Lab',
            'faculty': fac2,
            'semester': 'VIII',
            'branch': 'CS'
        }
    )

    # 7. Assignments
    now = timezone.now()
    assign1, _ = Assignment.objects.get_or_create(
        title='Lab Manual & AWS Deployment Report',
        subject=sub1,
        defaults={
            'task_type': 'lab_manual',
            'deadline': now + timedelta(days=5),
            'description': 'Submit your signed laboratory experiment file along with AWS architecture diagrams.'
        }
    )
    assign2, _ = Assignment.objects.get_or_create(
        title='CNN Image Classification Case Study',
        subject=sub2,
        defaults={
            'task_type': 'case_study',
            'deadline': now + timedelta(days=7),
            'description': 'Deliverable evaluating Convolutional Neural Networks on CIFAR-10.'
        }
    )
    assign3, _ = Assignment.objects.get_or_create(
        title='NPTEL Cryptography Completion Certificate',
        subject=sub3,
        defaults={
            'task_type': 'certificate',
            'deadline': now + timedelta(days=10),
            'description': 'Upload your 12-week NPTEL course completion e-certificate.'
        }
    )
    assign4, _ = Assignment.objects.get_or_create(
        title='ESP32 Smart Home Prototype Manual',
        subject=sub4,
        defaults={
            'task_type': 'lab_manual',
            'deadline': now + timedelta(days=4),
            'description': 'Submit circuit diagram and source code documentation.'
        }
    )

    # 8. Submissions for Student 1
    Submission.objects.get_or_create(
        student=stud1,
        assignment=assign1,
        defaults={
            'file_url': 'https://cdgi.edu.in/docs/sample_submission.pdf',
            'status': 'approved',
            'remarks': 'Manual verified and signed by lab instructor.',
            'reviewed_at': now - timedelta(days=1)
        }
    )
    Submission.objects.get_or_create(
        student=stud1,
        assignment=assign2,
        defaults={
            'file_url': 'https://cdgi.edu.in/docs/sample_submission.pdf',
            'status': 'submitted',
            'remarks': 'Initial draft uploaded for review.'
        }
    )

    # Submissions for Student 2
    Submission.objects.get_or_create(
        student=stud2,
        assignment=assign1,
        defaults={
            'file_url': 'https://cdgi.edu.in/docs/sample_submission.pdf',
            'status': 'approved',
            'remarks': 'All experiments complete.',
            'reviewed_at': now - timedelta(days=2)
        }
    )

    # 9. No Dues records
    # For stud1: CS-801 cleared, CS-802 pending, CS-803 pending, CS-804 pending
    for sub, status_val, fac in [
        (sub1, 'cleared', fac1),
        (sub2, 'pending', fac1),
        (sub3, 'pending', fac2),
        (sub4, 'pending', fac2)
    ]:
        nd, _ = NoDues.objects.get_or_create(
            student=stud1,
            subject=sub,
            defaults={
                'clearance_status': status_val,
                'approved_by': fac if status_val == 'cleared' else None,
                'approved_date': now if status_val == 'cleared' else None,
                'coordinator_cleared': False
            }
        )

    # For stud2: CS-801 cleared, CS-802 cleared, CS-803 cleared, CS-804 cleared (Fully cleared student)
    for sub, fac in [(sub1, fac1), (sub2, fac1), (sub3, fac2), (sub4, fac2)]:
        nd, _ = NoDues.objects.get_or_create(
            student=stud2,
            subject=sub,
            defaults={
                'clearance_status': 'cleared',
                'approved_by': fac,
                'approved_date': now - timedelta(days=2),
                'coordinator_cleared': True
            }
        )

    # For stud3: all pending
    for sub, fac in [(sub1, fac1), (sub2, fac1), (sub3, fac2), (sub4, fac2)]:
        nd, _ = NoDues.objects.get_or_create(
            student=stud3,
            subject=sub,
            defaults={
                'clearance_status': 'pending',
                'coordinator_cleared': False
            }
        )

    # 10. Sample Notifications
    Notification.objects.get_or_create(
        user=student_user1,
        message='Your submission for Cloud Computing Lab Manual was Approved by Dr. Rajesh Verma.',
        defaults={'is_read': False}
    )
    Notification.objects.get_or_create(
        user=student_user1,
        message='Academic No-Dues cycle for Semester VIII is currently OPEN. Submit pending tasks.',
        defaults={'is_read': True}
    )
    Notification.objects.get_or_create(
        user=faculty_user1,
        message='New submission received from Aarav Sharma (0812CS211045) for Machine Learning Case Study.',
        defaults={'is_read': False}
    )
    Notification.objects.get_or_create(
        user=coord_user,
        message='Priya Verma (0812CS211078) has cleared all subject holds and is awaiting final sign-off.',
        defaults={'is_read': False}
    )

    print("Demo data seeded successfully!")

if __name__ == '__main__':
    seed()
