# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

# Create your models here.
class RelacaoAtorAtor(models.Model):
	idAtor1 = models.ForeignKey('ator.Ator', related_name='ator1')
	nomeAtor1 = models.CharField(max_length=200)
	idAtor2 = models.ForeignKey('ator.Ator', related_name='ator2')
	nomeAtor2 = models.CharField(max_length=200)
	projeto = models.ForeignKey('projetos.Projeto')
	nomeRelacao = models.CharField(max_length=200)
	data_cadastro = models.DateTimeField('Data de cadastro', auto_now_add=True)
	
	def __unicode__(self):
		return self.nomeRelacao
