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
from atributos.models import Atributo
from heranca.models import Heranca
from metodos.models import Metodo
from parametros.models import Parametro
from projetos.models import Projeto
from relacaoClasseInterface.models import Implementacao

import zipfile

@csrf_exempt
@ajax_request
def gerarcodigo_ajax(request):
	idProjeto = request.POST.get('idProjeto', False)
	proj = get_object_or_None(Projeto, id=idProjeto)
	nomeArquivoProjeto = proj.nome

	zip = zipfile.ZipFile(nomeArquivoProjeto, 'w', zipfile.ZIP_DEFLATED)
	zip.writestr("IGenericRepository.java", gerarIRepositorioGenerico())
	zip.writestr("GenericRepository.java", gerarClasseRepositorioGenerico())

	listaClasses = Classe.objects.filter(projeto_id = idProjeto)
	listaHerancas = Heranca.objects.filter(projeto_id = idProjeto)
	listaImplementacoes = Implementacao.objects.filter(projeto_id = idProjeto)

	for classe in listaClasses:
		nomeClasse = (classe.nome)
		nomeArquivo = "%s.java" % (nomeClasse)
		zip.writestr(nomeArquivo, gerarClasses(classe, listaHerancas, listaImplementacoes))

		if classe.persistencia == 1:
			nomeRepositorio = "%sRepository" % (classe.nome)
			nomeArquivo = "I%s.java" % (nomeRepositorio)
			zip.writestr(nomeArquivo, gerarClasseRepositorio(classe))

			nomeController = "%sController.java" % (classe.nome)
			
			nomeService = "%sService" % (classe.nome)
			nomeArquivoService = "%s.java" % (nomeService)

			zip.writestr(nomeController, gerarClasseController(classe, nomeService, listaImplementacoes))
			zip.writestr(nomeArquivoService, gerarClasseService(classe, listaImplementacoes))
	
	zip.close()

def gerarIRepositorioGenerico():
	codigo = "public interface IGenericRepository<T> { \n\n" \
	"   void inserir(T t);\n\n" \
	"   void excluir(Object id);\n\n" \
	"   T procurar(Object id);\n\n" \
	"   void atualizar(T t);\n\n" \
	"}"
	return codigo

def gerarClasseRepositorioGenerico():
	codigo = "import java.lang.reflect.ParameterizedType; \n" \
	"public class GenericRepository<T> implements IGenericRepository<T> { \n\n" \
	"    private Class<T> type; \n\n" \
	"    public GenericRepository() { \n" \
	"        java.lang.reflect.Type t = getClass().getGenericSuperclass(); \n" \
    "        ParameterizedType pt = (ParameterizedType) t; \n" \
    "        type = (Class) pt.getActualTypeArguments()[0]; \n" \
    "    } \n\n" \
    "    @Override \n" \
    "    public void inserir(final T t) { \n\n" \
    "       //implemente aqui\n" \
    "    }\n\n"\
    "    @Override\n" \
    "    public void excluir(final Object id) {\n" \
   	"        //implemente aqui\n" \
    "    }\n\n"\
    "    @Override\n" \
    "    public T procurar(final Object id) {\n" \
    "        //implemente aqui \n" \
    "    }\n\n" \
    "    @Override\n" \
    "    public void atualizar(final T t) { \n" \
    "        //implemente aqui \n" \
	"    }\n\n" \
	"}"
	return codigo

def gerarClasses(classe, listaHerancas, listaImplementacoes):
	codigo = ""

	herancaClasse = filter(lambda x: x.classefilho_id == classe.pk, listaHerancas)
	implementacao = filter(lambda x: x.classe_id == classe.pk, listaImplementacoes)

	#definição da descrição da classe/interface
	if classe.isInterface == 0:
		if not herancaClasse:
			codigo = "%s class %s " % (classe.modificador, classe.nome)
		else:
			codigo = "%s class %s extends %s " % (classe.modificador, classe.nome, herancaClasse[0].classepai.nome)
	else:
		codigo = "%s interface %s " % (classe.modificador, classe.nome)


	if len(implementacao) > 0:
		codigo = "%s implements" % (codigo)
	for ind, relacao in enumerate(implementacao):
				if ind == len(implementacao) - 1 :
					codigo = "%s %s" % (codigo, relacao.interface.nome)
				else:
					codigo = "%s %s," % (codigo, relacao.interface.nome)

	codigo = "%s { \n" % (codigo)

	#definição de atributos
	codigo = "%s %s" % (codigo, gerarAtributosEConstrutor(classe))

	if(classe.isInterface == 1):
		#definição de métodos
		codigo = "%s %s" % (codigo, gerarMetodos(classe, 1))

	# final do código
	codigo = "%s \n}" % (codigo)

	return codigo

