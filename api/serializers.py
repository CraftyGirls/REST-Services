from django.forms import widgets
from rest_framework import serializers
from api.models import User

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ('id', 'firstName', 'lastName', 'email')