from django.conf.urls import patterns
from rest_framework.urlpatterns import format_suffix_patterns
import views

urlpatterns = patterns('',
                       (r'^$', views.index)
                       )

urlpatterns = format_suffix_patterns(urlpatterns)
