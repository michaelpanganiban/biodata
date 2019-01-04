from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from . import models
import hashlib
model = models.Connection()

def index(request):
    try:
        if 'sesskey' not in request.session:
            return render(request, 'login.html')
        else:
            return HttpResponseRedirect('dashboard/dashboardPath')
    except:
        return HttpResponseRedirect('dashboard/dashboardPath/')

def login_link(request):
    try:
        if 'sesskey' not in request.session:
            if request.method == 'POST':
                try:
                    username = request.POST.get("username")
                    password = hashlib.sha3_256(str.encode(request.POST.get("password"))).hexdigest()
                    result = model.authenticateUser(username, password)
                    if not result:
                        return HttpResponse(0)
                    else:
                        request.session['sesskey'] = result
                        return HttpResponse(1)
                except:
                    return HttpResponse(1)
        else:
            return HttpResponseRedirect('/')
    except:
        return  HttpResponseRedirect('/')

def logout_link(request):
    try:
        del request.session['sesskey']
        return HttpResponseRedirect('/')
    except:
        return  HttpResponseRedirect('/')




