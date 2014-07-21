from django.conf.urls import patterns, include, url
from atributos import views

urlpatterns = patterns('',
	url(r'^listar_ajax$', views.listar_ajax, name='listar_ajax'),
	url(r'^excluir_ajax$', views.excluir_ajax, name='excluir_ajax'),
	url(r'^cadastrar_ajax$', views.cadastrar_ajax, name='cadastrar_ajax'),
	url(r'^verificanomeatributo_ajax$', views.verificanomeatributo_ajax, name='verificanomeatributo_ajax'),
	#url(r'^editar_ajax$', views.editar_ajax, name='editar_ajax'),
)
