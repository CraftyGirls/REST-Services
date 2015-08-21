# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='component',
            name='owner',
            field=models.ForeignKey(related_name='components', to='api.PDUser'),
        ),
        migrations.AlterField(
            model_name='scenario',
            name='owner',
            field=models.ForeignKey(related_name='scenarios', to='api.PDUser'),
        ),
    ]
