$(
	function() {
		DataTable("dataTable_relacoes");

		$(window).load
	    (
	      function () {
	        var codProjeto = GetURLParameter('cp');
	        listarRelacoes(codProjeto);
	      }
	    );

	    $("#btnInserirRelacao").click(
	       	function()
	    	{
	    		var idComponente1 = $("#cmbComponente1").val().split("#")[0];
	    		var idComponente2 = $("#cmbComponente2").val().split("#")[0];
	    		var tipoComponente1 = $("#cmbComponente1").val().split("#")[1];
	    		var tipoComponente2 = $("#cmbComponente2").val().split("#")[1];
	    		var nomeComponente1 = $("#cmbComponente1 option:selected").text();
	    		var nomeComponente2 = $("#cmbComponente2 option:selected").text();
	    		var idRelacao = $("#cmbTipoRelacao").val();
	    		var nomeRelacao = $("#cmbTipoRelacao option:selected").text();
	    		var idProjeto = GetURLParameter('cp');

	    		if(idComponente1 == "-1" || idComponente2 == "-1" || idRelacao == "-1"){
	    			$("#lbMensagemAlerta").text("Selecione os componentes e o tipo de relação !");
	    			$("#modalAlerta").modal("show");
	    		}else
	    		{
	    			//1 - Ator/Ator, 2 - Ator/CasoUso, 3 - CasoUso/CasuUso
	    			var tipoRelacao = (tipoComponente1 == "ator" && tipoComponente2 == "ator")? 1 :
	    				((tipoComponente1 == "ator" && tipoComponente2 == "casouso") || 
	    					(tipoComponente1 == "casouso" && tipoComponente2 == "ator"))? 2 : 3 ;

	    			if(idComponente1 == idComponente2 && tipoComponente1 == tipoComponente2)
	    			{
	    				$("#lbMensagemAlerta").text("Não é possível inserir uma relação entre um mesmo componente !");
						$("#modalAlerta").modal("show");
	    			}
	    			else
	    			{
    					if(tipoRelacao == 2 && tipoComponente1 == "casouso")
		    			{
		    				//troca o NOME
		    				var aux = nomeComponente1;
		    				nomeComponente1 = nomeComponente2;
		    				nomeComponente2 = aux;

		    				//troca o id
		    				aux = idComponente1;
		    				idComponente1 = idComponente2;
		    				idComponente2 = aux;
		    			}

		    			$.when(verificaRelacaoExistente(idComponente1, idComponente2, idProjeto,
	  						nomeRelacao, tipoRelacao)).done(
		    				function(jaExiste)
		    				{
		    					if(jaExiste == 1)
		    					{
		    						$("#lbMensagemAlerta").text("Esta relação já existe !");
		    						$("#modalAlerta").modal("show");
		    					}else
		    					{
			    					$.when(cadastrarRelacao(idComponente1, idComponente2, nomeComponente1, 
					    				nomeComponente2, idProjeto, nomeRelacao, tipoRelacao)).done(
					    				function(idRelacao)
					    				{
					    					//0 - idRelacao, 1 - nomeComp1, 2 - nomeComp2, 3 - nomeRelacao, 4 tipoRelacao
					    					var relacao = [idRelacao, nomeComponente1, nomeComponente2, 
					    						nomeRelacao, tipoRelacao];
					    					PopulaTableRelacao(relacao);
					    					if(tipoRelacao == 1){
					    						_arrayRelacaoAtorAtor[idRelacao] = relacao;
					    					}else
					    					{
					    						if(tipoRelacao == 2)
					    						{
					    							_arrayRelacaoAtorCasoUso[idRelacao] = relacao;
					    						}else
					    						{
					    							_arrayRelacaoCasoUsoCasoUso[idRelacao] = relacao;
					    						}
					    					}
					    				}
					    			);
				    			}
		    				}
		    			);
	    			}		
	    		}
	    	}
	    );

		$("#dataTable_relacoes").delegate(
	      "a.excluir","click", function()
	      {
	      	var idRelacao = $(this).prop("id").split("#")[0];
	        var tipoRelacao = $(this).prop("id").split("#")[1];
	        
	        $.when(excluirRelacao(idRelacao, tipoRelacao)).done(
	            function()
	            {
	            	recarregarRelacoes();//recarrega o datatable
	            }
          	);
	      }
	    );
	}
);

var _arrayRelacaoAtorAtor = new Array();
var _arrayRelacaoAtorCasoUso = new Array();
var _arrayRelacaoCasoUsoCasoUso = new Array();

