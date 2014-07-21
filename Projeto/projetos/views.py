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

from projetos.models import Projeto

class ProjetoForm(ModelForm):
    class Meta:
        model = Projeto

@render_to('projetos/projetos.html')
def index(request):
    return {'status': 'OK'}

@csrf_exempt
@ajax_request
def listar_ajax(request):
	projetos_json = serializers.serialize('json', Projeto.objects.all() )
	projetos_list = simplejson.loads( projetos_json )
	json_data = simplejson.dumps( {'projetos':projetos_list, 'status':'OK' } )
	return HttpResponse( json_data, mimetype='application/json' )

@csrf_exempt
@ajax_request
def cadastrar_ajax(request):
	nomeProjeto = request.POST.get('texto', False)
	if nomeProjeto:
		p = Projeto(nome = nomeProjeto)
		p.save()
		return  {'status': 'OK', 'idProjeto':p.id}
	else:
		return {'status' : 'Erro'}

@csrf_exempt
@ajax_request
def carregar_ajax(request):
	idProjeto = request.POST.get('idProjeto', False)
	if idProjeto:
		projeto = get_object_or_None(Projeto, id=idProjeto)
		if projeto is None:
			return {'status' : 'Projeto não encontrado'}
		else:
			return {
			   	'nomeProjeto': projeto.nome,
			   	'status': 'OK'
			}
	else:
		return {'status' : 'ID do projeto inválido'}

@csrf_exempt
@ajax_request
def editar_ajax(request):
	idProjeto = request.POST.get('idProjeto', False)
	nomeProjeto = request.POST.get('nomeProjeto', False)
	if idProjeto and nomeProjeto:
		projeto = get_object_or_None(Projeto, id=idProjeto)
		if projeto is None:
			return {'status' : 'Projeto não encontrado'}
		else:
			projeto.nome = nomeProjeto
			projeto.save()
			return {'status': 'OK'}
	else:
		return {'status' : 'ID ou nome do projeto inválido'}

@csrf_exempt
@ajax_request
def excluir_ajax(request):
	idProjeto = request.POST.get('idProjeto', False)
	if idProjeto:
		projeto = get_object_or_None(Projeto, id=idProjeto)
		if projeto is None:
			return {'status' : 'Projeto não encontrado'}
		else:
			projeto.delete()
			return {'status': 'OK'}
	else:
		return {'status' : 'ID do projeto inválido'}