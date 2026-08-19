from rest_framework import serializers
from jobs.models import Student

class StudentSerializer(serializers.ModelSerializer):
    email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Student
        fields = [
            'id', 'first_name', 'last_name', 'student_id', 
            'email',
            'faculty', 'major', 'religion', 'allergies', 
            'student_card_image', 'user'
        ]
