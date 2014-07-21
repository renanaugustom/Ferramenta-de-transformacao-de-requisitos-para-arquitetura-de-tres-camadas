# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.conf import settings

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
	url(r'^$', 'tccProject.views.index', name='index'),
	url(r'^projetos/', include('projetos.urls')),
	url(r'^casosdeuso/', include('casosdeuso.urls')),
	url(r'^ator/', include('ator.urls')),
	url(r'^relacaoAtorAtor/', include('relacaoAtorAtor.urls')),
	url(r'^relacaoAtorCasoUso/', include('relacaoAtorCasoUso.urls')),
	url(r'^relacaoCasoUsoCasoUso/', include('relacaoCasoUsoCasoUso.urls')),
	url(r'^classe/', include('classe.urls')),
	url(r'^metodos/', include('metodos.urls')),
	url(r'^atributos/', include('atributos.urls')),
	url(r'^heranca/', include('heranca.urls')),
	url(r'^parametros/', include('parametros.urls')),
	url(r'^relacaoClasseInterface/', include('relacaoClasseInterface.urls')),
	url(r'^tipoVarMet/', include('tipoVarMet.urls')),
	url(r'^classecasouso/', include('classecasouso.urls')),
	url(r'^gerarcodigo/', include('gerarcodigo.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
