from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from jobs.models import Student
from jobs.serializers import StudentSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['student_id']

    def get_queryset(self):
        queryset = Student.objects.all()
        student_id = self.request.query_params.get('student_id')
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        if not self.request.user.is_staff:
            try:
                student = self.request.user.student_profile
                queryset = queryset.filter(id=student.id)
            except Student.DoesNotExist:
                queryset = queryset.none()
        return queryset
