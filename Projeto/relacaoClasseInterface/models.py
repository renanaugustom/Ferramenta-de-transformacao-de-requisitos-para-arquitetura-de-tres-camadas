# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

# Create your models here.
class Implementacao(models.Model):
	projeto = models.ForeignKey('projetos.Projeto')
	classe = models.ForeignKey('classe.Classe', related_name='classe')
	interface = models.ForeignKey('classe.Classe', related_name='interface')
	data_cadastro = models.DateTimeField('Data de cadastro', auto_now_add=True)
