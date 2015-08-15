from django.forms import widgets
from rest_framework import serializers
from api.models import PDUser, Scenario
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='pk', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')


class PDUserSerializer(serializers.ModelSerializer):
    # id = serializers.IntegerField(source='pk', read_only=True)
    # username = serializers.CharField(source='user.username')
    # email = serializers.CharField(source='user.email')
    # password = serializers.CharField(source='user.password')
    # first_name = serializers.CharField(source='user.first_name')
    # last_name = serializers.CharField(source='user.last_name')

    user = UserSerializer()
    scenarios = serializers.PrimaryKeyRelatedField(many=True, queryset=Scenario.objects.all())

    class Meta:
        model = PDUser
        fields = ('user', 'scenarios')

    def update(self, instance, validated_data):
        # First, update the User
        user_data = validated_data.pop('user', None)
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        # Then, update UserProfile
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.user = user_data
        instance.save()
        return instance

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        # Don't want levels as part of the keywords since its a reverse relationship
        validated_data.pop('scenarios')
        profile = PDUser.objects.create(user=user, **validated_data)
        return profile


class LevelSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.user.username')

    class Meta:
        model = Scenario
        fields = ('id', 'name', 'description', 'script', 'owner')

    '''def create(self, validated_data):
        owner = PDUser.objects.filter(user_id="auth.User.id")
        profile = PDUser.objects.create(owner=owner, **validated_data)
        return profile'''
