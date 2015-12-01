from django import forms
from api.models import ComponentSet, Asset
from django.core.exceptions import ValidationError


class TagField(forms.CharField):
    def clean(self, value):
        try:
            return value.split(",")
        except:
            raise ValidationError


class AssetFileForm(forms.Form):
    file = forms.FileField()
    assetType = forms.ChoiceField(Asset.TYPE_CHOICES)
    
    
class ComponentSetForm(forms.Form):
    name = forms.CharField(max_length=100)
    description = forms.CharField()
    setType = forms.ChoiceField(ComponentSet.TYPE_CHOICES)
    tags = TagField()
    
    
class AssetForm(forms.Form):
    name = forms.CharField(max_length=100)
    description = forms.CharField()
    assetType = forms.ChoiceField(Asset.TYPE_CHOICES)
    tags = TagField()
    