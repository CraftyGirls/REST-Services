# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='trigger',
            old_name='function',
            new_name='type',
        ),
        migrations.AlterField(
            model_name='charactercomponent',
            name='componentType',
            field=models.CharField(max_length=100, choices=[(b'UPPER ARM', b'Upper Arm'), (b'LOWER ARM', b'Lower Arm'), (b'HAND', b'Hand'), (b'UPPER LEG', b'Upper Leg'), (b'LOWER LEG', b'Lower Leg'), (b'FOOT', b'Foot'), (b'TORSO', b'Torso'), (b'LOWER JAW', b'Lower Jaw'), (b'UPPER JAW', b'Upper Jaw'), (b'NOSE', b'Node'), (b'LEFT PUPIL', b'Left Pupil'), (b'RIGHT PUPIL', b'Right Pupil'), (b'RIGHT EYE', b'Right Eye'), (b'LEFT EYE', b'Left Eye'), (b'RIGHT EYEBROW', b'Right Eyebrow'), (b'LEFT EYEBROW', b'Left Eyebrow'), (b'PELVIS', b'Pelvis')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='triggerargument',
            name='dataType',
            field=models.CharField(default=0, max_length=100, choices=[(b'STRING', b'string'), (b'INT', b'int'), (b'FLOAT', b'float'), (b'CHARACTER', b'character'), (b'ITEM', b'item'), (b'ROOM', b'room'), (b'CONVERSATION', b'conversation')]),
            preserve_default=True,
        ),
    ]
