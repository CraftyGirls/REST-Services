from django.db import models


class Choice(models.Model):
    name = models.CharField(max_length=255, blank=False, default='')
    selected = models.IntegerField()


class Option(models.Model):
    val = models.IntegerField()
    count = models.IntegerField()
    choice = models.ForeignKey(Choice, related_name='options')

    class Meta:
        ordering = ('val', 'count')
