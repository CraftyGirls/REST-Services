from django.db import models
from django.contrib.auth.models import User


class PDUser(models.Model):
    user = models.OneToOneField(User, unique=True)
    ex = models.CharField(max_length=50, blank=True, default='')


class Level(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=100, blank=False, default='')
    description = models.TextField(blank=False, default='')
    script = models.TextField(blank=False, default='')
    owner = models.ForeignKey(PDUser, related_name='levels')

    class Meta:
        ordering = ('created',)

