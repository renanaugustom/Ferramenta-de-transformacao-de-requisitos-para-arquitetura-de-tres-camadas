# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

# Create your models here.
class RelacaoCasoUsoCasoUso(models.Model):
	idCaso1 = models.ForeignKey('casosdeuso.CasosUso', related_name='caso1')
	nomeCaso1 = models.CharField(max_length=200)
	idCaso2 = models.ForeignKey('casosdeuso.CasosUso', related_name='caso2')
	nomeCaso2 = models.CharField(max_length=200)
	projeto = models.ForeignKey('projetos.Projeto')
	nomeRelacao = models.CharField(max_length=200)
	data_cadastro = models.DateTimeField('Data de cadastro', auto_now_add=True)
	
	def __unicode__(self):
		return self.nomeRelacao