/*Função para verificar se componentes foram selecionados e liberar combo
de tipo de relações*/
function verificaComponentesSelecionados()
{
	var codComponente1 = $("#cmbComponente1").val();
	var codComponente2 = $("#cmbComponente2").val();

	if(codComponente1 != "-1" && codComponente2 != "-1")
	{
		$("#cmbTipoRelacao").removeAttr("disabled");

		//Analisar as relações que a combinação pode ter.
		var tipoComponente1 = codComponente1.split('#')[1];
		var tipoComponente2 = codComponente2.split('#')[1];
		populaComboTipoRelacao(tipoComponente1, tipoComponente2);

	}else{
		$("#cmbTipoRelacao").val("-1");
		$("#cmbTipoRelacao").attr("disabled", 'disabled');
	}
}

function listarRelacoes(idProjeto)
{
  var listarRelacoes;
  
  //Relacao Ator Ator
  $.ajax({url: "/relacaoAtorAtor/listar_ajax",
    type: 'POST', async:false,
    data: {idProjeto:idProjeto},
    success: function(data){
      if(data.status == "OK")
      {
        listarRelacoes = data['relacoesAtorAtor'];
        for (var i=0; i<listarRelacoes.length; i++) 
	    {
	    	//0 - idRelacao, 1 - nomeComp1, 2 - nomeComp2, 3 - nomeRelacao, 4 tipoRelacao
			var relacao = [listarRelacoes[i].pk, listarRelacoes[i].fields.nomeAtor1, 
				listarRelacoes[i].fields.nomeAtor2, listarRelacoes[i].fields.nomeRelacao, 1];
			_arrayRelacaoAtorAtor[listarRelacoes[i].pk] = relacao;
			PopulaTableRelacao(relacao);
	    }
      }else
      {
        $("#lbMensagemErro").text(data.status);
        $("#modalErro").modal("show");
      }
    }
  });

  //Relacao Ator Ator
  $.ajax({url: "/relacaoAtorCasoUso/listar_ajax",
    type: 'POST', async:false,
    data: {idProjeto:idProjeto},
    success: function(data){
      if(data.status == "OK")
      {
        listarRelacoes = data['relacoesAtorCasoUso'];
        for (var i=0; i<listarRelacoes.length; i++) 
	    {
	    	//0 - idRelacao, 1 - nomeComp1, 2 - nomeComp2, 3 - nomeRelacao, 4 tipoRelacao
			var relacao = [listarRelacoes[i].pk, listarRelacoes[i].fields.nomeAtor, 
				listarRelacoes[i].fields.nomeCaso, listarRelacoes[i].fields.nomeRelacao, 2];
			_arrayRelacaoAtorCasoUso[listarRelacoes[i].pk] = relacao;
			PopulaTableRelacao(relacao);
	    }
      }else
      {
        $("#lbMensagemErro").text(data.status);
        $("#modalErro").modal("show");
      }
    }
  });

  //Relacao Ator Ator
  $.ajax({url: "/relacaoCasoUsoCasoUso/listar_ajax",
    type: 'POST', async:false,
    data: {idProjeto:idProjeto},
    success: function(data){
      if(data.status == "OK")
      {
        listarRelacoes = data['relacoesCasoUsoCasoUso'];
        for (var i=0; i<listarRelacoes.length; i++) 
	    {
	    	//0 - idRelacao, 1 - nomeComp1, 2 - nomeComp2, 3 - nomeRelacao, 4 tipoRelacao
			var relacao = [listarRelacoes[i].pk, listarRelacoes[i].fields.nomeCaso1, 
				listarRelacoes[i].fields.nomeCaso2, listarRelacoes[i].fields.nomeRelacao, 3];
			_arrayRelacaoCasoUsoCasoUso[listarRelacoes[i].pk] = relacao;
			PopulaTableRelacao(relacao);
	    }
      }else
      {
        $("#lbMensagemErro").text(data.status);
        $("#modalErro").modal("show");
      }
    }
  }); 
}

function verificaRelacaoExistente(idComponente1, idComponente2, idProjeto,
  nomeRelacao, tipoRelacao){
	
	var jaExiste = 0; //começa na condição de que não existe

	var newUrl = (tipoRelacao == 1)? '/relacaoAtorAtor/carregar_ajax' :
		(tipoRelacao == 2)? '/relacaoAtorCasoUso/carregar_ajax' : '/relacaoCasoUsoCasoUso/carregar_ajax';

	$.ajax({url: newUrl,
		type: 'POST', async:false,
		data: {idComponente1:idComponente1, idComponente2:idComponente2, 
			idProjeto: idProjeto, nomeRelacao: nomeRelacao},
		success: function(data)
		{
		  if(data.status != "0" && data.status != "1")
		  {
		    $("#modalErro").modal("show");
		  }else{
		  	if(data.status == "1")
		    	jaExiste = 1;
		  }
		}
	});
	return jaExiste;
}

