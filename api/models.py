from django.db import models
from django.contrib.auth.models import User
import json


class PDUser(models.Model):
    user = models.OneToOneField(User, unique=True)
    avatar = models.ImageField(upload_to='profile_images', blank=True)
    gitlab_branch = models.CharField(max_length=256, blank=True)

    @staticmethod
    def branch_for_user(user):
        return PDUser.objects.get(user=user.id).gitlab_branch


class Scenario(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=100, blank=False, default='')
    description = models.TextField(blank=False, default='')
    script = models.TextField(blank=False, default='')
    owner = models.ForeignKey(PDUser, related_name='scenarios')
    jsonUrl = models.CharField(max_length=1024, default="{}")
    order = models.IntegerField(default=0)
    type = models.IntegerField(default=0)

    class Meta:
        ordering = ('created',)


class Tag(models.Model):
    value = models.CharField(max_length=100, blank=False, default='')
    owner = models.ForeignKey('Taggable', null=True)

    def asDict(self):
        return {"value": self.value}


class Taggable(models.Model):
    def getTags(self):
        return Tag.objects.filter(owner=self.id).all()


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


class ComponentSet(Taggable):
    TYPE_CHOICES = [
        ('ARM', 'Arm'),
        ('LEG', 'Leg'),
        ('HEAD', 'Head'),
        ('TORSO', 'Torso'),
        ('PELVIS', 'Pelvis')
    ]

    name = models.CharField(default='', max_length=100)
    jsonRepresentation = models.TextField(default='')
    fileUrl = models.CharField(default='', max_length=512)
    setType = models.CharField(default='', max_length=100, choices=TYPE_CHOICES)
    description = models.TextField(default='')

    def get_components(self):
        return list(CharacterComponent.objects.filter(componentSet=self))

    def asDict(self):

        compsArr = []
        components = CharacterComponent.objects.filter(componentSet=self)
        for c in components:
            compsArr.append(c.asDict())

        tagsArr = []
        tags = self.getTags()

        for t in tags:
            tagsArr.append(t.asDict())

        return {
            'id': self.id,
            'name': self.name,
            'jsonRepresentation': self.jsonRepresentation,
            'setType': self.setType,
            'components': compsArr,
            'tags': tagsArr,
            'description':self.description
        }

    def asJson(self):
        return json.dumps(self.asDict())


class Asset(models.Model):
    CHARACTER_COMPONENT = "CHARACTER COMPONENT"
    MESH = "MESH"
    ITEM = "ITEM"

    TYPE_CHOICES = [
        (CHARACTER_COMPONENT, 'Character Component'),
        (MESH, 'Mesh'),
        (ITEM, 'Item')
    ]

    name = models.CharField(max_length=100, blank=False, default='')
    description = models.TextField(default='')
    remoteUrl = models.CharField(max_length=1000, blank=False, default='')
    assetType = models.CharField(max_length=255, choices=TYPE_CHOICES, default='')


class Texture(models.Model):
    CHARACTER_COMPONENT = "CHARACTER COMPONENT"
    ITEM = "ITEM"
    TYPE_CHOICES = [
        (CHARACTER_COMPONENT, 'Character Component'),
        (ITEM, 'Item')
    ]
    name = models.CharField(max_length=100, blank=False, default='')
    imageUrl = models.TextField(blank=False, default='')
    type = models.CharField(max_length=255, choices=TYPE_CHOICES, default='')

    def asDict(self):
        return {
            'id': self.id,
            'src': self.name,
            'imageUrl': self.imageUrl
        }


class Room(models.Model):
    size = models.IntegerField(default=0)
    scenario = models.ForeignKey(Scenario, null=True)


class Character(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    description = models.TextField(blank=False, default='')
    scenario = models.ForeignKey(Scenario, null=True)


class ItemDefinition(Taggable):
    name = models.CharField(max_length=100, blank=False, default='')
    description = models.TextField(blank=False, default='')
    interactable = models.BooleanField(default=False)
    texture = models.OneToOneField(Texture, null=True)

    def asDict(self):
        tex = None
        if self.texture != None:
            tex = self.texture.asDict()

        tagsArr = []
        tags = self.getTags()

        for t in tags:
            tagsArr.append(t.asDict())

        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'interactable': self.interactable,
            'texture': tex,
            'tags': tagsArr
        }


