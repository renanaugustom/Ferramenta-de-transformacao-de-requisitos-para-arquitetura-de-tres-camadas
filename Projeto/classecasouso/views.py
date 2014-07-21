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

from classecasouso.models import ClasseCasoUso

@csrf_exempt
@ajax_request
def listar_ajax(request):
	idClasse = request.POST.get('idClasse', False)
	listaClasseCasoUso = ClasseCasoUso.objects.filter(classe_id = idClasse)
	listaRetorno = []
	for classeCasoUso in listaClasseCasoUso:
		data = {}
		data = {'pk':classeCasoUso.pk,'casouso_id':classeCasoUso.casouso_id,'nomeCasoUso':classeCasoUso.casouso.nome}
		listaRetorno.append(data.copy())

	json_data = simplejson.dumps( {'classecasousos':listaRetorno, 'status':'OK' } )
	return HttpResponse( json_data, mimetype='application/json' )

@csrf_exempt
@ajax_request
def cadastrar_ajax(request):
	classe_id = request.POST.get('classe_id', False)
	casouso_id = request.POST.get('casouso_id', False)
	
	if classe_id and casouso_id:
		classecasouso = ClasseCasoUso(casouso_id = casouso_id, classe_id = classe_id)
		classecasouso.save()
		return  {'status': 'OK', "idRelacao": classecasouso.id}
	else:
		return {'status' : 'Erro'}

@csrf_exempt
@ajax_request
def excluir_ajax(request):
	idRelacao = request.POST.get('idRelacao', False)
	if idRelacao:
		classecasouso = get_object_or_None(ClasseCasoUso, id=idRelacao)
		if classecasouso is None:
			return {'status' : 'Relação não encontrada'}
		else:
			classecasouso.delete()
			return {'status': 'OK'}
	else:
		return {'status' : 'ID da relação inválida'}

@csrf_exempt
@ajax_request
def verificarelacaoexistente_ajax(request):
	classe_id = request.POST.get('classe_id', False)
	casouso_id = request.POST.get('casouso_id', False)
	if classe_id and casouso_id:
		classecasouso = get_object_or_None(ClasseCasoUso, classe_id = classe_id, casouso_id = casouso_id)
		if classecasouso is None:
			return {'status' : 'OK', 'jaExiste' : 'false' } 
		else:
			return {'status' : 'OK', 'jaExiste' : 'true' } 
	else:
		return {'status' : 'Dados referente a relação são inválidos'}
