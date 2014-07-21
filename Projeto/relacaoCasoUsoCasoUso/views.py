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

from relacaoCasoUsoCasoUso.models import RelacaoCasoUsoCasoUso

@csrf_exempt
@ajax_request
def listar_ajax(request):
	idProjeto = request.POST.get('idProjeto', False)
	relacao_json = serializers.serialize('json', RelacaoCasoUsoCasoUso.objects.filter(projeto_id = idProjeto))
	relacao_list = simplejson.loads( relacao_json )
	json_data = simplejson.dumps( {'relacoesCasoUsoCasoUso':relacao_list, 'status':'OK' } )
	return HttpResponse( json_data, mimetype='application/json' )

@csrf_exempt
@ajax_request
def cadastrar_ajax(request):
	idCaso1 = request.POST.get('idComponente1', False)
	idCaso2 = request.POST.get('idComponente2', False)
	nomeCaso1 = request.POST.get('nomeComponente1', False)
	nomeCaso2 = request.POST.get('nomeComponente2', False)
	idProjeto = request.POST.get('idProjeto', False)
	nomeRelacao = request.POST.get('nomeRelacao', False)
	if idCaso1 and idCaso2 and nomeCaso1 and nomeCaso2 and idProjeto and nomeRelacao:
		relacaoCasoUsoCasoUso = RelacaoCasoUsoCasoUso(idCaso1_id = idCaso1, idCaso2_id = idCaso2, 
			nomeCaso1 = nomeCaso1, nomeCaso2 = nomeCaso2, projeto_id = idProjeto, 
			nomeRelacao = nomeRelacao)
		relacaoCasoUsoCasoUso.save()
		return  {'status': 'OK', "idRelacao": relacaoCasoUsoCasoUso.id}
	else:
		return {'status' : 'Erro'}

@csrf_exempt
@ajax_request
def carregar_ajax(request):
	idCaso1 = request.POST.get('idComponente1', False)
	idCaso2 = request.POST.get('idComponente2', False)
	idProjeto = request.POST.get('idProjeto', False)
	nomeRelacao = request.POST.get('nomeRelacao', False)

	if idCaso1 and idCaso2 and idProjeto and nomeRelacao:
		relacaoCasoUsoCasoUso = get_object_or_None(RelacaoCasoUsoCasoUso, idCaso1_id=idCaso1, idCaso2_id=idCaso2, projeto_id = idProjeto, nomeRelacao = nomeRelacao)
		if relacaoCasoUsoCasoUso is None:
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
		relacaoCasoUsoCasoUso = get_object_or_None(RelacaoCasoUsoCasoUso, id=idRelacao)
		if relacaoCasoUsoCasoUso is None:
			return {'status' : 'Relação não encontrada'}
		else:
			relacaoCasoUsoCasoUso.delete()
			return {'status': 'OK'}
	else:
		return {'status' : 'ID da relação inválida'}
