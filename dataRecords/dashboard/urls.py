from django.urls import path
from . import views

urlpatterns = [
    path('dashboardPath', views.dashboardPath, name="dashboard")
]