var _arrayClasseCasoUso = new Array();

$
(
	function()
	{
		DataTable("dataTable_casouso");

		$(window).load(
			function()
			{
				idProjeto = GetURLParameter('cp');
				carregarCasosUso(idProjeto);
			}
		);

		$("#btnInserirCasoUso").click(
			function()
			{
				var idCasoUso = $("#cmbCasoUso").val();
				var nomeCasoUso = $("#cmbCasoUso option:selected").text();
				var idClasse = $("#hfCodigoClasseCasoUso").val();

				if(idCasoUso == "-1" || idClasse == -1)
				{
					$("#lbMensagemAlerta").text("Selecione os campos necessários");
					$("#modalAlerta").modal("show");
				}else{
					$.when(verificaRelacaoExistente(idCasoUso, idClasse)).done(
						function(jaExiste){
							if(jaExiste == 1)
							{
								$("#lbMensagemAlerta").text("Esta relação já existe.");
								$("#modalAlerta").modal("show");
							}else{
								$.when(cadastrarRelacao(idCasoUso, idClasse)).done(
									function(idRelacao)
									{
										if(idRelacao != null){
											//0 - idRelacao, 1 idCasoUso, 2 nomeCasoUso
										  	var relacao = [idRelacao, idCasoUso, nomeCasoUso];
										  	_arrayClasseCasoUso[idRelacao] = relacao;
										  	PopulaTableRelacao(relacao); //Popula a tabela 
										}
									}
								);
							}
						}
					);
				}
			}
		);

		$("#dataTable_casouso").delegate(
			"a.excluirRelacao","click", function()
			{
				var idRelacao = $(this).prop("id").split("#")[1];

				$.when(excluirRelacao(idRelacao)).done(
				    function()
				    {
				    	recarregarRelacoes();//recarrega o datatable
				    }
				);
			}
	    );

	}
);

function carregarCasosUso(idProjeto)
{
	$.ajax({url: '/casosdeuso/listar_ajax',
		type: 'POST', async:false,
		data: {idProjeto: idProjeto},
		success : function(data){
		  if(data.status == "OK")
		  {
		  	$("#cmbCasoUso").empty(); //limpa combobox
		  	$("#cmbCasoUso").append("<option value='-1'>-- Selecione --</option>");
		    
		    listaCasosUsos = data['casosuso'];
		    
		    for (var i = 0; i < listaCasosUsos.length; i++) {
		    	$("#cmbCasoUso").append("<option value="+listaCasosUsos[i].pk+">"+
		    		""+listaCasosUsos[i].fields.nome+"</option>");
		    };
		  }else
		  {
		    $("#lbMensagemErro").text(data.status);
		    $("#modalErro").modal("show");
		  }
		}
	}); 
}

function listarClasseCasoUso(idClasse)
{
  	var listaRelacoes;
  	$("#dataTable_casouso").dataTable().fnClearTable();
  	_arrayClasseCasoUso = new Array();

	$.ajax({url: '/classecasouso/listar_ajax',
		type: 'POST', async:false,
		data: {idClasse: idClasse},
		success : function(data){
		  if(data.status == "OK")
		  {
		    listaRelacoes = data['classecasousos'];

		    for (var i=0; i<listaRelacoes.length; i++) 
		    {
		      var relacao = [listaRelacoes[i].pk, listaRelacoes[i].casouso_id, listaRelacoes[i].nomeCasoUso];
		      _arrayClasseCasoUso[relacao[0]] = relacao;
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

function cadastrarRelacao(idCasoUso, idClasse)
{
  var idRelacao = null;
  
  $.ajax({url: '/classecasouso/cadastrar_ajax',
    type: 'POST', async:false,
    data: {casouso_id: idCasoUso, classe_id: idClasse},
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

function verificaRelacaoExistente(idCasoUso, idClasse){

	var jaExiste = 0;

	$.ajax({url: '/classecasouso/verificarelacaoexistente_ajax',
		type: 'POST', async:false,
		data: {casouso_id:idCasoUso, classe_id: idClasse},
		success: function(data)
		{
			if(data.status == "OK")
			{
				if(data.jaExiste == "true"){
					jaExiste = 1;
				}else{
					jaExiste = 0;
				}
			}else
			{
				$("#lbMensagemErro").text(data.status);
				$("#modalErro").modal("show");
				jaExiste = 1;
		  	}
		}
	});

	return jaExiste;
}

function recarregarRelacoes()
{
  $("#dataTable_casouso").dataTable().fnClearTable();
  //recarrega a tabela pois pode ter havido remoções e alterações
  $.each(_arrayClasseCasoUso, function (index, relacao)
    {
		if(relacao != null)
		{
			PopulaTableRelacao(relacao);
		}
    }
  );
}

function excluirRelacao(idRelacao)
{
  $.ajax({url: '/classecasouso/excluir_ajax',
    type: 'POST', async:false,
    data: {idRelacao:idRelacao},
    success: function(data)
    {
      if(data.status == "OK")
      {
        _arrayClasseCasoUso[idRelacao] = null; //remove do array
      }else
      {
        $("#lbMensagemErro").text(data.status);
        $("#modalErro").modal("show");
      }
    }
  });
}


function PopulaTableRelacao(relacao)
{
	//0 - idRelacao, 1 idCasoUso, 2 nomeCasoUso
	$("#dataTable_casouso").dataTable().fnAddData
	(
		[
			"<div>"+relacao[2]+"</div>",
  		  	"<a id='linkExcluirRelacao#"+relacao[0]+"' class='excluirRelacao' href='#'>Excluir</a>",
		]
	);
	return false;
}