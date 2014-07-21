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

from casosdeuso.models import CasosUso

# Create your views here.
@render_to('casosdeuso/casosdeuso.html')
def index(request):
    return {'status': 'OK'}

@csrf_exempt
@ajax_request
def listar_ajax(request):
	idProjeto = request.POST.get('idProjeto', False)
	casosuso_json = serializers.serialize('json', CasosUso.objects.filter(projeto_id = idProjeto))
	casosuso_list = simplejson.loads( casosuso_json )
	json_data = simplejson.dumps( {'casosuso':casosuso_list, 'status':'OK' } )
	return HttpResponse( json_data, mimetype='application/json' )

@csrf_exempt
@ajax_request
def cadastrar_ajax(request):
	nomeCasoUso = request.POST.get('nomeCasoUso', False)
	descricao = request.POST.get('descricao', False)
	projeto_id = request.POST.get('projeto_id', False)
	if nomeCasoUso and projeto_id:
		casoUso = CasosUso(nome = nomeCasoUso, descricao = descricao, projeto_id = projeto_id)
		casoUso.save()
		return  {'status': 'OK', "idCasoUso": casoUso.id}
	else:
		return {'status' : 'Erro'}

@csrf_exempt
@ajax_request
def carregar_ajax(request):
	idCasoUso = request.POST.get('idCasoUso', False)
	if idCasoUso:
		casoUso = get_object_or_None(CasosUso, id=idCasoUso)
		if casoUso is None:
			return {'status' : 'Caso de uso não encontrado'}
		else:
			return {
			   	'nomeCasoUso': casoUso.nome,
			   	'descricao': casoUso.descricao,
			   	'status': 'OK'
			}
	else:
		return {'status' : 'ID do caso de uso inválido'}

@csrf_exempt
@ajax_request
def editar_ajax(request):
	idCasoUso = request.POST.get('idCasoUso', False)
	nomeCasoUso = request.POST.get('nomeCasoUso', False)
	descricao = request.POST.get('descricao', False)
	if idCasoUso and nomeCasoUso:
		casoUso = get_object_or_None(CasosUso, id=idCasoUso)
		if casoUso is None:
			return {'status' : 'Caso de uso não encontrado'}
		else:
			casoUso.nome = nomeCasoUso
			casoUso.descricao = descricao
			casoUso.save()
			return {'status': 'OK'}
	else:
		return {'status' : 'Dados referente ao caso de uso inválido'}

@csrf_exempt
@ajax_request
def excluir_ajax(request):
	idCasoUso = request.POST.get('idCasoUso', False)
	if idCasoUso:
		casoUso = get_object_or_None(CasosUso, id=idCasoUso)
		if casoUso is None:
			return {'status' : 'Caso de uso não encontrado'}
		else:
			casoUso.delete()
			return {'status': 'OK'}
	else:
		return {'status' : 'ID do caso de uso inválido'}