from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect, render_to_response
from django.contrib.auth import authenticate, login
from django.template import Template, Context, RequestContext
from django.contrib.auth.models import User
from django.template.loader import get_template
from api.models import PDUser


def index(request):
    return render_to_response('scenarioEditor/index.html/', RequestContext(request, {}))


def charView(request):
    return render(request, 'scenarioEditor/charView/charView.html/', {})


def convoView(request):
    return render(request, 'scenarioEditor/convoView/convoView.html/', {})


def login_view(request):
    if 'username' in request.POST and 'password' in request.POST:
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return redirect('index')
            else:
                # Return a 'disabled account' error message
                return render(request, 'scenarioEditor/login.html/', {'login_error': 2})
        else:
            # Return an 'invalid login' error message.
            return render(request, 'scenarioEditor/login.html/', {'login_error': 1})
    else:
        return render(request, 'scenarioEditor/login.html/', {'login_error': 0})


def register_view(request):
    if 'username' in request.POST and 'password' in request.POST:
        username = request.POST['username']
        password = request.POST['password']
        user = User.objects.create_user(username=username, password=password)
        pd_user = PDUser(user=user)
        pd_user.save()
        user_auth = authenticate(username=username, password=password)
        login(request, user_auth)
        return redirect('index')
    else:
        return render(request, 'scenarioEditor/register.html/', {})
