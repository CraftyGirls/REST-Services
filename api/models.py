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

    class Meta:
        ordering = ('created',)
        
        
class Component(models.Model):
    
    created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=100, blank=False, default='', unique=True)
    image = models.ImageField(upload_to='component_images', blank=True)
    description = models.TextField(blank=False, default='')
    owner = models.ForeignKey(PDUser, related_name='components')
    rating = models.FloatField(default=0.0)
    componentSet = models.ForeignKey('ComponentSet', null=True)
    
    class Meta:
        ordering = ('name',)
        
class ComponentSet(models.Model):
    
    TYPE_CHOICES = [
        ('ARM', 'Arm'),
        ('LEG', 'Leg'),
        ('HEAD', 'Head'),
        ('TORSO', 'Torso'),
        ('PELVIS', 'Pelvis')
        ];
    
    name = models.CharField(default='', max_length=100)
    jsonRepresentation = models.TextField(default='')
    fileUrl = models.CharField(default='', max_length=512)
    
    def getComponents(self):
        return list(Component.objects.filter(componentSet=self))
        
        
class Asset(models.Model):
    
    TYPE_CHOICES = [
        ('COMPONENT_IMAGE', 'Component Image'),
        ('MESH', 'Mesh'),
        ];
    
    name        = models.CharField(max_length=100, blank=False, default='')
    description = models.TextField(default='')
    remoteUrl   = models.CharField(max_length=1000, blank=False, default='')
    assetType   = models.CharField(max_length=255, choices=TYPE_CHOICES)
    
    
class Texture(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    imageUrl = models.TextField(blank=False, default='')
    
    
class ItemDefinition(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    description = models.TextField(blank=False, default='')
    interactable = models.BooleanField(default=False)
    texture = models.OneToOneField(Texture, null=True)
    

class Room(models.Model):
    size = models.IntegerField(default=0)
    scenario = models.ForeignKey(Scenario, null=True)
    
    
class Character(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    description = models.TextField(blank=False, default='')
    scenario    = models.ForeignKey(Scenario, null=True)

    
class Item(models.Model):
    itemDef   = models.OneToOneField(ItemDefinition, null=True)
    scenario  = models.ForeignKey(Scenario, null=True)
    room      = models.ForeignKey(Room, null=True)
    character = models.ForeignKey(Character, null=True)

    
class Behaviour(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    description = models.TextField(blank=False, default='')
    
    
class Conversation(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    scenario = models.ForeignKey(Scenario, null=True)
    

class Condition(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    numArgs = models.IntegerField(default=0)
    
    
class Animation(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    description = models.TextField(blank=False, default='')
    

class State(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    character = models.ForeignKey(Character, null=True)
    conversation = models.ForeignKey(Conversation, null=True)
    behaviour = models.ForeignKey(Behaviour, null=True)
    idleAnimationOverride = models.ForeignKey(Animation, null=True)
    
    
class Option(models.Model):
    text = models.TextField(blank=False, default='')
    conversation = models.ForeignKey(Conversation, null=True)
    
    
class Joint(models.Model):
    xPercentage = models.FloatField(default=0.0)
    yPercentage = models.FloatField(default=0.0)
    
    
class CharacterComponent(models.Model):
     name = models.CharField(max_length=100, blank=False, default='')
     texture = models.OneToOneField(Texture, null=True)
     #inJoint = models.OneToOneField(Joint, null=True)
     #outJoints = models.ForeignKey(Joint, null=True)
     
     
# Think this might be a join table - Class might go away
class SkeletalConnection(models.Model):
    component = models.ForeignKey(CharacterComponent, null=True)
    outComponents = models.ManyToManyField("self", null=True)


class FurnitureComponent(models.Model):
     name = models.CharField(max_length=100, blank=False, default='')
     meshUrl = models.TextField(blank=False, default='')
     
     # ????? connections ?????
     
     
class FurnitureType(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    room = models.ForeignKey(Room, null=True)
    furnitureComponent = models.ForeignKey(FurnitureComponent, null=True) 
     
    
class Tag(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    description = models.TextField(blank=False, default='')
    
    # Foreign keys to taggable types - look into abstract classes for these
    room = models.ForeignKey(Room, null=True)
    furnitureType = models.ForeignKey(FurnitureType, null=True)
    itemDefinition = models.ForeignKey(ItemDefinition, null=True)
    characterComponent = models.ForeignKey(CharacterComponent, null=True)
    furnitureComponent = models.ForeignKey(FurnitureComponent, null=True)
    
    
class Trigger(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    description = models.TextField(blank=False, default='')
    numArgs = models.IntegerField(default=0)
    
     
class Dialogue(models.Model):
    conversation = models.ForeignKey(Conversation, null=True)
    speaker = models.ForeignKey(Character, null=True)
    
    
class Check(models.Model):
    dialogue = models.ForeignKey(Dialogue, null=True)
    # ????? type ?????
    
    
class Line(models.Model):
    text = models.CharField(max_length=100, blank=False, default='')
    dialogue = models.ForeignKey(Dialogue, null=True)
    
    
class TriggerCall(models.Model):
    # Look at abstract class for this
    dialogue = models.ForeignKey(Dialogue, null=True)
    itemDef = models.ForeignKey(ItemDefinition, null=True)
    
    trigger = models.ForeignKey(Trigger, null=True)
    
    
class TriggerArguments(models.Model):
    value = models.TextField(blank=False, default='')
    dataType = models.IntegerField(default=0) # Should there be some sort of type table?
    index = models.IntegerField(default=0)
    triggerCall = models.ForeignKey(TriggerCall, null=True)
    
    
class ConditionalArguments(models.Model):
    value = models.TextField(blank=False, default='')
    dataType = models.IntegerField(default=0) # Should there be some sort of type table?
    index = models.IntegerField(default=0)
    conditionCheck = models.ForeignKey(Check, null=True)
    
    
class Connection(models.Model):
    pass
    # val ? Not sure what this is for yet
    
    
class UploadFile(models.Model):
    file = models.FileField(upload_to='files/%Y/%m/%d')