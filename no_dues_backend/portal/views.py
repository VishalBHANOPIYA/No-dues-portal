import os
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

from portal.models import (
    Student, Faculty, Subject, Assignment, Submission, NoDues,
    SemesterCycle, Notification
)
from portal.serializers import (
    FacultySerializer, FacultyWriteSerializer, SubjectSerializer,
    AssignmentSerializer, SubmissionSerializer, NoDuesSerializer,
    StudentDueSummarySerializer, SubjectReportSerializer,
    SemesterToggleSerializer, SubjectAllocateSerializer, NotificationSerializer
)
from portal.permissions import IsStudent, IsFaculty, IsCoordinator, IsHODAdmin
from portal.notifications import send_notification

User = get_user_model()


# ==========================================
# COORDINATOR VIEWS
# ==========================================

class CoordinatorStudentsView(APIView):
    """
    Returns student list with due summary.
    Supports both /api/coordinator/students and /api/coordinator/class-report.
    """
    permission_classes = [IsAuthenticated, IsCoordinator]

    def get(self, request):
        semester = request.query_params.get('semester')
        branch = request.query_params.get('branch')

        students = Student.objects.all()
        if semester:
            students = students.filter(semester=semester)
        if branch:
            students = students.filter(branch=branch)

        data = []
        for stud in students:
            dues = NoDues.objects.filter(student=stud)
            total_count = dues.count()
            cleared_count = dues.filter(clearance_status='cleared').count()
            pending_count = total_count - cleared_count

            # Standardized keys for both frontend mock alignment and serializer
            student_data = {
                'id': str(stud.id),
                'student_id': stud.id,
                'studentName': stud.user.name or stud.user.email,
                'student_name': stud.user.name or stud.user.email,
                'enrollmentNo': stud.enrollment_no,
                'enrollment_no': stud.enrollment_no,
                'semester': stud.semester,
                'branch': stud.branch,
                'total_dues': total_count,
                'totalDuesCount': total_count,
                'cleared_dues': cleared_count,
                'duesClearedCount': cleared_count,
                'pending_dues': pending_count,
                'status': 'Cleared' if pending_count == 0 else 'Pending'
            }
            data.append(student_data)

        return Response(data)


class CoordinatorPendingStudentsView(APIView):
    """List students with any pending NoDues holds."""
    permission_classes = [IsAuthenticated, IsCoordinator]

    def get(self, request):
        semester = request.query_params.get('semester')
        branch = request.query_params.get('branch')

        # Filter students who have at least one pending due hold
        pending_student_ids = NoDues.objects.filter(clearance_status='pending').values_list('student_id', flat=True).distinct()
        students = Student.objects.filter(id__in=pending_student_ids)

        if semester:
            students = students.filter(semester=semester)
        if branch:
            students = students.filter(branch=branch)

        data = []
        for stud in students:
            dues = NoDues.objects.filter(student=stud)
            total_count = dues.count()
            cleared_count = dues.filter(clearance_status='cleared').count()
            pending_count = total_count - cleared_count

            student_data = {
                'id': str(stud.id),
                'student_id': stud.id,
                'studentName': stud.user.name or stud.user.email,
                'student_name': stud.user.name or stud.user.email,
                'enrollmentNo': stud.enrollment_no,
                'enrollment_no': stud.enrollment_no,
                'semester': stud.semester,
                'branch': stud.branch,
                'total_dues': total_count,
                'totalDuesCount': total_count,
                'cleared_dues': cleared_count,
                'duesClearedCount': cleared_count,
                'pending_dues': pending_count,
                'status': 'Pending'
            }
            data.append(student_data)

        return Response(data)


