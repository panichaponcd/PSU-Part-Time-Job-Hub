from rest_framework import serializers
from jobs.models import Job, WorkSchedule

class WorkScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkSchedule
        fields = ['id', 'date', 'start_time', 'end_time']

class JobSerializer(serializers.ModelSerializer):
    schedules = WorkScheduleSerializer(many=True, required=False)
    applicants_count = serializers.SerializerMethodField()

    def get_applicants_count(self, obj):
        return obj.application_set.count()

    class Meta:
        model = Job
        fields = '__all__'

    def create(self, validated_data):
        schedules_data = validated_data.pop('schedules', [])
        job = Job.objects.create(**validated_data)
        for item in schedules_data:
            WorkSchedule.objects.create(job=job, **item)
        return job

    def update(self, instance, validated_data):
        schedules_data = validated_data.pop('schedules', None)
        instance = super().update(instance, validated_data)

        if schedules_data is not None:
            if hasattr(instance, 'schedules'):
                instance.schedules.all().delete()
            else:
                instance.workschedule_set.all().delete()

            for item in schedules_data:
                item.pop('id', None)
                WorkSchedule.objects.create(job=instance, **item)
        
        return instance
