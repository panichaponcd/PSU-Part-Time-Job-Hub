from rest_framework import serializers
from jobs.models import Application, Evaluation

class EvaluationSerializer(serializers.ModelSerializer):
    job_title = serializers.SerializerMethodField()
    
    def get_job_title(self, obj):
        return obj.application.job.title

    class Meta:
        model = Evaluation
        fields = '__all__'

class ApplicationSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    student_id = serializers.SerializerMethodField()
    faculty = serializers.SerializerMethodField()
    job_title = serializers.SerializerMethodField()
    job_poster_url = serializers.ReadOnlyField(source='job.poster_image_url')
    evaluation = EvaluationSerializer(read_only=True)

    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}"

    def get_student_id(self, obj):
        return obj.student.student_id

    def get_faculty(self, obj):
        return obj.student.faculty

    def get_job_title(self, obj):
        return obj.job.title

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['student', 'application_date']
