from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

urlpatterns = [
    path('', lambda request: HttpResponse("Smart Study Planner Backend is Running ")),
    path('admin/', admin.site.urls),
    path('api/', include('planner.urls')),
]
