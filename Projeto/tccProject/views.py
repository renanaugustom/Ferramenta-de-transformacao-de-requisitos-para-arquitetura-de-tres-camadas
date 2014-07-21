# -*- coding: utf-8 -*-
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, render
from django.template import RequestContext, Context


# Create your views here.
def index(request):
	return render_to_response(
		'index.html',
		context_instance=RequestContext(request))
