from django.conf.urls import patterns, include, url
from relacaoClasseInterface import views

urlpatterns = patterns('',
	url(r'^listar_ajax$', views.listar_ajax, name='listar_ajax'),
	url(r'^excluir_ajax$', views.excluir_ajax, name='excluir_ajax'),
	url(r'^cadastrar_ajax$', views.cadastrar_ajax, name='cadastrar_ajax'),
	url(r'^verificarimplementacaoexistente_ajax$', views.verificarimplementacaoexistente_ajax, name='verificarimplementacaoexistente_ajax'),
)
