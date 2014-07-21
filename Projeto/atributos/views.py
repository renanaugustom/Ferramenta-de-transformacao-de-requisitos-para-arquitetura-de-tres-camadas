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

from atributos.models import Atributo

@csrf_exempt
@ajax_request
def listar_ajax(request):
	idClasse = request.POST.get('idClasse', False)
	listaAtributos = Atributo.objects.filter(classe_id = idClasse)
	listaRetorno = []
	
	for atributo in listaAtributos:
		data = {}
		data = {'pk':atributo.pk,'nome':atributo.nome,'tipo':atributo.tipo.pk, 'nomeTipo':atributo.tipo.nome, 'modificador':atributo.modificador, 'getSet':atributo.getSet}
		listaRetorno.append(data.copy())

	json_data = simplejson.dumps( {'atributos':listaRetorno, 'status':'OK' } )
	return HttpResponse( json_data, mimetype='application/json' )

@csrf_exempt
@ajax_request
def cadastrar_ajax(request):
	nome = request.POST.get('nome', False)
	classe_id = request.POST.get('classe_id', False)
	tipo = request.POST.get('tipo', False)
	modificador = request.POST.get('modificador', False)
	getSet = request.POST.get('getSet', False)

	if nome and classe_id and tipo and modificador:
		atributo = Atributo(nome = nome, classe_id = classe_id, modificador = modificador, tipo_id = tipo, getSet = getSet)
		atributo.save()
		return  {'status': 'OK', "idAtributo": atributo.id}
	else:
		return {'status' : 'Erro'}

@csrf_exempt
@ajax_request
def excluir_ajax(request):
	idAtributo = request.POST.get('idAtributo', False)
	if idAtributo:
		atributo = get_object_or_None(Atributo, id=idAtributo)
		if atributo is None:
			return {'status' : 'Atributo não encontrado'}
		else:
			atributo.delete()
			return {'status': 'OK'}
	else:
		return {'status' : 'ID do atributo inválido'}

@csrf_exempt
@ajax_request
def verificanomeatributo_ajax(request):
	idClasse = request.POST.get('idClasse', False)
	nomeAtributo = request.POST.get('nomeAtributo', False)
	if idClasse and nomeAtributo:
		atributo = get_object_or_None(Atributo, nome = nomeAtributo, classe_id = idClasse)
		if atributo is None:
			return {'status' : 'OK', 'jaExiste' : 'false' } 
		else:
			return {'status' : 'OK', 'jaExiste' : 'true' } 
	else:
		return {'status' : 'Dados referente ao atributo são inválidos'}