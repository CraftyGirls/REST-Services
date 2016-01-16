# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20160113_2131'),
    ]

    operations = [
        migrations.AddField(
            model_name='texture',
            name='type',
            field=models.CharField(default=b'', max_length=255, choices=[(b'CHARACTER COMPONENT', b'Character Component'), (b'ITEM', b'Item')]),
            preserve_default=True,
        ),
    ]
