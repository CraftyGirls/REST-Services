from django.db import models

class User(models.Model):
    
    created = models.DateTimeField(auto_now_add=True)
    firstName = models.CharField(max_length=100, blank=False, default='')
    lastName = models.CharField(max_length=100, blank=False, default='')
    email = models.EmailField(max_length=75, blank=False, default='')
   
    class Meta:
        ordering = ('created',)
        
        
class Level(models.Model):
    
    created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=100, blank=False, default='')
    description = models.TextField(blank=False, default='')
    script = models.TextField(blank=False, default='')
    
    class Meta:
        ordering = ('created',)