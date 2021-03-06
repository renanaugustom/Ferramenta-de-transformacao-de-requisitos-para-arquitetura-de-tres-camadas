# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

# Create your models here.
class Parametro(models.Model):
	nome = models.CharField(max_length=200)
	tipo = models.ForeignKey('tipoVarMet.Tipo')
	metodo = models.ForeignKey('metodos.Metodo')
	data_cadastro = models.DateTimeField('Data de cadastro', auto_now_add=True)
