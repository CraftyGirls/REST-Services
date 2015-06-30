from django.conf.urls import patterns, include, url
from rest_framework.urlpatterns import format_suffix_patterns
from wag import views
from django.conf.urls import include

urlpatterns = patterns('',
                       url(r'^choice/$', views.ChoiceList.as_view())
                       )

