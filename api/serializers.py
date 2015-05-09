from django.forms import widgets
from rest_framework import serializers
from api.models import PDUser, Level

class UserSerializer(serializers.ModelSerializer):
    
    levels = serializers.PrimaryKeyRelatedField(many=True, queryset=Level.objects.all())
    
    class Meta:
        model = PDUser
        fields = ('id', 'username', 'email', 'levels')
        

class LevelSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Level
        fields = ('id', 'name', 'description', 'script')