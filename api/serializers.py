from django.forms import widgets
from rest_framework import serializers
from api.models import User, Level

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ('id', 'firstName', 'lastName', 'email')
        

class LevelSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Level
        fields = ('id', 'name', 'description', 'script')