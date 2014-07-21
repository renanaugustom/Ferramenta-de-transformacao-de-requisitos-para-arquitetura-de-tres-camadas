# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render, redirect, get_object_or_404
from django.forms import ModelForm
from annoying.decorators import render_to
from annoying.decorators import ajax_request
from annoying.functions import get_object_or_None
from django.views.decorators.csrf import csrf_exempt
from django.utils import simplejson
from django.core import serializers
from django.http import HttpResponse

from relacaoClasseInterface.models import Implementacao

@csrf_exempt
@ajax_request
def listar_ajax(request):
	idProjeto = request.POST.get('idProjeto', False)
	listaRelacoes = Implementacao.objects.filter(projeto_id = idProjeto)
	listaRetorno = []
	for rel in listaRelacoes:
		data = {}
		data = {'pk':rel.pk,'classe':rel.classe,'nomeClasse':rel.classe.nome, 'interface': rel.interface, 'nomeInterface': rel.interface.nome}
		listaRetorno.append(data.copy())

	json_data = simplejson.dumps( {'relacoesClasseInterface':listaRetorno, 'status':'OK' } )
	return HttpResponse( json_data, mimetype='application/json' )

@csrf_exempt
@ajax_request
def cadastrar_ajax(request):
	idClasse = request.POST.get('idClasse', False)
	idInterface = request.POST.get('idInterface', False)
	idProjeto = request.POST.get('idProjeto', False)
	if idClasse and idInterface and idProjeto:
		relacaoClasseInterface = Implementacao(classe_id = idClasse, 
			interface_id = idInterface, projeto_id = idProjeto)
		relacaoClasseInterface.save()
		return  {'status': 'OK', "idImplementacao": relacaoClasseInterface.id}
	else:
		return {'status' : 'Erro'}

@csrf_exempt
@ajax_request
def excluir_ajax(request):
	idImplementacao = request.POST.get('idImplementacao', False)
	if idImplementacao:
		relacaoClasseInterface = get_object_or_None(Implementacao, id=idImplementacao)
		if relacaoClasseInterface is None:
			return {'status' : 'Relação não encontrada'}
		else:
			relacaoClasseInterface.delete()
			return {'status': 'OK'}
	else:
		return {'status' : 'ID da relação inválida'}

@csrf_exempt
@ajax_request
def verificarimplementacaoexistente_ajax(request):
	idClasse = request.POST.get('idClasse', False)
	idInterface = request.POST.get('idInterface', False)
	if idClasse and idInterface:
		relacao = Implementacao.objects.filter(classe_id = idClasse, interface_id = idInterface)
		if len(relacao) == 0:
			return {'status' : 'OK', 'jaExiste' : 'false' } 
		else:
			return {'status' : 'OK', 'jaExiste' : 'true' } 
	else:
		return {'status' : 'Dados referente a relação são inválidos'}
