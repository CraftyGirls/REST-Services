from django.shortcuts import render


def index(request):
    return render(request, 'sweetheartsquad/index.html', {})


def stengine(request):
    return render(request, 'sweetheartsquad/stengine2.html', {})
