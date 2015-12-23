# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='componentset',
            name='setType',
            field=models.CharField(default=b'', max_length=100, choices=[(b'ARM', b'Arm'), (b'LEG', b'Leg'), (b'HEAD', b'Head'), (b'TORSO', b'Torso'), (b'PELVIS', b'Pelvis')]),
        ),
    ]
