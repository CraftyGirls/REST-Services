from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf import settings

import api.urls
import partydarling
import wag.urls

urlpatterns = patterns('',
                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^api/', include('api.urls')),
                       url(r'^$', include('partydarling.urls')),
                       url(r'^wag/', include('wag.urls')),
                       url(r'^scenario/', include('scenarioEditor.urls'))
                       )

urlpatterns += [
    url(r'^auth/', include('rest_framework.urls',
                           namespace='rest_framework')),
]

urlpatterns += patterns('', (r'^media\/(?P<path>.*)$',
                             'django.views.static.serve',
                             {'document_root': settings.STATIC_ROOT}),
                        )

from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns += staticfiles_urlpatterns()
