from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from jobs.models import Application, Student
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
        serializer.save(student=self.request.user.student_profile)
