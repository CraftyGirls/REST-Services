from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response

from django.http import Http404

from models import User, Level
from serializers import UserSerializer, LevelSerializer
        
@api_view(['GET', 'POST'])
def user_list(request, format=None):
    # List all code snippets, or create a new snippet.
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
@api_view(['GET', 'PUT', 'DELETE'])
def user_detail(request, pk, format=None):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user.delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)        
        
        
class LevelList(APIView):
    
    def get(self, request, format=None):
        levels = Level.objects.all()
        serializer = LevelSerializer(levels, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = LevelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
class LevelDetail(APIView):
    
    def get_object(self, pk):
        try:
            return Level.objects.get(pk=pk)
        except Level.DoesNotExist:
            raise Http404
            
    def get(self, request, pk, format=None):
        level = self.get_object(pk)
        serializer = LevelSerializer(level)
        return Response(serializer.data)
        
    def put(self, request, pk, format=None):
        snippet = self.get_object(pk)
        level = LevelSerializer(snippet, data=request.data)
        if level.is_valid():
            level.save()
            return Response(level.data)
        return Response(level.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        level = self.get_object(pk)
        level.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)