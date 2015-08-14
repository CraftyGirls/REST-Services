from django.db import models
from django.contrib.auth.models import User


class PDUser(models.Model):
    user = models.OneToOneField(User, unique=True)
    avatar = models.ImageField(upload_to='profile_images', blank=True)


class Scenario(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=100, blank=False, default='')
    description = models.TextField(blank=False, default='')
    script = models.TextField(blank=False, default='')
    owner = models.ForeignKey(User, related_name='scenarios')
    rating = models.FloatField()

    class Meta:
        ordering = ('created',)


class Component(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=100, blank=False, default='', unique=True)
    image = models.ImageField(upload_to='component_images', blank=True)
    description = models.TextField(blank=False, default='')
    owner = models.ForeignKey(User, related_name='components')
    rating = models.FloatField()

    class Meta:
        ordering = ('name',)