# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

# Create your models here.
class Projeto(models.Model):
	nome = models.CharField(max_length=200)
	data_cadastro = models.DateTimeField('Data de cadastro', auto_now_add=True)

	def __unicode__(self):
		return self.nome