from django import forms
from api.models import ComponentSet, Asset, TriggerArgument
from django.core.exceptions import ValidationError


class TagField(forms.CharField):
    def clean(self, value):
        try:
            if value is not None:
                return value.split(",")
            return ""
        except:
            raise ValidationError


class AssetFileForm(forms.Form):
    file = forms.FileField()
    assetType = forms.ChoiceField(Asset.TYPE_CHOICES)
    assetId = forms.CharField()
    additionalData = forms.CharField(required=False)


class ComponentSetForm(forms.Form):
    name = forms.CharField(max_length=100)
    description = forms.CharField()
    setType = forms.ChoiceField(ComponentSet.TYPE_CHOICES, required=False)
    joints = forms.CharField(required=False)
    random = forms.BooleanField(required=False)
    tags = TagField()


class AssetForm(forms.Form):
    name = forms.CharField(max_length=100)
    description = forms.CharField()
    assetType = forms.ChoiceField(Asset.TYPE_CHOICES)
    tags = TagField()


class ItemForm(forms.Form):
    name = forms.CharField(max_length=100)
    description = forms.CharField()
    random = forms.BooleanField(required=False)
    tags = TagField()


class TriggerForm(forms.Form):
    id = forms.IntegerField()
    type = forms.CharField(max_length=100)
    description = forms.CharField()
    condition = forms.BooleanField(required=False)
    args = forms.CharField(required=False)


class TriggerArgumentForm(forms.Form):
    id = forms.IntegerField()
    dataType = forms.ChoiceField(choices=TriggerArgument.DATA_TYPE_CHOICES)
    field = forms.CharField(max_length=100)
    dependsOn = forms.CharField(max_length=255)
