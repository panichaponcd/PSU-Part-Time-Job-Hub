from rest_framework import viewsets, filters
from rest_framework.permissions import IsAdminUser, AllowAny
from jobs.models import Job
from jobs.serializers import JobSerializer
from jobs.permissions import IsAdminOrReadOnly

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all().order_by('-created_at')
    serializer_class = JobSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'organization_name']

    def get_queryset(self):
        if self.action == 'retrieve':
            return Job.objects.all()
        return Job.objects.filter(is_active=True).order_by('-created_at')