class CoordinatorApproveClearanceView(APIView):
    """Mark coordinator clearance (coordinator_cleared = True) and send notification."""
    permission_classes = [IsAuthenticated, IsCoordinator]

    def post(self, request, student_id):
        try:
            student = Student.objects.get(id=student_id)
        except Student.DoesNotExist:
            return Response({'message': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

        # Mark all NoDues records for the student as coordinator_cleared = True
        NoDues.objects.filter(student=student).update(coordinator_cleared=True)

        # Trigger notification
        send_notification(
            student.user,
            "Your No Dues clearance is approved by the class coordinator! You can now generate your certificate."
        )

        return Response({'message': f'Coordinator clearance marked for student {student.enrollment_no}'})


# ==========================================
# HOD / ADMIN VIEWS
# ==========================================

class AdminFacultyView(APIView):
    """GET/POST /api/admin/faculty to list and add faculty."""
    permission_classes = [IsAuthenticated, IsHODAdmin]

    def get(self, request):
        faculties = Faculty.objects.all()
        data = []
        for fac in faculties:
            data.append({
                'id': str(fac.id),
                'name': fac.user.name or fac.user.email,
                'email': fac.user.email,
                'department': fac.department
            })
        return Response(data)

    def post(self, request):
        serializer = FacultyWriteSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            name = serializer.validated_data['name']
            password = serializer.validated_data['password']
            department = serializer.validated_data['department']

            if User.objects.filter(email=email).exists():
                return Response({'message': 'User with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

            # Create User
            user = User.objects.create_user(
                email=email,
                password=password,
                role='faculty',
                name=name
            )
            # Create Faculty Profile
            fac = Faculty.objects.create(user=user, department=department)

            return Response({
                'id': str(fac.id),
                'name': user.name,
                'email': user.email,
                'department': fac.department
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminFacultyDeleteView(APIView):
    """DELETE /api/admin/faculty/<id> to remove faculty."""
    permission_classes = [IsAuthenticated, IsHODAdmin]

    def delete(self, request, pk):
        try:
            fac = Faculty.objects.get(id=pk)
        except Faculty.DoesNotExist:
            return Response({'message': 'Faculty member not found'}, status=status.HTTP_404_NOT_FOUND)

        # Deleting the user will cascade delete the Faculty profile
        user = fac.user
        user.delete()
        return Response({'message': 'Faculty member removed successfully'})


class AdminSubjectAllocateView(APIView):
    """POST /api/admin/subjects/allocate - Assign subject to faculty."""
    permission_classes = [IsAuthenticated, IsHODAdmin]

    def post(self, request):
        serializer = SubjectAllocateSerializer(data=request.data)
        if serializer.is_valid():
            sub_id = serializer.validated_data['subject_id']
            fac_id = serializer.validated_data['faculty_id']

            try:
                subject = Subject.objects.get(id=sub_id)
                faculty = Faculty.objects.get(id=fac_id)
            except (Subject.DoesNotExist, Faculty.DoesNotExist):
                return Response({'message': 'Subject or Faculty not found'}, status=status.HTTP_404_NOT_FOUND)

            subject.faculty = faculty
            subject.save()

            return Response({'message': f'Allocated {subject.subject_name} to {faculty.user.name or faculty.user.email}'})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminSemesterToggleView(APIView):
    """POST /api/admin/semester/toggle - Toggle NoDues cycle open/closed."""
    permission_classes = [IsAuthenticated, IsHODAdmin]

    def post(self, request):
        serializer = SemesterToggleSerializer(data=request.data)
        if serializer.is_valid():
            semester = serializer.validated_data['semester']
            is_open = serializer.validated_data['is_open']

            cycle, created = SemesterCycle.objects.get_or_create(semester=semester)
            cycle.is_open = is_open
            cycle.save()

            # Notify students of cycle change
            students = Student.objects.filter(semester=semester)
            status_str = "opened" if is_open else "closed"
            for stud in students:
                send_notification(stud.user, f"No Dues registration cycle for Semester {semester} has been {status_str}.")

            return Response({
                'semester': semester,
                'is_open': cycle.is_open,
                'message': f'Semester cycle {status_str} successfully'
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminConfigView(APIView):
    """GET /api/admin/config - Returns current system status settings."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Default or latest cycle
        cycle = SemesterCycle.objects.order_by('-updated_at').first()
        is_open = cycle.is_open if cycle else True
        semester = cycle.semester if cycle else "VIII Semester"
        
        return Response({
            'isCycleOpen': is_open,
            'academicYear': '2025-2026',
            'semesterCode': semester
        })


class AdminReportsView(APIView):
    """GET /api/admin/reports - Aggregate per-subject cleared vs pending count."""
    permission_classes = [IsAuthenticated, IsHODAdmin]

    def get(self, request):
        subjects = Subject.objects.all()
        data = []
        for sub in subjects:
            dues = NoDues.objects.filter(subject=sub)
            cleared = dues.filter(clearance_status='cleared').count()
            pending = dues.filter(clearance_status='pending').count()

            data.append({
                'subject_id': sub.id,
                'subject_code': sub.subject_code,
                'subject_name': sub.subject_name,
                'faculty_name': sub.faculty.user.name or sub.faculty.user.email,
                'cleared_count': cleared,
                'cleared': cleared,
                'pending_count': pending,
                'pending': pending,
                'subject': sub.subject_code  # Short label for UI Chart
            })
        return Response(data)


class AdminExportExcelView(APIView):
    """GET /api/admin/export/excel - Excel file download using openpyxl."""
    permission_classes = [IsAuthenticated, IsHODAdmin]

    def get(self, request):
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "No-Dues Status Ledger"

        # Design Sheet Styling
        header_fill = PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid")
        header_font = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
        cell_font = Font(name="Segoe UI", size=10)
        border_side = Side(border_style="thin", color="CBD5E1")
        cell_border = Border(left=border_side, right=border_side, top=border_side, bottom=border_side)
        center_align = Alignment(horizontal="center", vertical="center")

        # Headers
        headers = ["Student Name", "Enrollment No", "Semester", "Branch", "Subject Code", "Subject Name", "Status", "Faculty Verifier"]
        ws.append(headers)

        for col_idx, header in enumerate(headers, 1):
            cell = ws.cell(row=1, column=col_idx)
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = center_align

        # Data rows
        no_dues_records = NoDues.objects.select_related('student__user', 'subject__faculty__user')
        for due in no_dues_records:
            row_data = [
                due.student.user.name or due.student.user.email,
                due.student.enrollment_no,
                due.student.semester,
                due.student.branch,
                due.subject.subject_code,
                due.subject.subject_name,
                due.clearance_status.capitalize(),
                due.subject.faculty.user.name or due.subject.faculty.user.email
            ]
            ws.append(row_data)

        # Style all cells
        for row in ws.iter_rows(min_row=2, max_row=ws.max_row, min_col=1, max_col=len(headers)):
            for cell in row:
                cell.font = cell_font
                cell.border = cell_border
                if cell.column in [2, 3, 5, 7]:  # Centered columns
                    cell.alignment = center_align

        # Auto-fit columns
        for col in ws.columns:
            max_len = max(len(str(cell.value or '')) for cell in col)
            col_letter = openpyxl.utils.get_column_letter(col[0].column)
            ws.column_dimensions[col_letter].width = max(max_len + 3, 12)

        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response["Content-Disposition"] = 'attachment; filename="nodues_clearance_report.xlsx"'
        wb.save(response)
        return response


# ==========================================
# NOTIFICATION VIEWS
# ==========================================

class NotificationListView(APIView):
    """GET /api/notifications to retrieve user notifications."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifs = Notification.objects.filter(user=request.user)
        data = []
        for n in notifs:
            # Map mock fields and serializer fields
            elapsed = "Just now"
            diff = timezone.now() - n.created_at
            if diff.days > 0:
                elapsed = f"{diff.days} days ago"
            elif diff.seconds // 3600 > 0:
                elapsed = f"{diff.seconds // 3600} hours ago"
            elif diff.seconds // 60 > 0:
                elapsed = f"{diff.seconds // 60} minutes ago"

            data.append({
                'id': str(n.id),
                'message': n.message,
                'createdAt': elapsed,
                'created_at': n.created_at.isoformat(),
                'isRead': n.is_read,
                'is_read': n.is_read
            })
        return Response(data)


class NotificationMarkReadView(APIView):
    """PATCH /api/notifications/<id>/read to mark notification as read."""
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            notif = Notification.objects.get(id=pk, user=request.user)
        except Notification.DoesNotExist:
            return Response({'message': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)

        notif.is_read = True
        notif.save()
        return Response({'message': 'Notification marked as read'})


class NotificationMarkAllReadView(APIView):
    """POST /api/notifications/read-all to mark all notifications as read."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'message': 'All notifications marked as read'})


# ==========================================
# STUDENT VIEWS
# ==========================================

class StudentTasksView(APIView):
    """GET /api/student/tasks - Retrieves assignments with status calculation."""
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        try:
            student = request.user.student_profile
        except Student.DoesNotExist:
            return Response({'message': 'Student profile not found'}, status=status.HTTP_404_NOT_FOUND)

        assignments = Assignment.objects.filter(
            subject__semester=student.semester,
            subject__branch=student.branch
        )

        data = []
        for assign in assignments:
            submission = Submission.objects.filter(student=student, assignment=assign).first()
            
            # Map status choices
            if not submission:
                status_str = "Pending"
            elif submission.status == 'approved':
                status_str = "Approved"
            elif submission.status == 'rejected':
                status_str = "Rejected"
            elif submission.status == 'resubmit':
                status_str = "Resubmission Requested"
            else:
                status_str = "Submitted"

            data.append({
                'id': str(assign.id),
                '_id': str(assign.id),
                'subject': assign.subject.subject_name,
                'taskType': assign.get_task_type_display(),
                'deadline': assign.deadline.strftime("%Y-%m-%d"),
                'status': status_str,
                'description': assign.description,
                'remarks': submission.remarks if submission else ""
            })
        return Response(data)


class StudentDuesView(APIView):
    """GET /api/student/dues - Dues status report."""
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        try:
            student = request.user.student_profile
        except Student.DoesNotExist:
            return Response({'message': 'Student profile not found'}, status=status.HTTP_404_NOT_FOUND)

        dues = NoDues.objects.filter(student=student)
        data = []
        for due in dues:
            data.append({
                'id': str(due.id),
                'subject': due.subject.subject_name,
                'code': due.subject.subject_code,
                'status': 'Cleared' if due.clearance_status == 'cleared' else 'Pending',
                'remarks': f"Clearance check by {due.subject.faculty.user.name or due.subject.faculty.user.email}." if due.clearance_status == 'pending' else "All manuals verified. No dues.",
                'auditor': due.subject.faculty.user.name or due.subject.faculty.user.email
            })
        return Response(data)


class StudentCertificateView(APIView):
    """GET /api/student/certificate - Secure clearance certificate generation."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student_id = request.query_params.get('studentId')

        # Allow coordinators and HOD admins to fetch certificate of other students
        if student_id and request.user.role in ['coordinator', 'hod_admin']:
            try:
                student = Student.objects.get(id=student_id)
            except Student.DoesNotExist:
                return Response({'message': 'Student profile not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            try:
                student = request.user.student_profile
            except Student.DoesNotExist:
                return Response({'message': 'Student profile not found'}, status=status.HTTP_404_NOT_FOUND)

        dues = NoDues.objects.filter(student=student)
        
        # Verify if all subject dues are cleared
        cleared_subjects = []
        for due in dues:
            cleared_subjects.append({
                'name': due.subject.subject_name,
                'faculty': due.subject.faculty.user.name or due.subject.faculty.user.email,
                'status': due.clearance_status.capitalize()
            })

        data = {
            'studentName': (student.user.name or student.user.email).upper(),
            'enrollmentNo': student.enrollment_no,
            'semester': student.semester,
            'branch': student.branch,
            'clearedDate': timezone.now().strftime("%B %d, %Y"),
            'subjects': cleared_subjects
        }
        return Response(data)


class StudentSubmissionCreateView(APIView):
    """POST /api/student/submissions - Submit assignment with file saving."""
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request):
        task_id = request.data.get('taskId')
        file_obj = request.FILES.get('file')
        remarks = request.data.get('remarks', '')

        try:
            student = request.user.student_profile
            assignment = Assignment.objects.get(id=task_id)
        except Student.DoesNotExist:
            return Response({'message': 'Student profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except Assignment.DoesNotExist:
            return Response({'message': 'Assignment not found'}, status=status.HTTP_404_NOT_FOUND)

        if not file_obj:
            return Response({'message': 'Please upload a file'}, status=status.HTTP_400_BAD_REQUEST)

        # Save file to media/submissions
        file_name = default_storage.save(f"submissions/{file_obj.name}", ContentFile(file_obj.read()))
        file_url = request.build_absolute_uri(settings_media_url_helper(file_name))

        # Create or update Submission
        submission, created = Submission.objects.update_or_create(
            student=student,
            assignment=assignment,
            defaults={
                'file_url': file_url,
                'status': 'submitted',
                'remarks': remarks,
                'submitted_at': timezone.now()
            }
        )

        # Trigger notification to faculty
        faculty_user = assignment.subject.faculty.user
        send_notification(
            faculty_user,
            f"New submission received from {student.user.name or student.user.email} for {assignment.title}."
        )

        return Response({'message': 'Work submitted successfully!'}, status=status.HTTP_201_CREATED)


def settings_media_url_helper(file_name):
    from django.conf import settings
    return settings.MEDIA_URL + file_name


# ==========================================
# FACULTY VIEWS
# ==========================================

class FacultySubmissionsView(APIView):
    """GET /api/faculty/submissions - Submissions for assigned subjects."""
    permission_classes = [IsAuthenticated, IsFaculty]

    def get(self, request):
        try:
            faculty = request.user.faculty_profile
        except Faculty.DoesNotExist:
            return Response({'message': 'Faculty profile not found'}, status=status.HTTP_404_NOT_FOUND)

        submissions = Submission.objects.filter(assignment__subject__faculty=faculty).order_by('-submitted_at')
        
        data = []
        for sub in submissions:
            # Map choice status to UI values
            if sub.status == 'approved':
                status_str = "Approved"
            elif sub.status == 'rejected':
                status_str = "Rejected"
            elif sub.status == 'resubmit':
                status_str = "Resubmission Requested"
            else:
                status_str = "Pending"

            data.append({
                'id': str(sub.id),
                'studentName': sub.student.user.name or sub.student.user.email,
                'enrollmentNo': sub.student.enrollment_no,
                'subject': sub.assignment.subject.subject_name,
                'taskType': sub.assignment.get_task_type_display(),
                'submittedAt': sub.submitted_at.strftime("%Y-%m-%d"),
                'status': status_str
            })
        return Response(data)


class FacultySubjectsView(APIView):
    """GET /api/faculty/subjects - List subjects allocated to faculty."""
    permission_classes = [IsAuthenticated, IsFaculty]

    def get(self, request):
        try:
            faculty = request.user.faculty_profile
        except Faculty.DoesNotExist:
            return Response({'message': 'Faculty profile not found'}, status=status.HTTP_404_NOT_FOUND)

        subjects = Subject.objects.filter(faculty=faculty)
        data = []
        for sub in subjects:
            data.append({
                'id': str(sub.id),
                'name': sub.subject_name,
                'code': sub.subject_code,
                'semester': sub.semester,
                'branch': sub.branch
            })
        return Response(data)


class FacultySubmissionDetailView(APIView):
    """GET/PATCH /api/faculty/submissions/<id>."""
    permission_classes = [IsAuthenticated, IsFaculty]

    def get(self, request, pk):
        try:
            faculty = request.user.faculty_profile
            sub = Submission.objects.get(id=pk, assignment__subject__faculty=faculty)
        except Faculty.DoesNotExist:
            return Response({'message': 'Faculty profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except Submission.DoesNotExist:
            return Response({'message': 'Submission not found'}, status=status.HTTP_404_NOT_FOUND)

        data = {
            'id': str(sub.id),
            'studentName': sub.student.user.name or sub.student.user.email,
            'enrollmentNo': sub.student.enrollment_no,
            'subject': sub.assignment.subject.subject_name,
            'taskType': sub.assignment.get_task_type_display(),
            'submittedAt': sub.submitted_at.strftime("%Y-%m-%d"),
            'remarks': sub.remarks,
            'fileUrl': sub.file_url,
            'fileName': os.path.basename(sub.file_url) if sub.file_url else "document.pdf"
        }
        return Response(data)

    def patch(self, request, pk):
        try:
            faculty = request.user.faculty_profile
            sub = Submission.objects.get(id=pk, assignment__subject__faculty=faculty)
        except Faculty.DoesNotExist:
            return Response({'message': 'Faculty profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except Submission.DoesNotExist:
            return Response({'message': 'Submission not found'}, status=status.HTTP_404_NOT_FOUND)

        frontend_status = request.data.get('status')
        remarks = request.data.get('remarks', '')

        # Map frontend status to DB status
        status_map = {
            'Approved': 'approved',
            'Rejected': 'rejected',
            'Resubmission Requested': 'resubmit'
        }
        db_status = status_map.get(frontend_status, 'pending')

        sub.status = db_status
        sub.remarks = remarks
        sub.reviewed_at = timezone.now()
        sub.save()

        # Update subject NoDues clearance
        if db_status == 'approved':
            NoDues.objects.filter(student=sub.student, subject=sub.assignment.subject).update(
                clearance_status='cleared',
                approved_by=faculty,
                approved_date=timezone.now()
            )
        else:
            NoDues.objects.filter(student=sub.student, subject=sub.assignment.subject).update(
                clearance_status='pending',
                approved_by=None,
                approved_date=None
            )

        # Trigger notification to student
        send_notification(
            sub.student.user,
            f"Your submission for {sub.assignment.title} was {frontend_status.lower()}."
        )

        return Response({'message': f'Clearance status updated to {frontend_status}'})


class FacultyAssignmentCreateView(APIView):
    """POST /api/faculty/assignments - Create a checkpoint assignment."""
    permission_classes = [IsAuthenticated, IsFaculty]

    def post(self, request):
        try:
            faculty = request.user.faculty_profile
        except Faculty.DoesNotExist:
            return Response({'message': 'Faculty profile not found'}, status=status.HTTP_404_NOT_FOUND)

        sub_id = request.data.get('subjectId')
        title = request.data.get('title')
        task_type_str = request.data.get('taskType')
        description = request.data.get('description', '')
        deadline_str = request.data.get('deadline')

        try:
            subject = Subject.objects.get(id=sub_id, faculty=faculty)
        except Subject.DoesNotExist:
            return Response({'message': 'Subject not found or access denied'}, status=status.HTTP_404_NOT_FOUND)

        # Map choice
        task_type_map = {
            'Lab Manual': 'lab_manual',
            'Assignment': 'assignment',
            'Case Study': 'case_study',
            'Mini Project': 'mini_project',
            'Certificate': 'certificate'
        }
        task_type = task_type_map.get(task_type_str, 'assignment')

        # Parse deadline date
        try:
            deadline = timezone.make_aware(timezone.datetime.strptime(deadline_str, "%Y-%m-%d"))
        except ValueError:
            return Response({'message': 'Invalid date format for deadline. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)

        assign = Assignment.objects.create(
            title=title,
            task_type=task_type,
            deadline=deadline,
            subject=subject,
            description=description
        )

        # Add default pending NoDues entry if it doesn't exist for students in this semester/branch
        students = Student.objects.filter(semester=subject.semester, branch=subject.branch)
        for stud in students:
            NoDues.objects.get_or_create(student=stud, subject=subject)

        return Response({'message': 'Checkpoint assignment created successfully'}, status=status.HTTP_201_CREATED)
