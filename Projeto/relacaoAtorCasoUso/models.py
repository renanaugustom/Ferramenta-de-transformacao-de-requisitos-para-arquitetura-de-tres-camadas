# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

# Create your models here.
class RelacaoAtorCasoUso(models.Model):
	idAtor = models.ForeignKey('ator.Ator')
	nomeAtor = models.CharField(max_length=200)
	idCaso = models.ForeignKey('casosdeuso.CasosUso')
	nomeCaso = models.CharField(max_length=200)
	projeto = models.ForeignKey('projetos.Projeto')
	nomeRelacao = models.CharField(max_length=200)
	data_cadastro = models.DateTimeField('Data de cadastro', auto_now_add=True)
	
	def __unicode__(self):
		return self.nomeRelacao
