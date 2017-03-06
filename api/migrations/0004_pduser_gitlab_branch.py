# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_texture_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='pduser',
            name='gitlab_branch',
            field=models.CharField(default=b'', max_length=256),
            preserve_default=True,
        ),
    ]
