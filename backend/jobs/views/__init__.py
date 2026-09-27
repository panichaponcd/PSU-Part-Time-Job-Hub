from .job_views import JobViewSet
from .student_views import StudentViewSet
from .application_views import ApplicationViewSet
from .evaluation_views import EvaluationViewSet
from .auth_views import AuthViewSet

__all__ = [
    'JobViewSet',
    'StudentViewSet',
    'ApplicationViewSet',
    'EvaluationViewSet',
    'AuthViewSet',
]
