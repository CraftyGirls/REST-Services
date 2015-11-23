# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_uploadfile'),
    ]

    operations = [
        migrations.CreateModel(
            name='ComponentSet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'', max_length=100)),
                ('jsonRepresentation', models.TextField(default=b'')),
                ('fileUrl', models.CharField(default=b'', max_length=512)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='component',
            name='componentSet',
            field=models.ForeignKey(to='api.ComponentSet', null=True),
            preserve_default=True,
        ),
    ]
