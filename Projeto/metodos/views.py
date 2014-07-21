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

from metodos.models import Metodo

@csrf_exempt
@ajax_request
def listar_ajax(request):
	idClasse = request.POST.get('idClasse', False)

	listaMetodos =  Metodo.objects.filter(classe_id = idClasse)
	listaRetorno = []
	
	for metodo in listaMetodos:
		data = {}
		data = {'pk':metodo.pk,'nome':metodo.nome,'tipo':metodo.tipo.pk, 'nomeTipo':metodo.tipo.nome, 'modificador':metodo.modificador}
		listaRetorno.append(data.copy())

	json_data = simplejson.dumps( {'metodos':listaRetorno, 'status':'OK' } )
	return HttpResponse( json_data, mimetype='application/json' )

@csrf_exempt
@ajax_request
def cadastrar_ajax(request):
	nome = request.POST.get('nome', False)
	classe_id = request.POST.get('classe_id', False)
	tipo_id = request.POST.get('tipo_id', False)
	modificador = request.POST.get('modificador', False)
	
	if nome and classe_id and tipo_id and modificador:
		metodo = Metodo(nome = nome, classe_id = classe_id, modificador = modificador, tipo_id = tipo_id)
		metodo.save()
		return  {'status': 'OK', "idMetodo": metodo.id}
	else:
		return {'status' : 'Erro'}

@csrf_exempt
@ajax_request
def excluir_ajax(request):
	idMetodo = request.POST.get('idMetodo', False)
	if idMetodo:
		metodo = get_object_or_None(Metodo, id=idMetodo)
		if metodo is None:
			return {'status' : 'Metodo não encontrado'}
		else:
			metodo.delete()
			return {'status': 'OK'}
	else:
		return {'status' : 'ID do metodo inválido'}

@csrf_exempt
@ajax_request
def verificanomemetodo_ajax(request):
	idClasse = request.POST.get('idClasse', False)
	nomeMetodo = request.POST.get('nomeMetodo', False)
	if idClasse and nomeMetodo:
		metodo = get_object_or_None(Metodo, nome = nomeMetodo, classe_id = idClasse)
		if metodo is None:
			return {'status' : 'OK', 'jaExiste' : 'false' } 
		else:
			return {'status' : 'OK', 'jaExiste' : 'true' } 
	else:
		return {'status' : 'Dados referente ao metodo são inválidos'}
