from django.conf.urls import patterns
from rest_framework.urlpatterns import format_suffix_patterns

import sweetheartsquad.views


urlpatterns = patterns('',
                       (r'^$', sweetheartsquad.views.index)
                       )