function populaComboTipoRelacao(tipoComponente1, tipoComponente2)
{
	//Limpa a combo
	$("#cmbTipoRelacao").empty();
	//Popula com a opção padrão	
	$("#cmbTipoRelacao").append("<option value='-1'> -- Selecione -- </option>")
	
	if(tipoComponente1 == "ator" && tipoComponente2 == "ator")
	{
		$("#cmbTipoRelacao").append("<option value='generalizacao'>Generalização</option>");
	}else
	{
		if( (tipoComponente1 == "ator" && tipoComponente2 == "casouso") || 
			(tipoComponente1 == "casouso" && tipoComponente2 == "ator") )
		{
			$("#cmbTipoRelacao").append("<option value='associacao'>Associação</option>");
		}else{
			if(tipoComponente1 == "casouso" && tipoComponente2 == "casouso"){
				$("#cmbTipoRelacao").append("<option value='extensao'>Extensão</option>");
				$("#cmbTipoRelacao").append("<option value='generalizacao'>Generalização</option>");
				$("#cmbTipoRelacao").append("<option value='inclusao'>Inclusão</option>");
			}
		}
	}
}

function cadastrarRelacao(idComponente1, idComponente2, nomeComponente1, nomeComponente2, 
	idProjeto, nomeRelacao, tipoRelacao)
{

  var idRelacao = null;//devolver o i

  var newUrl = (tipoRelacao == 1)? '/relacaoAtorAtor/cadastrar_ajax' :
  	(tipoRelacao == 2)? '/relacaoAtorCasoUso/cadastrar_ajax' : '/relacaoCasoUsoCasoUso/cadastrar_ajax';

  $.ajax({url: newUrl,
    type: 'POST', async:false,
    data: {idComponente1:idComponente1, idComponente2:idComponente2, nomeComponente1: nomeComponente1,
    	nomeComponente2:nomeComponente2, idProjeto: idProjeto, nomeRelacao: nomeRelacao},
    success: function(data)
    {
      if(data.status != "OK")
      {
        $("#modalErro").modal("show");
      }else{
        idRelacao = data.idRelacao;
      }
    }
  });
  return idRelacao;
}

function excluirRelacao(idRelacao, tipoRelacao)
{
	var newUrl = (tipoRelacao == 1)? '/relacaoAtorAtor/excluir_ajax' :
  	(tipoRelacao == 2)? '/relacaoAtorCasoUso/excluir_ajax' : '/relacaoCasoUsoCasoUso/excluir_ajax';

	$.ajax({url: newUrl,
		type: 'POST', async:false,
		data: {idRelacao:idRelacao},
		success: function(data)
		{
		  if(data.status == "OK")
		  {
		  	if(tipoRelacao == 1){
		    	_arrayRelacaoAtorAtor[idRelacao] = null; //remove do array
			}else{
				if(tipoRelacao == 2)
				{
					_arrayRelacaoAtorCasoUso[idRelacao] = null;
				}else
				{
					_arrayRelacaoCasoUsoCasoUso[idRelacao] = null;
				}
			}
		  }else
		  {
		    $("#lbMensagemErro").text(data.status);
		    $("#modalErro").modal("show");
		  }
		}
	});
}

function recarregarRelacoes()
{
  $("#dataTable_relacoes").dataTable().fnClearTable();
  //recarrega a tabela pois pode ter havido remoções e alterações
  $.each(_arrayRelacaoAtorAtor, function (index, relacao)
    {
      if(relacao != null)
      {
        PopulaTableRelacao(relacao);
      }
    }
  );

  $.each(_arrayRelacaoAtorCasoUso, function (index, relacao)
    {
      if(relacao != null)
      {
        PopulaTableRelacao(relacao);
      }
    }
  );

  $.each(_arrayRelacaoCasoUsoCasoUso, function (index, relacao)
    {
      if(relacao != null)
      {
        PopulaTableRelacao(relacao);
      }
    }
  );
}

function PopulaTableRelacao(relacao)
{
	//0 - idRelacao, 1 - nomeComp1, 2 - nomeComp2, 3 - nomeRelacao, 4 tipoRelacao
	$("#dataTable_relacoes").dataTable().fnAddData
	(
		[
		  "<div>"+relacao[1]+"</div>",
		  "<div>"+relacao[2]+"</div>",
		  "<div>"+relacao[3]+"</div>",
		  "<div style='text-align:center'><a class='excluir' id="+relacao[0]+"#"+relacao[4]+" href='#'>Excluir</a></div>",
		]
	);
}

function recarregarComboboxRelacoes()
{
	$('#cmbComponente1').empty();
	$('#cmbComponente2').empty();

	$("#cmbComponente1").append("<option value='-1'>-- Selecione --</option>");
	$("#cmbComponente2").append("<option value='-1'>-- Selecione --</option>");
	PopulaComboBoxRelacoesCasoUso(); //função no arquivo casosdeuso.js
	PopulaComboBoxRelacoesAtor(); //função no arquivo ator.js
}