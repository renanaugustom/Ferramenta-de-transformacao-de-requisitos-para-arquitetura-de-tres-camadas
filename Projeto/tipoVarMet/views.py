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

from tipoVarMet.models import Tipo

@csrf_exempt
@ajax_request
def listar_ajax(request):
	tipo_json = serializers.serialize('json', Tipo.objects.all())
	tipo_list = simplejson.loads( tipo_json )
	json_data = simplejson.dumps( {'tipos':tipo_list, 'status':'OK' } )
	return HttpResponse( json_data, mimetype='application/json' )

@csrf_exempt
@ajax_request
def cadastrar_ajax(request):
	nome = request.POST.get('nome', False)
	
	if nome:
		tipo = Tipo(nome = nome)
		tipo.save()
		return  {'status': 'OK', "idTipo": tipo.id}
	else:
		return {'status' : 'Erro'}

@csrf_exempt
@ajax_request
def excluir_ajax(request):
	idTipo = request.POST.get('idTipo', False)
	if idTipo:
		tipo = get_object_or_None(Tipo, id=idTipo)
		if tipo is None:
			return {'status' : 'Tipo não encontrado'}
		else:
			tipo.delete()
			return {'status': 'OK'}
	else:
		return {'status' : 'ID do tipo inválido'}

@csrf_exempt
@ajax_request
def verificanometipo_ajax(request):
	nomeTipo = request.POST.get('nomeTipo', False)
	if nomeTipo:
		tipo = get_object_or_None(Tipo, nome = nomeTipo)
		if tipo is None:
			return {'status' : 'OK', 'jaExiste' : 'false' } 
		else:
			return {'status' : 'OK', 'jaExiste' : 'true' } 
	else:
		return {'status' : 'Dados referente ao tipo são inválidos'}
