from django.conf.urls import patterns, url
from rest_framework.urlpatterns import format_suffix_patterns
import partydarling.views

urlpatterns = patterns('',
                       url(r'^$', partydarling.views.index, name='index')
                       )
