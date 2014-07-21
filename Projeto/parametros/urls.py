# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.conf.urls import patterns, include, url
from parametros import views

urlpatterns = patterns('',
  url(r'^listar_ajax$', views.listar_ajax, name='listar_ajax'),
  url(r'^excluir_ajax$', views.excluir_ajax, name='excluir_ajax'),
  url(r'^cadastrar_ajax$', views.cadastrar_ajax, name='cadastrar_ajax'),
  url(r'^verificanomeparametro_ajax$', views.verificanomeparametro_ajax, name='verificanomeparametro_ajax'),
)