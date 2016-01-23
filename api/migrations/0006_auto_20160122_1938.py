# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_auto_20160121_1607'),
    ]

    operations = [
        migrations.AlterField(
            model_name='triggerargument',
            name='dataType',
            field=models.CharField(default=0, max_length=100, choices=[(b'STRING', b'string'), (b'INT', b'int'), (b'FLOAT', b'float'), (b'CHARACTER', b'character'), (b'ITEM', b'item'), (b'ROOM', b'room'), (b'CONVERSATION', b'conversation'), (b'CHARACTER_STATE', b'character_state')]),
            preserve_default=True,
        ),
    ]
