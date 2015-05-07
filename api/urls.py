from django.conf.urls import patterns, include, url
from django.contrib import admin
from rest_framework.urlpatterns import format_suffix_patterns
from api import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'seniorproject.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^users/$', views.user_list),
    url(r'^users/(?P<pk>[0-9]+)/$', views.user_detail),
    url(r'^levels/(?P<pk>[0-9]+)/$', views.LevelDetail.as_view()),
    url(r'^levels/$', views.LevelList.as_view())
)

urlpatterns = format_suffix_patterns(urlpatterns)
