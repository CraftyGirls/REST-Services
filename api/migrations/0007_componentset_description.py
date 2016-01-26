# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20160122_1938'),
    ]

    operations = [
        migrations.AddField(
            model_name='componentset',
            name='description',
            field=models.TextField(default=b''),
        ),
    ]
