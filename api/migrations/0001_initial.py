# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Animation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'', max_length=100)),
                ('description', models.TextField(default=b'')),
            ],
        ),
        migrations.CreateModel(
            name='Asset',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'', max_length=100)),
                ('description', models.TextField(default=b'')),
                ('remoteUrl', models.CharField(default=b'', max_length=1000)),
                ('assetType', models.CharField(default=b'', max_length=255, choices=[(b'CHARACTER COMPONENT', b'Character Component'), (b'MESH', b'Mesh'), (b'ITEM', b'Item')])),
            ],
        ),
        migrations.CreateModel(
            name='Behaviour',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'', max_length=100)),
                ('description', models.TextField(default=b'')),
            ],
        ),
        migrations.CreateModel(
            name='Character',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'', max_length=100)),
                ('description', models.TextField(default=b'')),
            ],
        ),
        migrations.CreateModel(
            name='CharacterComponent',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'', max_length=100)),
                ('componentType', models.CharField(max_length=100, choices=[(b'UPPER ARM', b'Upper Arm'), (b'LOWER ARM', b'Lower Arm'), (b'HAND', b'Hand'), (b'UPPER LEG', b'Upper Leg'), (b'LOWER LEG', b'Lower Leg'), (b'FOOT', b'Foot'), (b'TORSO', b'Torso'), (b'LOWER JAW', b'Lower Jaw'), (b'UPPER JAW', b'Upper Jaw'), (b'NOSE', b'Node'), (b'LEFT PUPIL', b'Left Pupil'), (b'RIGHT PUPIL', b'Right Pupil'), (b'PELVIS', b'Pelvis')])),
            ],
        ),
        migrations.CreateModel(
            name='Check',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
        ),
        migrations.CreateModel(
            name='Component',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(default=b'', unique=True, max_length=100)),
                ('image', models.ImageField(upload_to=b'component_images', blank=True)),
                ('description', models.TextField(default=b'')),
                ('rating', models.FloatField(default=0.0)),
            ],
            options={
                'ordering': ('name',),
            },
        ),
        migrations.CreateModel(
            name='Condition',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'', max_length=100)),
                ('numArgs', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='ConditionalArguments',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('value', models.TextField(default=b'')),
                ('dataType', models.IntegerField(default=0)),
                ('index', models.IntegerField(default=0)),
                ('conditionCheck', models.ForeignKey(to='api.Check', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Connection',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
        ),
        migrations.CreateModel(
            name='Conversation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'', max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Dialogue',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('conversation', models.ForeignKey(to='api.Conversation', null=True)),
                ('speaker', models.ForeignKey(to='api.Character', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='FurnitureComponent',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'', max_length=100)),
                ('meshUrl', models.TextField(default=b'')),
            ],
        ),
        migrations.CreateModel(
            name='FurnitureType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'', max_length=100)),
                ('furnitureComponent', models.ForeignKey(to='api.FurnitureComponent', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('character', models.ForeignKey(to='api.Character', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Joint',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('xPercentage', models.FloatField(default=0.0)),
                ('yPercentage', models.FloatField(default=0.0)),
            ],
        ),
        migrations.CreateModel(
            name='Line',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('text', models.CharField(default=b'', max_length=100)),
                ('dialogue', models.ForeignKey(to='api.Dialogue', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Option',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('text', models.TextField(default=b'')),
                ('conversation', models.ForeignKey(to='api.Conversation', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='PDUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('avatar', models.ImageField(upload_to=b'profile_images', blank=True)),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('size', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Scenario',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(default=b'', max_length=100)),
                ('description', models.TextField(default=b'')),
                ('script', models.TextField(default=b'')),
                ('rating', models.FloatField(default=0.0)),
                ('rating_count', models.IntegerField(default=0)),
                ('owner', models.ForeignKey(related_name='scenarios', to='api.PDUser')),
            ],
            options={
                'ordering': ('created',),
            },
        ),
        migrations.CreateModel(
            name='SkeletalConnection',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('component', models.ForeignKey(to='api.CharacterComponent', null=True)),
                ('outComponents', models.ManyToManyField(related_name='outComponents_rel_+', null=True, to='api.SkeletalConnection')),
            ],
        ),
        migrations.CreateModel(
            name='State',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'', max_length=100)),
                ('behaviour', models.ForeignKey(to='api.Behaviour', null=True)),
                ('character', models.ForeignKey(to='api.Character', null=True)),
                ('conversation', models.ForeignKey(to='api.Conversation', null=True)),
                ('idleAnimationOverride', models.ForeignKey(to='api.Animation', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('value', models.CharField(default=b'', max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Taggable',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
        ),
        migrations.CreateModel(
            name='Texture',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'', max_length=100)),
                ('imageUrl', models.TextField(default=b'')),
            ],
        ),
        migrations.CreateModel(
            name='Trigger',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'', max_length=100)),
                ('description', models.TextField(default=b'')),
                ('numArgs', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='TriggerArguments',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('value', models.TextField(default=b'')),
                ('dataType', models.IntegerField(default=0)),
                ('index', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='TriggerCall',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('dialogue', models.ForeignKey(to='api.Dialogue', null=True)),
                ('trigger', models.ForeignKey(to='api.Trigger', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='UploadFile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('file', models.FileField(upload_to=b'files/%Y/%m/%d')),
            ],
        ),
        migrations.CreateModel(
            name='ComponentSet',
            fields=[
                ('taggable_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='api.Taggable')),
                ('name', models.CharField(default=b'', max_length=100)),
                ('jsonRepresentation', models.TextField(default=b'')),
                ('fileUrl', models.CharField(default=b'', max_length=512)),
            ],
            bases=('api.taggable',),
        ),
        migrations.CreateModel(
            name='ItemDefinition',
            fields=[
                ('taggable_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='api.Taggable')),
                ('name', models.CharField(default=b'', max_length=100)),
                ('description', models.TextField(default=b'')),
                ('interactable', models.BooleanField(default=False)),
                ('texture', models.OneToOneField(null=True, to='api.Texture')),
            ],
            bases=('api.taggable',),
        ),
        migrations.AddField(
            model_name='triggerarguments',
            name='triggerCall',
            field=models.ForeignKey(to='api.TriggerCall', null=True),
        ),
        migrations.AddField(
            model_name='tag',
            name='owner',
            field=models.ForeignKey(to='api.Taggable', null=True),
        ),
        migrations.AddField(
            model_name='room',
            name='scenario',
            field=models.ForeignKey(to='api.Scenario', null=True),
        ),
        migrations.AddField(
            model_name='item',
            name='room',
            field=models.ForeignKey(to='api.Room', null=True),
        ),
        migrations.AddField(
            model_name='item',
            name='scenario',
            field=models.ForeignKey(to='api.Scenario', null=True),
        ),
        migrations.AddField(
            model_name='furnituretype',
            name='room',
            field=models.ForeignKey(to='api.Room', null=True),
        ),
        migrations.AddField(
            model_name='conversation',
            name='scenario',
            field=models.ForeignKey(to='api.Scenario', null=True),
        ),
        migrations.AddField(
            model_name='component',
            name='owner',
            field=models.ForeignKey(related_name='components', to='api.PDUser'),
        ),
        migrations.AddField(
            model_name='check',
            name='dialogue',
            field=models.ForeignKey(to='api.Dialogue', null=True),
        ),
        migrations.AddField(
            model_name='charactercomponent',
            name='texture',
            field=models.OneToOneField(null=True, to='api.Texture'),
        ),
        migrations.AddField(
            model_name='character',
            name='scenario',
            field=models.ForeignKey(to='api.Scenario', null=True),
        ),
        migrations.AddField(
            model_name='triggercall',
            name='itemDef',
            field=models.ForeignKey(to='api.ItemDefinition', null=True),
        ),
        migrations.AddField(
            model_name='item',
            name='itemDef',
            field=models.ForeignKey(to='api.ItemDefinition', null=True),
        ),
        migrations.AddField(
            model_name='component',
            name='componentSet',
            field=models.ForeignKey(to='api.ComponentSet', null=True),
        ),
        migrations.AddField(
            model_name='charactercomponent',
            name='componentSet',
            field=models.ForeignKey(to='api.ComponentSet', null=True),
        ),
    ]
