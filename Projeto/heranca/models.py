# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

# Create your models here.
class Heranca(models.Model):
	projeto = models.ForeignKey('projetos.Projeto')
	classefilho = models.ForeignKey('classe.Classe', related_name='classefilho')
	classepai = models.ForeignKey('classe.Classe', related_name='classepai')
	data_cadastro = models.DateTimeField('Data de cadastro', auto_now_add=True)
