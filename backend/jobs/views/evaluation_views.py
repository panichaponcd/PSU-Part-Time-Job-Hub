from rest_framework import viewsets
from jobs.models import Evaluation
from jobs.serializers import EvaluationSerializer

class EvaluationViewSet(viewsets.ModelViewSet):
    serializer_class = EvaluationSerializer
    queryset = Evaluation.objects.all()

    def get_queryset(self):
        queryset = Evaluation.objects.all()
        application_id = self.request.query_params.get('application')
        if application_id is not None:
            queryset = queryset.filter(application_id=application_id)
        return queryset
