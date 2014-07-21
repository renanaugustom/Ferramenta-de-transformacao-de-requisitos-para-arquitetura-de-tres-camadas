var _arrayAtributos = new Array();

$
(
	function(){

		DataTable("dataTable_atributos");

		$("#btnInserirAtributo").click(
			function () {
				var idClasse = $("#hfCodigoClasseAtributos").val();
				var nome = $("#txtAtributo").val();
				var tipo = $("#cmbTipoAtributo").val();
				var nomeTipo = $("#cmbTipoAtributo option:selected").text();
				var modificador = $("#rbAtributoPublico").prop("checked") == true? "public" : 
				$("#rbAtributoPrivado").prop("checked") == true? "private" : "protected";
				var getSet = $("#ckGerarGetSet").prop("checked") == true? 1 : 0;

				if(nome == "" || tipo == "-1" || idClasse == "-1")
				{
					$("#lbMensagemAlerta").text("Todos os campos são obrigatórios.");
					$("#modalAlerta").modal("show");
				}else{
					$.when(verificaNomeAtributo(idClasse, nome)).done(
						function(jaExiste){
							if(jaExiste == 1)
							{
								$("#lbMensagemAlerta").text("Este atributo já existe.");
								$("#modalAlerta").modal("show");
							}else{
								$.when(cadastrarAtributo(idClasse, nome, tipo, modificador, getSet)).done(
									function(idAtributo)
									{
										if(idAtributo != null){
											//0 idAtributo, 1 nome, 2 tipo, 3 nomeTipo, 4 modificador, 5 getSet
										  	var atributo = [idAtributo, nome, tipo, nomeTipo, modificador, getSet];
										  	_arrayAtributos[idAtributo] = atributo;
										  	PopulaTableAtributo(atributo); //Popula a tabela 
										}
									}
								);
							}
						}
					);
				}
			}
		);

		$("#dataTable_atributos").delegate(
	      "a.excluirAtributo","click", function()
	      {
	        var idAtributo = $(this).prop("id").split("#")[1];
	        
	        $.when(excluirAtributo(idAtributo)).done(
	            function()
	            {
	            	recarregarAtributos();//recarrega o datatable
	            }
          	);
	      }
	    );
	}
);


function cadastrarAtributo(classe_id, nome, tipo, modificador, getSet)
{
  var idAtributo = null;

  $.ajax({url: '/atributos/cadastrar_ajax',
    type: 'POST', async:false,
    data: {nome:nome, classe_id:classe_id, tipo: tipo, modificador : modificador, getSet: getSet},
    success: function(data)
    {
      if(data.status != "OK")
      {
        $("#modalErro").modal("show");
      }else{
        $("#txtAtributo").val("");
        idAtributo = data.idAtributo;
      }
    }
  });
  return idAtributo;
}

function verificaNomeAtributo(idClasse, nomeAtributo){

	var jaExiste = 0;

	$.ajax({url: '/atributos/verificanomeatributo_ajax',
		type: 'POST', async:false,
		data: {idClasse:idClasse, nomeAtributo: nomeAtributo},
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

function excluirAtributo(idAtributo)
{
	$.ajax({url: '/atributos/excluir_ajax',
		type: 'POST', async:false,
		data: {idAtributo:idAtributo},
		success: function(data)
		{
		  if(data.status == "OK")
		  {
		  	_arrayAtributos[idAtributo] = null;
		  }else
		  {
		    $("#lbMensagemErro").text(data.status);
		    $("#modalErro").modal("show");
		  }
		}
	});
}

function listarAtributos(idClasse) {
	var listaAtributos;

	_arrayAtributos = new Array();
	$("#dataTable_atributos").dataTable().fnClearTable();

	$.ajax({url: '/atributos/listar_ajax',
		type: 'POST', async:false,
		data: {idClasse: idClasse},
		success : function(data){
		  if(data.status == "OK")
		  {
		    listaAtributos = data['atributos'];
		    for (var i=0; i<listaAtributos.length; i++) 
		    {
		    	//0 idAtributo, 1 nome, 2 tipo, 3 nomeTipo, 4 modificador, 5 getSet
		      	var atributo = [listaAtributos[i].pk, listaAtributos[i].nome, listaAtributos[i].tipo,
		      		listaAtributos[i].nomeTipo, listaAtributos[i].modificador, listaAtributos[i].getSet];
		      	_arrayAtributos[atributo[0]] = atributo;
		      	PopulaTableAtributo(atributo);
		    }
		  }else
		  {
		    $("#lbMensagemErro").text(data.status);
		    $("#modalErro").modal("show");
		  }
		}
	});
}

function recarregarAtributos()
{
  $("#dataTable_atributos").dataTable().fnClearTable();
  //recarrega a tabela pois pode ter havido remoções e alterações
  	$.each(_arrayAtributos, function (index, atributo)
	{
		if(atributo != null)
		{
			PopulaTableAtributo(atributo);
		}
	}
  );
}

function PopulaTableAtributo(atributo)
{

	var getSet = atributo[5] == 1? "<div>Sim</div" : "<div>Não</div>";

	//0 idAtributo, 1 nome, 2 tipo, 3 nomeTipo, 4 modificador, 5 - getSet
	$("#dataTable_atributos").dataTable().fnAddData
	(
		[
		  	"<div>"+atributo[1]+"</div>",
		  	getSet,
		  	"<div>"+atributo[3]+"</div>",
        	"<div>"+atributo[4]+"</div>",
      		"<div style='text-align:center'><a id='excluirAtributo#"+atributo[0]+"' class='excluirAtributo' href='#'>Excluir</a></div>",
		]
	);
	return false;
}