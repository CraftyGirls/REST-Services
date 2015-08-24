# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_scenario_rating_count'),
    ]

    operations = [
        migrations.AlterField(
            model_name='component',
            name='rating',
            field=models.FloatField(default=0.0),
        ),
    ]
