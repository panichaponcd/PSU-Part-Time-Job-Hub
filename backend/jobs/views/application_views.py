from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from jobs.models import Application, Student, Job, JobStatus, ApplicationStatus
from jobs.serializers import ApplicationSerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    def get_permissions(self):
        if self.action in ['create', 'list', 'retrieve', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = Application.objects.all()
        job_id = self.request.query_params.get('job')
        if job_id:
            queryset = queryset.filter(job_id=job_id)
            
        if not self.request.user.is_staff:
            try:
                student = self.request.user.student_profile
                queryset = queryset.filter(student=student)
            except Student.DoesNotExist:
                queryset = queryset.none()
        return queryset
    
    def perform_create(self, serializer):
        try:
            student = self.request.user.student_profile
        except Student.DoesNotExist:
            raise ValidationError({'detail': 'Only registered students can apply for jobs.'})

        job = serializer.validated_data.get('job')
        if not job or not job.is_active or job.status != JobStatus.OPEN:
            raise ValidationError({'detail': 'This job is not currently open for applications.'})

        # Prevent duplicate applications by the same student
        if Application.objects.filter(student=student, job=job).exists():
            raise ValidationError({'detail': 'You have already applied for this position.'})

        # Prevent applying to jobs that have reached full capacity
        active_apps_count = Application.objects.filter(
            job=job,
            status__in=[ApplicationStatus.APPROVED, ApplicationStatus.PENDING]
        ).count()

        if job.required_amount > 0 and active_apps_count >= job.required_amount:
            raise ValidationError({'detail': 'This position has reached full capacity.'})

        serializer.save(student=student)

