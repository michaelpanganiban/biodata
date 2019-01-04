import json
from django.shortcuts import render
from . import models
model = models.dashBoardModel()
def dashboardPath(request):
    userlist = model.getUserList()
    return render(request, 'dashboard.html', {'users': userlist})
