# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

# Create your models here.
class ClasseCasoUso(models.Model):
	classe = models.ForeignKey('classe.Classe')
	casouso = models.ForeignKey('casosdeuso.CasosUso')		
	data_cadastro = models.DateTimeField('Data de cadastro', auto_now_add=True)
