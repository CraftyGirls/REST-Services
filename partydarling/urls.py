from django.conf.urls import patterns
from rest_framework.urlpatterns import format_suffix_patterns
import partydarling.views

urlpatterns = patterns('',
                       (r'^$', partydarling.views.index)
                       )
