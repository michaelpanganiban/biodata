from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('logout', views.logout_link, name="logout"),
    path('authenticate', views.login_link, name="login"),
]