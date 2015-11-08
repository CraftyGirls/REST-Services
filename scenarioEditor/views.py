from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.db.models import Q
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render, redirect, render_to_response
from django.contrib.auth import authenticate, login, logout
from django.template import Template, Context, RequestContext
from django.contrib.auth.models import User
from django.template.loader import get_template
from django.views.decorators.csrf import csrf_exempt
from api.models import PDUser, Scenario
from scenarioEditor.forms import UploadFileForm


@login_required(login_url='/scenario/login/')
def index(request):
    return render_to_response('scenarioEditor/index.html/', RequestContext(request, {}))


@login_required(login_url='/scenario/login/')
def charView(request):
    return render(request, 'scenarioEditor/charView/charView.html/', {})


@login_required(login_url='/scenario/login/')
def convoView(request):
    return render(request, 'scenarioEditor/convoView/convoView.html/', {})
    

@login_required(login_url='/scenario/login/')
def assetView(request):
    return render(request, 'scenarioEditor/assetView/assetView.html/', {})
    
    
@login_required(login_url='/scenario/login/')
def roomView(request):
    return render(request, 'scenarioEditor/roomView/roomView.html/', {})
    
    
@login_required(login_url='/scenario/login/')
def itemView(request):
    return render(request, 'scenarioEditor/itemView/itemView.html/', {})

    
@login_required(login_url='/scenario/dialogue/')
def dialogueView(request):
    return render(request, 'scenarioEditor/convoView/dialogue.html/', {})
    

@login_required(login_url='/scenario/login/')
def user_scenarios_view(request):
    pd_user = PDUser.objects.get(user=request.user)
    scenarios = list(Scenario.objects.filter(owner=pd_user))
    return render(request, 'scenarioEditor/profile/scenarios.html/', {'scenarios': scenarios})


@login_required(login_url='/scenario/login/')
def user_home_view(request):
    return render(request, 'scenarioEditor/profile/home.html/', {})


def browse_scenarios_view(request):
    get_params = request.GET
    simple_query_items = dict()
    complex_query_items = []

    # id overrides anything
    if ('id' in get_params):
        simple_query_items['id'] = get_params['id']
    else:
        if ('name' in get_params):
            simple_query_items['name__startswith'] = get_params['name']
        if ('rating' in get_params):
            complex_query_items.append(Q(rating__gte=get_params['rating']) | Q(rating_count=0))

    scenarios = Scenario.objects.filter(*complex_query_items, **simple_query_items)

    if ('sort_by' in get_params and (get_params['sort_by'] == 'id' or 'rating' or 'name')):
        sort_order = ''
        if (('sort_order' in get_params) and get_params['sort_order'] == 'desc'):
            sort_order = '-'
        scenarios = scenarios.order_by(sort_order + str(get_params['sort_by']))

    return render(request, 'scenarioEditor/profile/scenarios.html/', {'scenarios': scenarios})


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


@csrf_exempt
@login_required(login_url='/scenario/login/')
def save(request, scenario_id):
    if(request.method == 'POST'):
        if(scenario_id is not None):
            scenario = Scenario.objects.get(id=scenario_id)
            pd_user = PDUser.objects.get(user=request.user)
            if(scenario.owner.id == pd_user.id):
                scenario.script = request.body
                scenario.save()
                return HttpResponse(request.body)
            else:
                return HttpResponse("Unauthorized", status=401)
        else:
            return HttpResponse("Bad Request", status=400)
    else:
        return HttpResponse("Invalid Method", status=405)


@login_required(login_url='/scenario/login/')
def edit_scenario_view(request, scenario_id):
    if (request.method == 'GET'):
        scenario = Scenario.objects.get(id=scenario_id)
        if scenario is not None:
            if scenario.owner.id != PDUser.objects.get(user=request.user).id:
                return HttpResponse("Unauthorized")
            return render(request, 'scenarioEditor/index.html/', {'scenario' : scenario})
    else:
        # Return invalid method response
        return HttpResponse("Invalid Method", status=405)


@login_required(login_url='/scenario/login/')
def create_scenario_view(request):
    if (request.method == 'GET'):
        return render(request, 'scenarioEditor/create/create_scenario.html/', {})
    elif (request.method == 'POST'):
        if ('scenario_name' in request.POST):
            pd_user = PDUser.objects.get(user=request.user)
            scenario = Scenario(name=str(request.POST['scenario_name']), owner=pd_user)
            scenario.save()
            return redirect(edit_scenario_view, scenario.id)
    else:
        # Return invalid method response
        return HttpResponse("Invalid Method", status=405)
        

@csrf_exempt
@login_required(login_url='/scenario/login/')
def upload_asset(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            print(request.FILES['file'])
            return HttpResponse(status=200)
    else:
        return HttpResponse("Invalid Method", status=405)


def logout_user_view(request):
    logout(request)
    return redirect('index')