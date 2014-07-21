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

from relacaoAtorAtor.models import RelacaoAtorAtor

@csrf_exempt
@ajax_request
def listar_ajax(request):
	idProjeto = request.POST.get('idProjeto', False)
	relacao_json = serializers.serialize('json', RelacaoAtorAtor.objects.filter(projeto_id = idProjeto))
	relacao_list = simplejson.loads( relacao_json )
	json_data = simplejson.dumps( {'relacoesAtorAtor':relacao_list, 'status':'OK' } )
	return HttpResponse( json_data, mimetype='application/json' )

@csrf_exempt
@ajax_request
def cadastrar_ajax(request):
	idAtor1 = request.POST.get('idComponente1', False)
	idAtor2 = request.POST.get('idComponente2', False)
	nomeAtor1 = request.POST.get('nomeComponente1', False)
	nomeAtor2 = request.POST.get('nomeComponente2', False)
	idProjeto = request.POST.get('idProjeto', False)
	nomeRelacao = request.POST.get('nomeRelacao', False)
	if idAtor1 and idAtor2 and nomeAtor1 and nomeAtor2 and idProjeto and nomeRelacao:
		relacaoAtorAtor = RelacaoAtorAtor(idAtor1_id = idAtor1, idAtor2_id = idAtor2, 
			nomeAtor1 = nomeAtor1, nomeAtor2 = nomeAtor2, projeto_id = idProjeto, 
			nomeRelacao = nomeRelacao)
		relacaoAtorAtor.save()
		return  {'status': 'OK', "idRelacao": relacaoAtorAtor.id}
	else:
		return {'status' : 'Erro'}

@csrf_exempt
@ajax_request
def carregar_ajax(request):
	idAtor1 = request.POST.get('idComponente1', False)
	idAtor2 = request.POST.get('idComponente2', False)
	idProjeto = request.POST.get('idProjeto', False)
	nomeRelacao = request.POST.get('nomeRelacao', False)

	if idAtor1 and idAtor2 and idProjeto and nomeRelacao:
		relacaoAtorAtor = get_object_or_None(RelacaoAtorAtor, idAtor1_id=idAtor1, idAtor2_id=idAtor2, projeto_id = idProjeto, nomeRelacao = nomeRelacao)
		if relacaoAtorAtor is None:
			return {'status' : 0}
		else:
			return {'status' : 1}
	else:
		return {'status' : 'ID do caso de uso inválido'}

@csrf_exempt
@ajax_request
def excluir_ajax(request):
	idRelacao = request.POST.get('idRelacao', False)
	print idRelacao
	if idRelacao:
		relacaoAtorAtor = get_object_or_None(RelacaoAtorAtor, id=idRelacao)
		if relacaoAtorAtor is None:
			return {'status' : 'Relação não encontrada'}
		else:
			relacaoAtorAtor.delete()
			return {'status': 'OK'}
	else:
		return {'status' : 'ID da relação inválida'}