var _arrayHeranca = new Array();

$
(
	function()
	{
		DataTable("dataTable_heranca");
		$(window).load
	    (
	      function () {
	        var codProjeto = GetURLParameter('cp');
	        listarHerancas(codProjeto);
	      }
	    );

		$("#btnInserirHeranca").click(
			function()
			{
				var idClasseFilho = $("#cmbClasseFilho").val();
				var nomeClasseFilho = $("#cmbClasseFilho option:selected").text();
				var idClassePai = $("#cmbClassePai").val();
				var nomeClassePai = $("#cmbClassePai option:selected").text();
				var idProjeto = GetURLParameter('cp');

				if(idClassePai == "-1" || idClasseFilho == "-1" || idProjeto == -1)
				{
					$("#lbMensagemAlerta").text("Selecione as classes");
					$("#modalAlerta").modal("show");
				}else{
					if(idClassePai == idClasseFilho)
					{
						$("#lbMensagemAlerta").text("Não é possível estabelecer uma herança entre uma mesma classe.");
						$("#modalAlerta").modal("show");
					}else
					{
						$.when(verificaHerancaExistente(idClasseFilho, idClassePai)).done(
							function(jaExiste){
								if(jaExiste == 1)
								{
									$("#lbMensagemAlerta").text("Esta herança já existe.");
									$("#modalAlerta").modal("show");
								}else{
									if(jaExiste == 2)
									{
										$("#lbMensagemAlerta").text("Não existe suporte para herança múltipla.");
										$("#modalAlerta").modal("show");
									}else{
										$.when(cadastrarHeranca(idClasseFilho, idClassePai, idProjeto)).done(
											function(idHeranca)
											{
												if(idHeranca != null){
													//0 -idHeranca, 1 idClasseFilho, 2 nomeClasseFilho, 3 idClassePai, 4 nomeClassePai
												  	var heranca = [idHeranca, idClasseFilho, nomeClasseFilho,
												  		idClassePai, nomeClassePai];
												  	_arrayHeranca[idHeranca] = heranca;
												  	PopulaTableHeranca(heranca); //Popula a tabela 
												}
											}
										);
									}
								}
							}
						);
					}
				}
			}
		);

		$("#dataTable_heranca").delegate(
			"a.excluirHeranca","click", function()
			{
				var idHeranca = $(this).prop("id").split("#")[1];

				$.when(excluirHeranca(idHeranca)).done(
				    function()
				    {
				    	recarregarHeranca();//recarrega o datatable
				    }
				);
			}
	    );

	}
);

function listarHerancas(idProjeto)
{
	var listaHeranca;
	$.ajax({url: '/heranca/listar_ajax',
		type: 'POST', async:false,
    	data: {idProjeto: idProjeto},
		success : function(data){
		  if(data.status == "OK")
		  {
		    listaHeranca = data['herancas'];

		    for (var i=0; i<listaHeranca.length; i++) 
		    {
		      var heranca = [listaHeranca[i].pk, listaHeranca[i].classefilho_id, listaHeranca[i].classeFilho,
		      	listaHeranca[i].classepai_id, listaHeranca[i].classePai];
		      _arrayHeranca[listaHeranca[i].pk] = heranca;
		      PopulaTableHeranca(heranca);
		    }
		  }else
		  {
		    $("#lbMensagemErro").text(data.status);
		    $("#modalErro").modal("show");
		  }
		}
	}); 
}


function cadastrarHeranca(idClasseFilho, idClassePai, idProjeto)
{
  var idHeranca = null;
  
  $.ajax({url: '/heranca/cadastrar_ajax',
    type: 'POST', async:false,
    data: {idClasseFilho:idClasseFilho, idClassePai:idClassePai, idProjeto: idProjeto},
    success: function(data)
    {
      if(data.status != "OK")
      {
        $("#modalErro").modal("show");
      }else{
        idHeranca = data.idHeranca;
      }
    }
  });
  return idHeranca;
}

function verificaHerancaExistente(idClasseFilho, idClassePai){

	var jaExiste = 0;

	$.ajax({url: '/heranca/verificarherancaexistente_ajax',
		type: 'POST', async:false,
		data: {idClasseFilho:idClasseFilho, idClassePai: idClassePai},
		success: function(data)
		{
			if(data.status == "OK")
			{
				if(data.jaExiste == "true"){
					if(data.herancaMultipla == "true")
					{
						jaExiste = 2;
					}else{
						jaExiste = 1;
					}
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

function recarregarHeranca()
{
  $("#dataTable_heranca").dataTable().fnClearTable();
  //recarrega a tabela pois pode ter havido remoções e alterações
  $.each(_arrayHeranca, function (index, heranca)
    {
		if(heranca != null)
		{
			PopulaTableHeranca(heranca);
		}
    }
  );
}

function excluirHeranca(idHeranca)
{
  $.ajax({url: '/heranca/excluir_ajax',
    type: 'POST', async:false,
    data: {idHeranca:idHeranca},
    success: function(data)
    {
      if(data.status == "OK")
      {
        _arrayHeranca[idHeranca] = null; //remove do array
      }else
      {
        $("#lbMensagemErro").text(data.status);
        $("#modalErro").modal("show");
      }
    }
  });
}


function PopulaTableHeranca(heranca)
{
	//0 -idHeranca, 1 idClasseFilho, 2 nomeClasseFilho, 3 idClassePai, 4 nomeClassePai
	$("#dataTable_heranca").dataTable().fnAddData
	(
		[
			"<div>"+heranca[2]+"</div>",
		  	"<div>"+heranca[4]+"</div>",
  		  	"<a id='linkExcluirHeranca#"+heranca[0]+"' class='excluirHeranca' href='#'>Excluir</a>",
		]
	);
	return false;
}