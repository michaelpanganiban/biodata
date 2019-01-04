from django.urls import path,include
# from django.views.generic.base import TemplateView
urlpatterns = {
    # path('', TemplateView.as_view(template_name='login.html')),
    path('',  include('login.urls'), name="loginpage"),
    path('login/', include('login.urls'), name="login"),
    path('dashboard/', include('dashboard.urls'), name='dashboardPath')
}

