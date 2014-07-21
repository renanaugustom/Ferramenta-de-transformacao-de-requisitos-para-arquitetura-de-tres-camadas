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

from parametros.models import Parametro

@csrf_exempt
@ajax_request
def listar_ajax(request):
	idMetodo = request.POST.get('idMetodo', False)

	listaParametros = Parametro.objects.filter(metodo_id = idMetodo)
	listaRetorno = []
	
	for parametro in listaParametros:
		data = {}
		data = {'pk':parametro.pk,'nome':parametro.nome,'tipo':parametro.tipo.pk, 'nomeTipo':parametro.tipo.nome}
		listaRetorno.append(data.copy())

	json_data = simplejson.dumps( {'parametros':listaRetorno, 'status':'OK' } )
	return HttpResponse( json_data, mimetype='application/json' )

@csrf_exempt
@ajax_request
def cadastrar_ajax(request):
	nome = request.POST.get('nome', False)
	metodo_id = request.POST.get('metodo_id', False)
	tipo_id = request.POST.get('tipo_id', False)
	
	if nome and metodo_id and tipo_id:
		parametro = Parametro(nome = nome, metodo_id = metodo_id, tipo_id = tipo_id)
		parametro.save()
		return  {'status': 'OK', "idParametro": parametro.id}
	else:
		return {'status' : 'Erro'}

@csrf_exempt
@ajax_request
def excluir_ajax(request):
	idParametro = request.POST.get('idParametro', False)
	if idParametro:
		parametro = get_object_or_None(Parametro, id=idParametro)
		if parametro is None:
			return {'status' : 'Parâmetro não encontrado'}
		else:
			parametro.delete()
			return {'status': 'OK'}
	else:
		return {'status' : 'ID do parâmetro inválido'}

@csrf_exempt
@ajax_request
def verificanomeparametro_ajax(request):
	nomeParametro = request.POST.get('nomeParametro', False)
	metodo_id = request.POST.get('metodo_id', False)
	if nomeParametro and metodo_id:
		parametro = get_object_or_None(Parametro, nome = nomeParametro, metodo_id = metodo_id)
		if parametro is None:
			return {'status' : 'OK', 'jaExiste' : 'false' } 
		else:
			return {'status' : 'OK', 'jaExiste' : 'true' } 
	else:
		return {'status' : 'Dados referente ao parâmetro são inválidos'}
