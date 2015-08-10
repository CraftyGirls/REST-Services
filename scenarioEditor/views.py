from django.shortcuts import render


def index(request):
    return render(request, 'scenarioEditor/index.html', {})


def charView(request):
    return render(request, 'scenarioEditor/charView/charView.html', {})


def convoView(request):
    return render(request, 'scenarioEditor/convoView/convoView.html', {})