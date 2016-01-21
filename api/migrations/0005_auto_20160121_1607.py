# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_pduser_gitlab_branch'),
    ]

    operations = [
        migrations.AddField(
            model_name='triggerargument',
            name='dependsOn',
            field=models.CharField(default=b'NONE', max_length=255),
        ),
        migrations.AlterField(
            model_name='pduser',
            name='gitlab_branch',
            field=models.CharField(max_length=256, blank=True),
        ),
    ]
