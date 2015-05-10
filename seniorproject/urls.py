from django.conf.urls import patterns, include, url
from django.contrib import admin

import api.urls
import site

urlpatterns = patterns('',
                       # Examples:
                       # url(r'^$', 'seniorproject.views.home', name='home'),
                       # url(r'^blog/', include('blog.urls')),
                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^api/', include('api.urls')),
                       url(r'^site/', include('site.urls'))
                       )
