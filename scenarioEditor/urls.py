from django.conf.urls import patterns
from rest_framework.urlpatterns import format_suffix_patterns
from django.conf.urls import url

import scenarioEditor.views

urlpatterns = patterns('',
                       url(r'^$', scenarioEditor.views.index, name='index'),
                       url(r'^charView/', scenarioEditor.views.charView, name='charView'),
                       url(r'^convoView/', scenarioEditor.views.convoView, name='convoView'),
                       url(r'^login/', scenarioEditor.views.login_view, name='login_view'),
                       url(r'^register/', scenarioEditor.views.register_view, name='register_view'),
                       url(r'^save/', scenarioEditor.views.save, name='save'),
                       )
