from django.core.urlresolvers import reverse
from django.http import HttpRequest
from django import template

register = template.Library()

@register.simple_tag(takes_context=True)
def abs_url(context, view):
    request = context.request
    return request.build_absolute_uri(reverse(view))