def gerarMetodos(classe, metodoInterface):
	codigo = ""
	listaMetodos = Metodo.objects.filter(classe_id = classe.pk)

	for metodo in listaMetodos:
		#definição dos parametros.
		listaParametros = Parametro.objects.filter(metodo_id = metodo.pk)
		stringParametros = "";

		if listaParametros:
			for ind, parametro in enumerate(listaParametros):
				if ind == len(listaParametros) - 1 :
					stringParametros = "%s %s %s" % (stringParametros, parametro.tipo, parametro.nome)
				else:
					stringParametros = "%s %s %s," % (stringParametros, parametro.tipo, parametro.nome)

		if(classe.isInterface == 0):
			codigo ="%s \n    %s %s %s (%s) {}" %(codigo, metodo.modificador, metodo.tipo, metodo.nome, stringParametros)
		else:
			if metodoInterface == 0:
				codigo ="%s \n    %s %s %s (%s) {} " %(codigo, metodo.modificador, metodo.tipo, metodo.nome, stringParametros)
			else:
				codigo ="%s \n    %s %s %s (%s); " %(codigo, metodo.modificador, metodo.tipo, metodo.nome, stringParametros)

	return codigo

def gerarAtributosEConstrutor(classe):
	stringParametrosConstrutor = ""
	corpoConstrutor = ""
	codigo = ""

	listaAtributos = Atributo.objects.filter(classe_id = classe.pk)
	for ind, atributo in enumerate(listaAtributos):
		codigo = "%s\n    %s %s %s; \n" % (codigo, atributo.modificador, atributo.tipo, atributo.nome)

		#Construtor
		if classe.isInterface == 0:
			if ind == len(listaAtributos) - 1 :
				stringParametrosConstrutor = "%s %s %s" % (stringParametrosConstrutor, atributo.tipo, atributo.nome)
			else:
				stringParametrosConstrutor = "%s %s %s," % (stringParametrosConstrutor, atributo.tipo, atributo.nome)
			
			corpoConstrutor = "%s\n		this.%s = %s;" % (corpoConstrutor, atributo.nome, atributo.nome)

		if atributo.getSet == 1:
			#get
			codigo = "%s\n    public %s get%s(){" \
			"\n		return %s; \n    }\n" % (codigo, atributo.tipo, atributo.nome, atributo.nome)

			#set
			codigo = "%s\n    public void set%s(%s %s ){" \
			"\n		this.%s = %s; \n    }\n" % (codigo, atributo.nome, atributo.tipo, atributo.nome, atributo.nome, atributo.nome)

	construtor = ""
	
	if classe.isInterface == 0:
		construtor = "\n    public %s(%s){   %s  \n    } \n" %(classe.nome, stringParametrosConstrutor, corpoConstrutor)
	
	codigo = "%s %s" %(codigo, construtor)
	return codigo

def gerarClasseController(classe, nomeService, listaImplementacoes):
	implementacao = filter(lambda x: x.classe_id == classe.pk, listaImplementacoes)

	codigo = "public class %sController{\n\n" % (classe.nome)
	
	codigo = "%s    %s = new %s(); \n\n" % (codigo, nomeService, nomeService)

	#definição de métodos
	codigo = "%s %s" % (codigo, gerarMetodos(classe, classe.isInterface))

	for relacao in implementacao:
		codigo = "%s %s" % (codigo, gerarMetodos(relacao.interface, 0))

	#final do codigo
	codigo = "%s\n}" % (codigo)

	return codigo

def gerarClasseService(classe, listaImplementacoes):
	implementacao = filter(lambda x: x.classe_id == classe.pk, listaImplementacoes)

	codigo = "public class %sService{\n\n" % (classe.nome)

	#definição de métodos
	codigo = "%s %s" % (codigo, gerarMetodos(classe, classe.isInterface))

	for relacao in implementacao:
		codigo = "%s %s" % (codigo, gerarMetodos(relacao.interface, 0))

	#final do codigo
	codigo = "%s\n}" % (codigo)

	return codigo

def gerarClasseRepositorio(classe):
	codigo = "public abstract class I%sRepository extends GenericRepository<%s>" % (classe.nome, classe.nome)
	codigo = "%s{ \n\n    //implemente aqui os metodos especificos \n\n}" % (codigo)
	return codigo