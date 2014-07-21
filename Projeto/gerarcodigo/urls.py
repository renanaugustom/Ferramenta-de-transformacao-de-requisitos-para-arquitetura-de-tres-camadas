from django.conf.urls import patterns, include, url
from gerarcodigo import views

urlpatterns = patterns('',
	url(r'^gerarcodigo_ajax$', views.gerarcodigo_ajax, name='gerarcodigo_ajax'),
)
