from django.urls import path
from portal.views import (
    CoordinatorStudentsView, CoordinatorPendingStudentsView, CoordinatorApproveClearanceView,
    AdminFacultyView, AdminFacultyDeleteView, AdminSubjectAllocateView,
    AdminSemesterToggleView, AdminConfigView, AdminReportsView, AdminExportExcelView,
    NotificationListView, NotificationMarkReadView, NotificationMarkAllReadView,
    StudentTasksView, StudentDuesView, StudentCertificateView, StudentSubmissionCreateView,
    FacultySubmissionsView, FacultySubjectsView, FacultySubmissionDetailView, FacultyAssignmentCreateView
)

urlpatterns = [
    # Coordinator APIs
    path('coordinator/class-report', CoordinatorStudentsView.as_view(), name='coordinator-class-report'),
    path('coordinator/students', CoordinatorStudentsView.as_view(), name='coordinator-students'),
    path('coordinator/pending-students', CoordinatorPendingStudentsView.as_view(), name='coordinator-pending-students'),
    path('coordinator/pending-students/', CoordinatorPendingStudentsView.as_view(), name='coordinator-pending-students-slash'),
    path('coordinator/approve-clearance/<int:student_id>', CoordinatorApproveClearanceView.as_view(), name='coordinator-approve-clearance'),
    path('coordinator/approve-clearance/<int:student_id>/', CoordinatorApproveClearanceView.as_view(), name='coordinator-approve-clearance-slash'),

    # Admin/HOD APIs
    path('admin/faculty', AdminFacultyView.as_view(), name='admin-faculty'),
    path('admin/faculty/', AdminFacultyView.as_view(), name='admin-faculty-slash'),
    path('admin/faculty/<int:pk>', AdminFacultyDeleteView.as_view(), name='admin-faculty-delete'),
    path('admin/faculty/<int:pk>/', AdminFacultyDeleteView.as_view(), name='admin-faculty-delete-slash'),
    path('admin/subjects/allocate', AdminSubjectAllocateView.as_view(), name='admin-subject-allocate'),
    path('admin/subjects/allocate/', AdminSubjectAllocateView.as_view(), name='admin-subject-allocate-slash'),
    path('admin/semester/toggle', AdminSemesterToggleView.as_view(), name='admin-semester-toggle'),
    path('admin/semester/toggle/', AdminSemesterToggleView.as_view(), name='admin-semester-toggle-slash'),
    path('admin/config', AdminConfigView.as_view(), name='admin-config'),
    path('admin/config/', AdminConfigView.as_view(), name='admin-config-slash'),
    path('admin/reports', AdminReportsView.as_view(), name='admin-reports'),
    path('admin/reports/', AdminReportsView.as_view(), name='admin-reports-slash'),
    path('admin/export/excel', AdminExportExcelView.as_view(), name='admin-export-excel'),
    path('admin/export/excel/', AdminExportExcelView.as_view(), name='admin-export-excel-slash'),

    # Notifications APIs
    path('notifications', NotificationListView.as_view(), name='notifications-list'),
    path('notifications/', NotificationListView.as_view(), name='notifications-list-slash'),
    path('notifications/<int:pk>/read', NotificationMarkReadView.as_view(), name='notification-mark-read'),
    path('notifications/<int:pk>/read/', NotificationMarkReadView.as_view(), name='notification-mark-read-slash'),
    path('notifications/read-all', NotificationMarkAllReadView.as_view(), name='notifications-read-all'),
    path('notifications/read-all/', NotificationMarkAllReadView.as_view(), name='notifications-read-all-slash'),

    # Student APIs
    path('student/tasks', StudentTasksView.as_view(), name='student-tasks'),
    path('student/tasks/', StudentTasksView.as_view(), name='student-tasks-slash'),
    path('student/dues', StudentDuesView.as_view(), name='student-dues'),
    path('student/dues/', StudentDuesView.as_view(), name='student-dues-slash'),
    path('student/certificate', StudentCertificateView.as_view(), name='student-certificate'),
    path('student/certificate/', StudentCertificateView.as_view(), name='student-certificate-slash'),
    path('student/submissions', StudentSubmissionCreateView.as_view(), name='student-submissions'),
    path('student/submissions/', StudentSubmissionCreateView.as_view(), name='student-submissions-slash'),

    # Faculty APIs
    path('faculty/submissions', FacultySubmissionsView.as_view(), name='faculty-submissions'),
    path('faculty/submissions/', FacultySubmissionsView.as_view(), name='faculty-submissions-slash'),
    path('faculty/subjects', FacultySubjectsView.as_view(), name='faculty-subjects'),
    path('faculty/subjects/', FacultySubjectsView.as_view(), name='faculty-subjects-slash'),
    path('faculty/submissions/<int:pk>', FacultySubmissionDetailView.as_view(), name='faculty-submission-detail'),
    path('faculty/submissions/<int:pk>/', FacultySubmissionDetailView.as_view(), name='faculty-submission-detail-slash'),
    path('faculty/assignments', FacultyAssignmentCreateView.as_view(), name='faculty-assignment-create'),
    path('faculty/assignments/', FacultyAssignmentCreateView.as_view(), name='faculty-assignment-create-slash'),
]
