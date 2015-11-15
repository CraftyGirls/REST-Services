# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_animation_behaviour_character_charactercomponent_check_condition_conditionalarguments_connection_con'),
    ]

    operations = [
        migrations.AddField(
            model_name='character',
            name='scenario',
            field=models.ForeignKey(to='api.Scenario', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='conversation',
            name='scenario',
            field=models.ForeignKey(to='api.Scenario', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='item',
            name='scenario',
            field=models.ForeignKey(to='api.Scenario', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='room',
            name='scenario',
            field=models.ForeignKey(to='api.Scenario', null=True),
            preserve_default=True,
        ),
    ]
