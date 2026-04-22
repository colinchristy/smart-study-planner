from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Task, Course 
from .serializers import TaskSerializer, CourseSerializer
from django.contrib.auth.models import User
from datetime import date, timedelta
from django.contrib.auth.models import User

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def task_list(request):
    if request.method == 'GET':
        tasks = Task.objects.filter(user=request.user).order_by('-created_at')
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def task_detail(request, task_id):
    try:
        task = Task.objects.get(id=task_id, user=request.user)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def class_list(request):
    if request.method == 'GET':
        courses = Course.objects.filter(user=request.user)
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_schedule(request):
    due_date = request.data.get('due_date')
    goal_date = request.data.get('goal_date')
    hours_needed = int(request.data.get('hours_needed', 1))

    from datetime import datetime
    due_date = datetime.strptime(due_date, "%Y-%m-%d").date()

    if goal_date:
        goal_date = datetime.strptime(goal_date, "%Y-%m-%d").date()
        end_date = goal_date
    else:
        end_date = due_date

    today = date.today()
    days = (end_date - today).days

    if days <= 0:
        return Response({"error": "Invalid dates"}, status=400)

    hours_per_day = round(hours_needed / days, 2)

    schedule = []
    for i in range(days):
        day = today + timedelta(days=i+1)
        schedule.append({
            "date": str(day),
            "hours": hours_per_day
        })

    return Response(schedule)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def generate_schedule(request):
    if request.method == 'GET':
        return Response({"message": "Schedule endpoint working"})

    due_date = request.data.get('due_date')
    goal_date = request.data.get('goal_date')
    hours_needed = int(request.data.get('hours_needed', 1))

    from datetime import datetime
    due_date = datetime.strptime(due_date, "%Y-%m-%d").date()

    if goal_date:
        goal_date = datetime.strptime(goal_date, "%Y-%m-%d").date()
        end_date = goal_date
    else:
        end_date = due_date

    today = date.today()
    days = (end_date - today).days

    if days <= 0:
        return Response({"error": "Invalid dates"}, status=400)

    hours_per_day = round(hours_needed / days, 2)

    schedule = []
    for i in range(days):
        day = today + timedelta(days=i + 1)
        schedule.append({
            "date": str(day),
            "hours": hours_per_day
        })

    return Response(schedule)

@api_view(['POST'])
@permission_classes([])  
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "User already exists"}, status=400)

    user = User.objects.create_user(username=username, password=password)
    return Response({"message": "User created successfully"}, status=201)
