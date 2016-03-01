# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_trigger_condition'),
    ]

    operations = [
        migrations.AddField(
            model_name='componentset',
            name='random',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='itemdefinition',
            name='random',
            field=models.BooleanField(default=True),
        ),
    ]
