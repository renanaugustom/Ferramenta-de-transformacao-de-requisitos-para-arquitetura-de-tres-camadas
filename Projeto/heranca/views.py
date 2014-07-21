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

from heranca.models import Heranca

@csrf_exempt
@ajax_request
def listar_ajax(request):
	idProjeto = request.POST.get('idProjeto', False)

	listaHeranca = Heranca.objects.filter(projeto_id = idProjeto)
	listaRetorno = []
	for heranca in listaHeranca:
		data = {}
		data = {'pk':heranca.pk,'classefilho_id':heranca.classefilho.pk,'classeFilho':heranca.classefilho.nome,
		 'classepai_id':heranca.classepai.pk, 'classePai': heranca.classepai.nome}
		listaRetorno.append(data.copy())

	json_data = simplejson.dumps( {'herancas':listaRetorno, 'status':'OK' } )
	return HttpResponse( json_data, mimetype='application/json' )

@csrf_exempt
@ajax_request
def cadastrar_ajax(request):
	idClasseFilho = request.POST.get('idClasseFilho', False)
	idClassePai = request.POST.get('idClassePai', False)
	idProjeto = request.POST.get('idProjeto', False)
	if idClasseFilho and idClassePai and idProjeto:
		heranca = Heranca(classefilho_id = idClasseFilho, classepai_id = idClassePai, 
			projeto_id = idProjeto)
		heranca.save()
		return  {'status': 'OK', "idHeranca": heranca.id}
	else:
		return {'status' : 'Erro'}

@csrf_exempt
@ajax_request
def excluir_ajax(request):
	idHeranca = request.POST.get('idHeranca', False)
	if idHeranca:
		heranca = get_object_or_None(Heranca, id=idHeranca)
		if heranca is None:
			return {'status' : 'Herança não encontrada'}
		else:
			heranca.delete()
			return {'status': 'OK'}
	else:
		return {'status' : 'ID da herança inválida'}

@csrf_exempt
@ajax_request
def verificarherancaexistente_ajax(request):
	idClasseFilho = request.POST.get('idClasseFilho', False)
	idClassePai = request.POST.get('idClassePai', False)
	if idClasseFilho and idClassePai:
		heranca = get_object_or_None(Heranca, classefilho_id = idClasseFilho, classepai_id=idClassePai)
		herancaMultipla = get_object_or_None(Heranca, classefilho_id = idClasseFilho)
		if heranca is None:
			if herancaMultipla is None:
				return {'status' : 'OK', 'jaExiste' : 'false', 'herancaMultipla' : 'false' }
			else:
				return {'status' : 'OK', 'jaExiste' : 'true', 'herancaMultipla' : 'true' }
		else:
			return {'status' : 'OK', 'jaExiste' : 'true', 'herancaMultipla' : 'false' } 
	else:
		return {'status' : 'Dados referente a herança são inválidos'}