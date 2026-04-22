from django.urls import path
from .views import task_list, task_detail, class_list, generate_schedule, register_user

urlpatterns = [
    path('tasks/', task_list),
    path('tasks/<int:task_id>/', task_detail),
    path('classes/', class_list),

    path('schedule/', generate_schedule),
    path('register/', register_user),
]
