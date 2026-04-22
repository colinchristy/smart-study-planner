from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('', lambda request: HttpResponse("Smart Study Planner Backend is working! ")),
    path('admin/', admin.site.urls),
    path('api/login/', obtain_auth_token),
    path('api/', include('planner.urls')),
]
