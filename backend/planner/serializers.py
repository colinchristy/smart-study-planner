from rest_framework import serializers
from .models import Task, Course


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'course',
            'due_date',
            'status',
            'created_at',
        ]


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name']
