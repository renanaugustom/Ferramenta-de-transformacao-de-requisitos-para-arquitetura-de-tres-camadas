# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

# Create your models here.
class Atributo(models.Model):
	nome = models.CharField(max_length=200)
	modificador = models.CharField(max_length=100)
	tipo = models.ForeignKey('tipoVarMet.Tipo')
	classe = models.ForeignKey('classe.Classe')
	data_cadastro = models.DateTimeField('Data de cadastro', auto_now_add=True)
	getSet = models.IntegerField()

	def __unicode__(self):
		return self.nome
