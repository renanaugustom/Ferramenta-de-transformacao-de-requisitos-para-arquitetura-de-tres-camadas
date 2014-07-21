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

from ator.models import Ator

@csrf_exempt
@ajax_request
def listar_ajax(request):
	idProjeto = request.POST.get('idProjeto', False)
	ator_json = serializers.serialize('json', Ator.objects.filter(projeto_id = idProjeto))
	ator_list = simplejson.loads( ator_json )
	json_data = simplejson.dumps( {'atores':ator_list, 'status':'OK' } )
	return HttpResponse( json_data, mimetype='application/json' )

@csrf_exempt
@ajax_request
def cadastrar_ajax(request):
	nomeAtor = request.POST.get('nomeAtor', False)
	projeto_id = request.POST.get('projeto_id', False)
	if nomeAtor and projeto_id:
		ator = Ator(nome = nomeAtor, projeto_id = projeto_id)
		ator.save()
		return  {'status': 'OK', "idAtor": ator.id}
	else:
		return {'status' : 'Erro'}

@csrf_exempt
@ajax_request
def carregar_ajax(request):
	idAtor = request.POST.get('idAtor', False)
	if idAtor:
		ator = get_object_or_None(Ator, id=idAtor)
		if ator is None:
			return {'status' : 'Ator não encontrado'}
		else:
			return {
			   	'nomeAtor': ator.nome,
			   	'status': 'OK'
			}
	else:
		return {'status' : 'ID do ator inválido'}

@csrf_exempt
@ajax_request
def editar_ajax(request):
	idAtor = request.POST.get('idAtor', False)
	nomeAtor = request.POST.get('nomeAtor', False)

	if idAtor and nomeAtor:
		ator = get_object_or_None(Ator, id=idAtor)
		if ator is None:
			return {'status' : 'Ator não encontrado'}
		else:
			ator.nome = nomeAtor
			ator.save()
			return {'status': 'OK'}
	else:
		return {'status' : 'Dados referente ao ator inválido'}

@csrf_exempt
@ajax_request
def excluir_ajax(request):
	idAtor = request.POST.get('idAtor', False)
	if idAtor:
		ator = get_object_or_None(Ator, id=idAtor)
		if ator is None:
			return {'status' : 'Ator não encontrado'}
		else:
			ator.delete()
			return {'status': 'OK'}
	else:
		return {'status' : 'ID do ator inválido'}