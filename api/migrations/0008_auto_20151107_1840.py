# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_auto_20151103_2032'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='FurnitureComponents',
            new_name='FurnitureComponent',
        ),
        migrations.AddField(
            model_name='charactercomponent',
            name='texture',
            field=models.OneToOneField(null=True, to='api.Texture'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='check',
            name='dialogue',
            field=models.ForeignKey(to='api.Dialogue', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='conditionalarguments',
            name='conditionCheck',
            field=models.ForeignKey(to='api.Check', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='dialogue',
            name='conversation',
            field=models.ForeignKey(to='api.Conversation', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='dialogue',
            name='speaker',
            field=models.ForeignKey(to='api.Character', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='furnituretype',
            name='furnitureComponent',
            field=models.ForeignKey(to='api.FurnitureComponent', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='furnituretype',
            name='room',
            field=models.ForeignKey(to='api.Room', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='item',
            name='character',
            field=models.ForeignKey(to='api.Character', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='item',
            name='itemDef',
            field=models.OneToOneField(null=True, to='api.ItemDefinition'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='item',
            name='room',
            field=models.ForeignKey(to='api.Room', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='itemdefinition',
            name='texture',
            field=models.OneToOneField(null=True, to='api.Texture'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='line',
            name='dialogue',
            field=models.ForeignKey(to='api.Dialogue', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='option',
            name='conversation',
            field=models.ForeignKey(to='api.Conversation', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='skeletalconnection',
            name='component',
            field=models.ForeignKey(to='api.CharacterComponent', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='skeletalconnection',
            name='outComponents',
            field=models.ManyToManyField(related_name='outComponents_rel_+', null=True, to='api.SkeletalConnection'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='state',
            name='behaviour',
            field=models.ForeignKey(to='api.Behaviour', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='state',
            name='character',
            field=models.ForeignKey(to='api.Character', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='state',
            name='conversation',
            field=models.ForeignKey(to='api.Conversation', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='state',
            name='idleAnimationOverride',
            field=models.ForeignKey(to='api.Animation', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='tag',
            name='characterComponent',
            field=models.ForeignKey(to='api.CharacterComponent', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='tag',
            name='furnitureComponent',
            field=models.ForeignKey(to='api.FurnitureComponent', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='tag',
            name='furnitureType',
            field=models.ForeignKey(to='api.FurnitureType', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='tag',
            name='itemDefinition',
            field=models.ForeignKey(to='api.ItemDefinition', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='tag',
            name='room',
            field=models.ForeignKey(to='api.Room', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='triggerarguments',
            name='triggerCall',
            field=models.ForeignKey(to='api.TriggerCall', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='triggercall',
            name='dialogue',
            field=models.ForeignKey(to='api.Dialogue', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='triggercall',
            name='itemDef',
            field=models.ForeignKey(to='api.ItemDefinition', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='triggercall',
            name='trigger',
            field=models.ForeignKey(to='api.Trigger', null=True),
            preserve_default=True,
        ),
    ]
