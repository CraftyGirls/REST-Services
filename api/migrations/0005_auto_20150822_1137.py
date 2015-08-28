# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20150822_1136'),
    ]

    operations = [
        migrations.AlterField(
            model_name='scenario',
            name='rating',
            field=models.FloatField(default=0.0),
        ),
    ]