class Item(models.Model):
    itemDef = models.ForeignKey(ItemDefinition, null=True)
    scenario = models.ForeignKey(Scenario, null=True)
    room = models.ForeignKey(Room, null=True)
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
    TYPE_CHOICES = [
        ("UPPER ARM", 'Upper Arm'),
        ("LOWER ARM", 'Lower Arm'),
        ("HAND", 'Hand'),
        ("UPPER LEG", 'Upper Leg'),
        ("LOWER LEG", 'Lower Leg'),
        ("FOOT", 'Foot'),
        ("TORSO", 'Torso'),
        ("LOWER JAW", 'Lower Jaw'),
        ("UPPER JAW", 'Upper Jaw'),
        ("NOSE", 'Node'),
        ("LEFT PUPIL", 'Left Pupil'),
        ("RIGHT PUPIL", 'Right Pupil'),
        ("RIGHT EYE", 'Right Eye'),
        ("LEFT EYE", 'Left Eye'),
        ("RIGHT EYEBROW", 'Right Eyebrow'),
        ("LEFT EYEBROW", 'Left Eyebrow'),
        ("PELVIS", 'Pelvis'),
    ]

    name = models.CharField(max_length=100, blank=False, default='')
    texture = models.OneToOneField(Texture, null=True)
    componentType = models.CharField(max_length=100, choices=TYPE_CHOICES)
    componentSet = models.ForeignKey(ComponentSet, null=True)

    # inJoint = models.OneToOneField(Joint, null=True)
    # outJoints = models.ForeignKey(Joint, null=True)

    def asDict(self):
        tex = None
        if self.texture != None:
            tex = self.texture.asDict()
        return {
            'id': self.id,
            'name': self.name,
            'texture': self.texture.asDict(),
            'componentType': self.componentType
        }

    def asJson(self):
        return json.dumps(self.asDict())


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


class Dialogue(models.Model):
    conversation = models.ForeignKey(Conversation, null=True)
    speaker = models.ForeignKey(Character, null=True)


class Check(models.Model):
    dialogue = models.ForeignKey(Dialogue, null=True)
    # ????? type ?????


class Line(models.Model):
    text = models.CharField(max_length=100, blank=False, default='')
    dialogue = models.ForeignKey(Dialogue, null=True)


class Trigger(models.Model):
    type = models.CharField(max_length=100, blank=False, default='')
    description = models.TextField(blank=False, default='')
    condition = models.BooleanField(default=False)

    def getArguments(self):
        return TriggerArgument.objects.filter(trigger=self).all()

    def asDict(self):
        argsQuery = self.getArguments()
        argsArr = []
        for arg in argsQuery:
            argsArr.append(arg.asDict())
        return {
            'id': self.id,
            'type': self.type,
            'description': self.description,
            'args': argsArr,
            'condition':self.condition
        }


class TriggerArgument(models.Model):
    DATA_TYPE_CHOICES = [
        ("STRING", 'string'),
        ("INT", 'int'),
        ("FLOAT", 'float'),
        ("CHARACTER", 'character'),
        ("ITEM", 'item'),
        ("ROOM", 'room'),
        ("CONVERSATION", 'conversation'),
        ("CHARACTER_STATE", 'character_state'),
    ]

    dataType = models.CharField(default=0, max_length=100, choices=DATA_TYPE_CHOICES)
    field = models.CharField(default=0, max_length=100)
    trigger = models.ForeignKey(Trigger, null=True)
    dependsOn = models.CharField(max_length=255, default="NONE")

    def asDict(self):
        return {
            'id': self.id,
            'dataType': self.dataType,
            'field': self.field,
            'dependsOn':self.dependsOn
        }


class ConditionalArguments(models.Model):
    value = models.TextField(blank=False, default='')
    dataType = models.IntegerField(default=0)  # Should there be some sort of type table?
    index = models.IntegerField(default=0)
    conditionCheck = models.ForeignKey(Check, null=True)


class Connection(models.Model):
    pass
    # val ? Not sure what this is for yet


class UploadFile(models.Model):
    file = models.FileField(upload_to='files/%Y/%m/%d')
