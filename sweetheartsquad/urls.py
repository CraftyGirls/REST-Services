from django.conf.urls import patterns, url
from rest_framework.urlpatterns import format_suffix_patterns

import sweetheartsquad.views


urlpatterns = patterns('',
                       (r'^$', sweetheartsquad.views.index),
                       url(r'^s-tengine2/', sweetheartsquad.views.stengine, name='stengine')
                       )
