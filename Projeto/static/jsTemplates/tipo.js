var _arrayTipos = new Array();

$
(
	function()
	{
		DataTable("dataTable_tipos");

		$(window).load
		(
			function()
			{
				listarTipos();
			}
		)

		$("#dataTable_tipos").delegate(
	      "a.excluirTipo","click", function()
	      {
	        var idTipo = $(this).prop("id").split("_")[1];
	        excluirTipo(idTipo);
	        recarregarTipos();
	      }
	    );

		$("#btnInserirTipo").click(
			function()
			{
				var nomeTipo = $("#txtTipo").val();

				if($.trim(nomeTipo) == "")
				{
					$("#lbMensagemAlerta").text("Preencha os campos corretamente.");
					$("#modalAlerta").modal("show");
				}else{
					$.when(verificaNomeTipo(nomeTipo)).done(
						function(jaExiste){
							if(jaExiste == 1)
							{
								$("#lbMensagemAlerta").text("Este tipo já existe.");
								$("#modalAlerta").modal("show");
							}else{
								$.when(cadastrarTipo(nomeTipo)).done(
									function(idTipo)
									{
										if(idTipo != null){
											//0 -idTipo, 1 nomeTipo
										  	var tipo = [idTipo, nomeTipo];
										  	_arrayTipos[idTipo] = tipo;
										  	PopulaTableTipo(tipo); //Popula a tabela 
										
										  	$("#cmbTipoAtributo").append("<option value="+tipo[0]+">"+tipo[1]+"</option>");
										  	$("#cmbTipoMetodo").append("<option value="+tipo[0]+">"+tipo[1]+"</option>");
											$("#cmbTipoParametro").append("<option value="+tipo[0]+">"+tipo[1]+"</option>");
										}
									}
								);
							}
						}
					);
				}
			}
		);
	}
);

function listarTipos()
{
  	var listaTipos;
  	$("#dataTable_tipos").dataTable().fnClearTable();
  	limparCombobox();

	$.ajax({url: '/tipoVarMet/listar_ajax',
		type: 'POST', async:false,
		success : function(data){
		  if(data.status == "OK")
		  {
		    listaTipos = data['tipos'];

		    for (var i=0; i<listaTipos.length; i++) 
		    {
		      	var tipo = [listaTipos[i].pk, listaTipos[i].fields.nome];
		    	_arrayTipos[tipo[0]] = tipo;

		    	$("#cmbTipoAtributo").append("<option value="+tipo[0]+">"+tipo[1]+"</option>");
		    	$("#cmbTipoMetodo").append("<option value="+tipo[0]+">"+tipo[1]+"</option>");
		    	$("#cmbTipoParametro").append("<option value="+tipo[0]+">"+tipo[1]+"</option>");
				PopulaTableTipo(tipo);
		    }
		  }else
		  {
		    $("#lbMensagemErro").text(data.status);
		    $("#modalErro").modal("show");
		  }
		}
	}); 
}

function limparCombobox()
{
	$("#cmbTipoAtributo").empty();
	$("#cmbTipoAtributo").append("<option value='-1'>-- Selecione --</option>");
	$("#cmbTipoMetodo").empty();
	$("#cmbTipoMetodo").append("<option value='-1'>-- Selecione --</option>");
	$("#cmbTipoParametro").empty();
	$("#cmbTipoParametro").append("<option value='-1'>-- Selecione --</option>");
}

function cadastrarTipo(nome)
{
  var idTipo = null;

  $.ajax({url: '/tipoVarMet/cadastrar_ajax',
    type: 'POST', async:false,
    data: {nome:nome,},
    success: function(data)
    {
      if(data.status != "OK")
      {
        $("#modalErro").modal("show");
      }else{
        $("#txtTipo").val("");
        idTipo = data.idTipo;
      }
    }
  });
  return idTipo;
}

function verificaNomeTipo(nomeTipo){

	var jaExiste = 0;

	$.ajax({url: '/tipoVarMet/verificanometipo_ajax',
		type: 'POST', async:false,
		data: {nomeTipo: nomeTipo},
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

function excluirTipo(idTipo)
{
  $.ajax({url: '/tipoVarMet/excluir_ajax',
    type: 'POST', async:false,
    data: {idTipo:idTipo},
    success: function(data)
    {
      if(data.status == "OK")
      {
        $("#modalEditarClasse").modal("hide");
        _arrayTipos[idTipo] = null; //remove do array
      }else
      {
        $("#lbMensagemErro").text(data.status);
        $("#modalErro").modal("show");
      }
    }
  });
}

function recarregarTipos()
{
	$("#dataTable_tipos").dataTable().fnClearTable();
	limparCombobox();

  	//recarrega a tabela pois pode ter havido remoções e alterações
  	$.each(_arrayTipos, function (index, tipo)
	{
		if(tipo != null)
		{
			$("#cmbTipoAtributo").append("<option value="+tipo[0]+">"+tipo[1]+"</option>");
	    	$("#cmbTipoMetodo").append("<option value="+tipo[0]+">"+tipo[1]+"</option>");
	    	$("#cmbTipoParametro").append("<option value="+tipo[0]+">"+tipo[1]+"</option>");
			PopulaTableTipo(tipo);
		}
	}
  );
}

function PopulaTableTipo(tipo)
{
	// 0 IdProjeto, 1 - nomeCasoUso, 2 - modificador
	$("#dataTable_tipos").dataTable().fnAddData
	(
		[
		  	"<span>"+tipo[1]+"</span>",
		  	"<div style='text-align:center'><a id='linkExcluirTipo_"+tipo[0]+"' class='excluirTipo' href='#'>Excluir</a></div>",
		]
	);
	return false;
}