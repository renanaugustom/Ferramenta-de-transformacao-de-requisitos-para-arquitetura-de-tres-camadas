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

from classe.models import Classe

@render_to('classe/classe.html')
def index(request):
    return {'status': 'OK'}

@csrf_exempt
@ajax_request
def listar_ajax(request):
	idProjeto = request.POST.get('idProjeto', False)
	classe_json = serializers.serialize('json', Classe.objects.filter(projeto_id = idProjeto))
	classe_list = simplejson.loads( classe_json )
	json_data = simplejson.dumps( {'classes':classe_list, 'status':'OK' } )
	return HttpResponse( json_data, mimetype='application/json' )

@csrf_exempt
@ajax_request
def cadastrar_ajax(request):
	nome = request.POST.get('nome', False)
	modificador = request.POST.get('modificador', False)
	persistencia = request.POST.get('persistencia', False)
	projeto_id = request.POST.get('projeto_id', False)
	isInterface = request.POST.get('isInterface', False)
	
	if nome and modificador and projeto_id:
		classe = Classe(nome = nome, modificador = modificador, persistencia = persistencia, isInterface = isInterface, projeto_id = projeto_id)
		classe.save()
		return  {'status': 'OK', "idClasse": classe.id}
	else:
		return {'status' : 'Erro'}

@csrf_exempt
@ajax_request
def carregar_ajax(request):
	idClasse = request.POST.get('idClasse', False)
	if idClasse:
		classe = get_object_or_None(Classe, id=idClasse)
		if classe is None:
			return {'status' : 'Classe não encontrada'}
		else:
			return {
			   	'nome': classe.nome,
			   	'modificador' : classe.modificador,
			   	'persistencia' : classe.persistencia,
			   	'isInterface' : classe.isInterface,
			   	'status': 'OK'
			}
	else:
		return {'status' : 'ID da classe inválida'}

@csrf_exempt
@ajax_request
def editar_ajax(request):
	idClasse = request.POST.get('idClasse', False)
	nomeClasse = request.POST.get('nomeClasse', False)
	modificador = request.POST.get('modificador', False)
	persistencia = request.POST.get('persistencia', False)

	if idClasse and nomeClasse and modificador:
		classe = get_object_or_None(Classe, id=idClasse)
		if classe is None:
			return {'status' : 'Classe não encontrada'}
		else:
			classe.nome = nomeClasse
			classe.modificador = modificador
			classe.persistencia = persistencia
			classe.save()
			return {'status': 'OK'}
	else:
		return {'status' : 'Dados referente a classe são inválidos'}

@csrf_exempt
@ajax_request
def excluir_ajax(request):
	idClasse = request.POST.get('idClasse', False)
	if idClasse:
		classe = get_object_or_None(Classe, id=idClasse)
		if classe is None:
			return {'status' : 'Classe não encontrada'}
		else:
			classe.delete()
			return {'status': 'OK'}
	else:
		return {'status' : 'ID da classe inválida'}

@csrf_exempt
@ajax_request
def verificanomeclasse_ajax(request):
	idClasse = request.POST.get('idClasse', False)
	nomeClasse = request.POST.get('nomeClasse', False)
	projeto_id = request.POST.get('projeto_id', False)
	if idClasse and nomeClasse and projeto_id:
		classe = Classe.objects.filter(nome = nomeClasse, projeto_id = projeto_id).exclude(pk = idClasse)
		if len(classe) == 0:
			return {'status' : 'OK', 'jaExiste' : 'false' } 
		else:
			return {'status' : 'OK', 'jaExiste' : 'true' } 
	else:
		return {'status' : 'Dados referente a classe são inválidos'}
