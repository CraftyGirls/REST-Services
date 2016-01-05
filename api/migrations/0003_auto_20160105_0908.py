# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_componentset_settype'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='scenario',
            name='rating',
        ),
        migrations.RemoveField(
            model_name='scenario',
            name='rating_count',
        ),
        migrations.AddField(
            model_name='scenario',
            name='jsonUrl',
            field=models.CharField(default=b'{}', max_length=1024),
        ),
    ]
