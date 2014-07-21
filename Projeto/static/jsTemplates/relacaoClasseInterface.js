var _arrayClasseInterface = new Array();

$
(
	function()
	{
		DataTable("dataTable_implementacao");
		$(window).load
	    (
	      function () {
	        var codProjeto = GetURLParameter('cp');
	        listarImplementacoes(codProjeto);
	      }
	    );

		$("#btnInserirImplementacao").click(
			function()
			{
				var idClasse = $("#cmbClasseImplementacao").val();
				var nomeClasse = $("#cmbClasseImplementacao option:selected").text();
				var idInterface = $("#cmbInterface").val();
				var nomeInterface = $("#cmbInterface option:selected").text();
				var idProjeto = GetURLParameter('cp');

				if(idClasse == "-1" || idInterface == "-1" || idProjeto == -1)
				{
					$("#lbMensagemAlerta").text("Selecione a classe e a interface");
					$("#modalAlerta").modal("show");
				}else{
					$.when(verificaImplementacaoExistente(idClasse, idInterface)).done(
						function(jaExiste){
							if(jaExiste == 1)
							{
								$("#lbMensagemAlerta").text("Esta relação já existe.");
								$("#modalAlerta").modal("show");
							}else{
								$.when(cadastrarImplementacao(idClasse, idInterface, idProjeto)).done(
									function(idImplementacao)
									{
										if(idImplementacao != null){
											//0 -idImplementacao, 1 idClasse, 2 nomeClasse, 3 idInterface, 4 nomeInterface
										  	var implementacao = [idImplementacao, idClasse, nomeClasse,
										  		idInterface, nomeInterface];
										  	_arrayClasseInterface[idImplementacao] = implementacao;
										  	PopulaTableImplementacao(implementacao); //Popula a tabela 
										}
									}
								);
							}
						}
					);
				}
			}
		);

		$("#dataTable_implementacao").delegate(
			"a.excluirImplementacao","click", function()
			{
				var idImplementacao = $(this).prop("id").split("#")[1];

				$.when(excluirImplementacao(idImplementacao)).done(
				    function()
				    {
				    	recarregarImplementacao();//recarrega o datatable
				    }
				);
			}
	    );
	}
);

function listarImplementacoes(idProjeto)
{
	var listaImplementacao;

	$.ajax({url: '/relacaoClasseInterface/listar_ajax',
		type: 'POST', async:false,
    	data: {idProjeto: idProjeto},
		success : function(data){
		  if(data.status == "OK")
		  {
		    listaImplementacao = data['relacoesClasseInterface'];

		    for (var i=0; i<listaImplementacao.length; i++) 
		    {
		      	var implementacao = [listaImplementacao[i].pk, listaImplementacao[i].classe, listaImplementacao[i].nomeclasse,
		      	listaImplementacao[i].interface, listaImplementacao[i].nomeInterface];
				_arrayClasseInterface[listaImplementacao[i].pk] = implementacao;
				PopulaTableImplementacao(implementacao);
		    }
		  }else
		  {
		    $("#lbMensagemErro").text(data.status);
		    $("#modalErro").modal("show");
		  }
		}
	}); 
}


function cadastrarImplementacao(idClasse, idInterface, idProjeto)
{
  var idImplementacao = null;
  
  $.ajax({url: '/relacaoClasseInterface/cadastrar_ajax',
    type: 'POST', async:false,
    data: {idClasse:idClasse, idInterface:idInterface, idProjeto: idProjeto},
    success: function(data)
    {
      if(data.status != "OK")
      {
        $("#modalErro").modal("show");
      }else{
        idImplementacao = data.idImplementacao;
      }
    }
  });
  return idImplementacao;
}

function verificaImplementacaoExistente(idClasse, idInterface){

	var jaExiste = 0;

	$.ajax({url: '/relacaoClasseInterface/verificarimplementacaoexistente_ajax',
		type: 'POST', async:false,
		data: {idClasse:idClasse, idInterface: idInterface},
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

function recarregarImplementacao()
{
  $("#dataTable_implementacao").dataTable().fnClearTable();
  //recarrega a tabela pois pode ter havido remoções e alterações
  $.each(_arrayClasseInterface, function (index, implementacao)
    {
		if(implementacao != null)
		{
			PopulaTableImplementacao(implementacao);
		}
    }
  );
}

function excluirImplementacao(idImplementacao)
{
  $.ajax({url: '/relacaoClasseInterface/excluir_ajax',
    type: 'POST', async:false,
    data: {idImplementacao:idImplementacao},
    success: function(data)
    {
      if(data.status == "OK")
      {
        _arrayClasseInterface[idImplementacao] = null; //remove do array
      }else
      {
        $("#lbMensagemErro").text(data.status);
        $("#modalErro").modal("show");
      }
    }
  });
}


function PopulaTableImplementacao(implementacao)
{

	//0 -idImplementacao, 1 idClasse, 2 nomeClasse, 3 idInterface, 4 nomeInterface
	$("#dataTable_implementacao").dataTable().fnAddData
	(
		[
			"<div>"+implementacao[2]+"</div>",
		  	"<div>"+implementacao[4]+"</div>",
  		  	"<a id='linkExcluirHeranca#"+implementacao[0]+"' class='excluirImplementacao' href='#'>Excluir</a>",
		]
	);
	return false;
}