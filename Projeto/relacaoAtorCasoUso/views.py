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

from relacaoAtorCasoUso.models import RelacaoAtorCasoUso

@csrf_exempt
@ajax_request
def listar_ajax(request):
	idProjeto = request.POST.get('idProjeto', False)
	relacao_json = serializers.serialize('json', RelacaoAtorCasoUso.objects.filter(projeto_id = idProjeto))
	relacao_list = simplejson.loads( relacao_json )
	json_data = simplejson.dumps( {'relacoesAtorCasoUso':relacao_list, 'status':'OK' } )
	return HttpResponse( json_data, mimetype='application/json' )

@csrf_exempt
@ajax_request
def cadastrar_ajax(request):
	idAtor = request.POST.get('idComponente1', False)
	idCaso = request.POST.get('idComponente2', False)
	nomeAtor = request.POST.get('nomeComponente1', False)
	nomeCaso = request.POST.get('nomeComponente2', False)
	idProjeto = request.POST.get('idProjeto', False)
	nomeRelacao = request.POST.get('nomeRelacao', False)
	if idAtor and idCaso and nomeAtor and nomeCaso and idProjeto and nomeRelacao:
		relacaoAtorCasoUso = RelacaoAtorCasoUso(idAtor_id = idAtor, idCaso_id = idCaso, 
			nomeAtor = nomeAtor, nomeCaso = nomeCaso, projeto_id = idProjeto, 
			nomeRelacao = nomeRelacao )
		relacaoAtorCasoUso.save()
		return  {'status': 'OK', "idRelacao": relacaoAtorCasoUso.id}
	else:
		return {'status' : 'Erro'}

@csrf_exempt
@ajax_request
def carregar_ajax(request):
	idAtor = request.POST.get('idComponente1', False)
	idCaso = request.POST.get('idComponente2', False)
	idProjeto = request.POST.get('idProjeto', False)
	nomeRelacao = request.POST.get('nomeRelacao', False)

	if idAtor and idCaso and idProjeto and nomeRelacao:
		relacaoAtorCasoUso = get_object_or_None(RelacaoAtorCasoUso, idAtor_id=idAtor, idCaso_id=idCaso, projeto_id = idProjeto, nomeRelacao = nomeRelacao)
		if relacaoAtorCasoUso is None:
			return {'status' : 0}
		else:
			return {'status' : 1}
	else:
		return {'status' : 'ID da relação é inválida'}

@csrf_exempt
@ajax_request
def excluir_ajax(request):
	idRelacao = request.POST.get('idRelacao', False)
	if idRelacao:
		relacaoAtorCasoUso = get_object_or_None(RelacaoAtorCasoUso, id=idRelacao)
		if relacaoAtorCasoUso is None:
			return {'status' : 'Relação não encontrada'}
		else:
			relacaoAtorCasoUso.delete()
			return {'status': 'OK'}
	else:
		return {'status' : 'ID da relação inválida'}