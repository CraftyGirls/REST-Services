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
    owner = models.ForeignKey(PDUser, related_name='scenarios')
    rating = models.FloatField(default=0.0)
    rating_count = models.IntegerField(default=0)
    
    # rooms[]
    # characters[]
    # converstation[]
    # items[]

    class Meta:
        ordering = ('created',)


class Component(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=100, blank=False, default='', unique=True)
    image = models.ImageField(upload_to='component_images', blank=True)
    description = models.TextField(blank=False, default='')
    owner = models.ForeignKey(PDUser, related_name='components')
    rating = models.FloatField(default=0.0)

    class Meta:
        ordering = ('name',)
        

class Item(models.Model):
    pass


class Room(models.Model):
    size = models.IntegerField(default=0)
    # furnitureTypes[]
    # items[]
    # tags[]
    
class Behaviour(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    description = models.TextField(blank=False, default='')
    

class Character(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    description = models.TextField(blank=False, default='')
    # states[]
    # items[]
    
    
class Conversation(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    # dialogues []
    # options
    
    
class Line(models.Model):
    text = models.CharField(max_length=100, blank=False, default='')
    

class Condition(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    numArgs = models.IntegerField(default=0)
    

class State(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    # Conversation
    # Behaviour
    # IdelAnimationOverride
    

# Think this might be a join table - Class might go away
class SkeletalConnection(models.Model):
    pass
    # component
    # outComponents
   

class ItemDefinition(models.Model):
    # tags[]
    name = models.CharField(max_length=100, blank=False, default='')
    description = models.TextField(blank=False, default='')
    interactable = models.BooleanField(default=False)
    # effects[]
    # texture
    
    
class Dialogue(models.Model):
    pass
    # speaker
    # lines[]
    # triggerCalls[]
    # conditionChecks[]
    
    
class Option(models.Model):
    text = models.TextField(blank=False, default='')
    # link
    
    
class CharacterComponent(models.Model):
     name = models.CharField(max_length=100, blank=False, default='')
     # texture 
     # inJoint
     # outJoints[]
     # tags
     

class Animation(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    description = models.TextField(blank=False, default='')
    
    
class Tag(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    description = models.TextField(blank=False, default='')
    
    
class Trigger(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    description = models.TextField(blank=False, default='')
    numArgs = models.IntegerField(default=0)
    
    
class Texture(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    imageUrl = models.TextField(blank=False, default='')
    
    
class Check(models.Model):
    pass
    # type
    # args[]
    
    
class FurnitureType(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    # tags
    

class FurnitureComponents(models.Model):
     name = models.CharField(max_length=100, blank=False, default='')
     meshUrl = models.TextField(blank=False, default='')
     # connections
     # tags
     # types
     
     
class TriggerCall(models.Model):
    pass
    # trigger
    # arguments
    
    
class TriggerArguments(models.Model):
    value = models.TextField(blank=False, default='')
    dataType = models.IntegerField(default=0) # Should there be some sort of type table?
    index = models.IntegerField(default=0)
    
    
class ConditionalArguments(models.Model):
    value = models.TextField(blank=False, default='')
    dataType = models.IntegerField(default=0) # Should there be some sort of type table?
    index = models.IntegerField(default=0)
    
    
class Joint(models.Model):
    xPercentage = models.FloatField(default=0.0)
    yPercentage = models.FloatField(default=0.0)
    
    
class connection(models.Model):
    pass
    # val ? Not sure what this is for yet