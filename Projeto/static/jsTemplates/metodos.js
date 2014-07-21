var _arrayMetodos = new Array();

$
(
	function(){

		DataTable("dataTable_metodos");

		$("#btnInserirMetodo").click(
			function () {
				var idClasse = $("#hfCodigoClasseMetodos").val();
				var nome = $("#txtMetodo").val();
				var tipo = $("#cmbTipoMetodo").val();
				var nomeTipo = $("#cmbTipoMetodo option:selected").text();
				var modificador = $("#rbMetodoPublico").prop("checked") == true? "public" : 
				$("#rbMetodoPrivado").prop("checked") == true? "private" : "protected";

				if(nome == "" || tipo == "-1" || idClasse == "-1")
				{
					$("#lbMensagemAlerta").text("Preencha os campos corretamente");
					$("#modalAlerta").modal("show");
				}else{
					$.when(verificaNomeMetodo(idClasse, nome)).done(
						function(jaExiste){
							if(jaExiste == 1)
							{
								$("#lbMensagemAlerta").text("Este método já existe");
								$("#modalAlerta").modal("show");
							}else{
								$.when(cadastrarMetodo(idClasse, nome, tipo, modificador)).done(
									function(idMetodo)
									{
										if(idMetodo != null){
											//0 idAtributo, 1 nome, 2 tipo, 3 nomeTipo , 4 modificador
										  	var metodo = [idMetodo, nome, tipo, nomeTipo, modificador];
										  	_arrayMetodos[idMetodo] = metodo;
										  	PopulaTableMetodo(metodo); //Popula a tabela 
										}
									}
								);
							}
						}
					);
				}
			}
		);

		$("#dataTable_metodos").delegate(
	      "a.excluirMetodo","click", function()
	      {
	        var idMetodo = $(this).prop("id").split("#")[1];
	        
	        $.when(excluirMetodo(idMetodo)).done(
	            function()
	            {
	            	recarregarMetodos();//recarrega o datatable
	            }
          	);
	      }
	    ).delegate(
	      "a.parametros","click", function()
	      {
	        var idMetodo = $(this).prop("id").split("_")[1];
	        $("#hfCodigoMetodo").val(idMetodo);
	        listarParametros(idMetodo);//carrega as informações para o modal
	        $("#modalParametros").modal("show");
	      }
	    );
	}
);


function cadastrarMetodo(classe_id, nome, tipo_id, modificador)
{
  var idMetodo = null;

  $.ajax({url: '/metodos/cadastrar_ajax',
    type: 'POST', async:false,
    data: {nome:nome, classe_id:classe_id, tipo_id: tipo_id, modificador : modificador},
    success: function(data)
    {
      if(data.status != "OK")
      {
        $("#modalErro").modal("show");
      }else{
        $("#txtMetodo").val("");
        idMetodo = data.idMetodo;
      }
    }
  });
  return idMetodo;
}

function verificaNomeMetodo(idClasse, nomeMetodo){

	var jaExiste = 0;

	$.ajax({url: '/metodos/verificanomemetodo_ajax',
		type: 'POST', async:false,
		data: {idClasse:idClasse, nomeMetodo: nomeMetodo},
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

function listarMetodos(idClasse) {
	var listaMetodos;

	_arrayMetodos = new Array();
	$("#dataTable_metodos").dataTable().fnClearTable();

	$.ajax({url: '/metodos/listar_ajax',
		type: 'POST', async:false,
		data: {idClasse: idClasse},
		success : function(data){
		  if(data.status == "OK")
		  {
		    listaMetodos = data['metodos'];

		    for (var i=0; i<listaMetodos.length; i++) 
		    {
		    	//0 idMetodos, 1 nome, 2 retorno, 3 nomeTipo, 4 - modificador
		      	var metodo = [listaMetodos[i].pk, listaMetodos[i].nome, listaMetodos[i].tipo,
		      		listaMetodos[i].nomeTipo, listaMetodos[i].modificador];
		      	_arrayMetodos[metodo[0]] = metodo;
		      	PopulaTableMetodo(metodo);
		    }
		  }else
		  {
		    $("#lbMensagemErro").text(data.status);
		    $("#modalErro").modal("show");
		  }
		}
	});
}

function excluirMetodo(idMetodo)
{
	$.ajax({url: '/metodos/excluir_ajax',
		type: 'POST', async:false,
		data: {idMetodo:idMetodo},
		success: function(data)
		{
		  if(data.status == "OK")
		  {
		  	_arrayMetodos[idMetodo] = null;
		  }else
		  {
		    $("#lbMensagemErro").text(data.status);
		    $("#modalErro").modal("show");
		  }
		}
	});
}

function recarregarMetodos()
{
  $("#dataTable_metodos").dataTable().fnClearTable();
  //recarrega a tabela pois pode ter havido remoções e alterações
  	$.each(_arrayMetodos, function (index, metodo)
	{
		if(metodo != null)
		{
			PopulaTableMetodo(metodo);
		}
	}
  );
}

function PopulaTableMetodo(metodo)
{
	//0 idMetodo, 1 nome, 2 tipo, 3 nomeTipo, 4 - modificador
	$("#dataTable_metodos").dataTable().fnAddData
	(
		[
		  	"<div>"+metodo[1]+"</div>",
		  	"<div>"+metodo[3]+"</div>",
        	"<div>"+metodo[4]+"</div>",
        	"<div style='text-align:center'><a id='linkParametros_"+metodo[0]+"' class='parametros' href='#'>Definir</a></div>",
      		"<div style='text-align:center'><a id='excluirMetodo#"+metodo[0]+"' class='excluirMetodo' href='#'>Excluir</a></div>",
		]
	);
	return false;
}
