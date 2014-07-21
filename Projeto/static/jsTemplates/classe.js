var listaCasosUsos = new Array();
var idProjeto = -1;
var _arrayClasse = new Array();
var _arrayInterface = new Array();
var isClasse = 0;

$
(
	function()
	{
		//carregar a customização dos select's
		$("select").selectpicker({style: 'btn-embossed btn-primary', menuStyle: 'dropdown-inverse'});
		DataTable("dataTable_classes");
		DataTable("dataTable_interfaces");

		$(window).load(
			function()
			{
				idProjeto = GetURLParameter('cp');
				listar(idProjeto);
			}
		);

		$('#myTab a').click(function (e) {
	        e.preventDefault();
	        $(this).tab('show');
	    });
	    // store the currently selected tab in the hash value
	    $("ul.nav-tabs > li > a").on("shown.bs.tab", function (e) {
	        var id = $(e.target).attr("href").substr(1);
	        window.location.hash = id;
	    });

	    // on load of the page: switch to the currently selected tab
	    var hash = window.location.hash;
	    $('#myTab a[href="' + hash + '"]').tab('show');
	    
		$("#dataTable_classes").delegate(
	      "a.editar","click", function()
	      {
	        var idClasse = $(this).prop("id").split("_")[1];
	        $("#hfCodigoClasse").val(idClasse);
	        isClasse = 1;
	        $("#divPersistenciaEditar").attr("style", "display:");
	        carregarClasse(idClasse);//carrega as informações para o modal
	        $("#modalEditarClasse").modal("show");
	      }
	    ).delegate(
	      "a.atributos","click", function()
	      {
	        var idClasse = $(this).prop("id").split("_")[1];
	        $("#hfCodigoClasseAtributos").val(idClasse);
	        isClasse = 1;
	        $("#divGetSet").attr("style", "display:");
	        listarAtributos(idClasse);//método no arquivo atributos.js
	        $("#modalAtributos").modal("show");
	      }
	    ).delegate(
	      "a.metodos","click", function()
	      {
	        var idClasse = $(this).prop("id").split("_")[1];
	        $("#hfCodigoClasseMetodos").val(idClasse);
	        isClasse = 1;
	        listarMetodos(idClasse);//método no arquivo metodos.js
	        $("#modalMetodos").modal("show");
	      }
	    ).delegate(
	      "a.casosUso","click", function()
	      {
	        var idClasse = $(this).prop("id").split("_")[1];
	        $("#hfCodigoClasseCasoUso").val(idClasse);
	        isClasse = 1;
	        listarClasseCasoUso(idClasse);//método no arquivo classecasouso.js
	        $("#modalCasoUso").modal("show");
	      }
	    );

	    $("#dataTable_interfaces").delegate(
	      "a.editar","click", function()
	      {
	        var idClasse = $(this).prop("id").split("_")[1];
	        $("#hfCodigoClasse").val(idClasse);
	        $("#divPersistenciaEditar").attr("style", "display:none");
	        isClasse = 0;
	        carregarClasse(idClasse);//carrega as informações para o modal
	        $("#modalEditarClasse").modal("show");
	      }
	    ).delegate(
	      "a.atributos","click", function()
	      {
	        var idClasse = $(this).prop("id").split("_")[1];
	        $("#hfCodigoClasseAtributos").val(idClasse);
	        isClasse = 0;
	        $("#divGetSet").attr("style", "display:none");
	        listarAtributos(idClasse);//método no arquivo atributos.js
	        $("#modalAtributos").modal("show");
	      }
	    ).delegate(
	      "a.metodos","click", function()
	      {
	        var idClasse = $(this).prop("id").split("_")[1];
	        $("#hfCodigoClasseMetodos").val(idClasse);
	        isClasse = 0;
	        listarMetodos(idClasse);//método no arquivo metodos.js
	        $("#modalMetodos").modal("show");
	      }
	    ).delegate(
	      "a.casosUso","click", function()
	      {
	        var idClasse = $(this).prop("id").split("_")[1];
	        $("#hfCodigoClasseCasoUso").val(idClasse);
	        isClasse = 0;
	        listarClasseCasoUso(idClasse);//método no arquivo classecasouso.js
	        $("#modalCasoUso").modal("show");
	      }
	    );

	    $("#btnEditarClasse").click(
	        function()
	        {
	          var idClasse = $("#hfCodigoClasse").val();
	          var modificador = $("#rbClassePublicaEditar").prop("checked") == true? "public" : 
				$("#rbClassePrivadaEditar").prop("checked") == true? "private" : "protected";
	          var nome = $("#txtClasseEditar").val();
	          var persistencia = $("#ckPersistenciaEditar").prop("checked") == true? 1 : 0; 

	          if(nome == "")
	          {
	          	$("#lbMensagemAlerta").text("Preencha os campos corretamente");
				$("#modalAlerta").modal("show");
	          }else
	          {
	          	$.when(verificaNomeClasse(idClasse, nome, idProjeto)).done(
					function(jaExiste){
						if(jaExiste == 1)
						{
							$("#lbMensagemAlerta").text("Esta classe já existe.");
							$("#modalAlerta").modal("show");
						}else{
							if(isClasse == 1){
								_arrayClasse[idClasse] = [idClasse, nome, modificador, persistencia];
				          		editarClasse(idClasse, modificador, nome, persistencia);
				          	}else{
				          		_arrayInterface[idClasse] = [idClasse, nome, modificador];
				          		editarClasse(idClasse, modificador, nome, 0);
				          	}
				          	recarregarClasses();
				          	$("#hfCodigoClasse").val("-1");//reinicia
				        }
				    }
				);
	          }
	        }
        );

        $("#btnGerenciarTipoAtributo").click(
	        function()
	        {
	        	$("#modalTipos").modal("show");
	        	return false;
	        }
	    );

	    $("#btnGerenciarTipoMetodo").click(
	        function()
	        {
	        	$("#modalTipos").modal("show");
	        	return false;
	        }
	    );

	    $("#btnGerenciarTipoParametro").click(
	        function()
	        {
	        	$("#modalTipos").modal("show");
	        	return false;
	        }
	    );

        $("#btnDefinirHerancas").click(
	      function()
	      {
	        var idClasse = $(this).prop("id").split("_")[1];
	        $("#hfCodigoClasseHeranca").val(idClasse);
	        //listarHerancas(idClasse);//método no arquivo metodos.js
	        $("#modalHeranca").modal("show");
	      }
	    );

		$("#btnInserirClasse").click(
			function()
			{
				var idClasse = -1; //Apenas para consulta de classes existentes
				var nomeClasse = $("#txtClasse").val();
				var modificador = $("#rbClassePublica").prop("checked") == true? "public" : 
				$("#rbClassePrivada").prop("checked") == true? "private" : "protected";
				var persistencia = $("#ckPersistencia").prop("checked") == true? 1 : 0; 

				if(nomeClasse == "" || idProjeto == -1)
				{
					$("#lbMensagemAlerta").text("Preencha os campos corretamente.");
					$("#modalAlerta").modal("show");
				}else{
					$.when(verificaNomeClasse(idClasse, nomeClasse, idProjeto)).done(
						function(jaExiste){
							if(jaExiste == 1)
							{
								$("#lbMensagemAlerta").text("Esta classe já existe.");
								$("#modalAlerta").modal("show");
							}else{
								$.when(cadastrarClasse(nomeClasse, modificador, persistencia, idProjeto)).done(
									function(idClasse)
									{
										if(idClasse != null){
											//0 -idClasse, 1 nomeClasse, 2 modificador,3 persistencia
										  	var classe = [idClasse, nomeClasse, modificador, persistencia];
										  	_arrayClasse[idClasse] = classe;
										  	PopulaTableClasse(classe); //Popula a tabela 
										  	$("#cmbClasseFilho").append("<option value='"+classe[0]+"'>"+classe[1]+"</option>");
		      								$("#cmbClassePai").append("<option value='"+classe[0]+"'>"+classe[1]+"</option>");
		      								$("#cmbClasseImplementacao").append("<option value='"+classe[0]+"'>"+classe[1]+"</option>");
										}
									}
								);
							}
						}
					);
				}
			}
		);

		$("#btnInserirInterface").click(
			function()
			{
				var idClasse = -1; //Apenas para consulta de classes existentes
				var nomeInterface = $("#txtInterface").val();
				var modificador = $("#rbInterfacePublica").prop("checked") == true? "public" : 
				$("#rbInterfacePrivada").prop("checked") == true? "private" : "protected";

				if(nomeInterface == "" || idProjeto == -1)
				{
					$("#lbMensagemAlerta").text("Preencha os campos corretamente.");
					$("#modalAlerta").modal("show");
				}else{
					$.when(verificaNomeClasse(idClasse, nomeInterface, idProjeto)).done(
						function(jaExiste){
							if(jaExiste == 1)
							{
								$("#lbMensagemAlerta").text("Esta interface já existe.");
								$("#modalAlerta").modal("show");
							}else{

								$.when(cadastrarInterface(nomeInterface, modificador, idProjeto)).done(
									function(idClasse)
									{
										if(idClasse != null){
											//0 -idClasse, 1 nomeClasse, 2 modificador
										  	var _interface = [idClasse, nomeInterface, modificador];
										  	_arrayInterface[idClasse] = _interface;
										  	PopulaTableInterface(_interface); //Popula a tabela 
										  	$("#cmbInterface").append("<option value='"+_interface[0]+"'>"+_interface[1]+"</option>");
										}
									}
								);
							}
						}
					);
				}
			}
		);

		$("#btnDefinirImplementacoes").click(
	      function()
	      {
	        var idClasse = $(this).prop("id").split("_")[1];
	        $("#hfCodigoClasseInterface").val(idClasse);
	        $("#modalImplementacao").modal("show");
	      }
	    );

		$("#btnExcluirClasse").click(
	        function()
	        {
	          var idClasse = $("#hfCodigoClasse").val();
	          $.when(excluirClasse(idClasse)).done(
	            function()
	            {
	            	if(isClasse == 1){
			        	_arrayClasse[idClasse] = null; //remove do array
			    	}else{
			    		_arrayInterface[idClasse] = null;
			    	}
              		recarregarClasses();
              		$("#hfCodigoClasse").val("-1");//recarrega
	            }
	          );
	        }
	    );
	}
);



function listar(idProjeto)
{
  	var listaClasse;

  	$("#cmbClasseFilho").empty();
  	$("#cmbClassePai").empty();
  	$("#cmbClasseImplementacao").empty();
  	$("#cmbClasseFilho").append("<option value='-1'>-- Selecione --</option>");
  	$("#cmbClassePai").append("<option value='-1'>-- Selecione --</option>");
	$("#cmbClasseImplementacao").append("<option value='-1'>-- Selecione --</option>");

	$("#cmbInterface").empty();
	$("#cmbInterface").append("<option value='-1'>-- Selecione --</option>");

	$.ajax({url: '/classe/listar_ajax',
		type: 'POST', async:false,
		data: {idProjeto: idProjeto},
		success : function(data){
		  if(data.status == "OK")
		  {
		    listaClasse = data['classes'];
		    for (var i=0; i<listaClasse.length; i++) 
		    {
		    	if(listaClasse[i].fields.isInterface == 0)
		    	{
					var classe = [listaClasse[i].pk, listaClasse[i].fields.nome, listaClasse[i].fields.modificador,
					listaClasse[i].fields.persistencia];
					_arrayClasse[classe[0]] = classe;
					PopulaTableClasse(classe);
					$("#cmbClasseFilho").append("<option value='"+classe[0]+"'>"+classe[1]+"</option>");
					$("#cmbClassePai").append("<option value='"+classe[0]+"'>"+classe[1]+"</option>");
		    		$("#cmbClasseImplementacao").append("<option value='"+classe[0]+"'>"+classe[1]+"</option>");
		    	}else{
		    		var _interface = [listaClasse[i].pk, listaClasse[i].fields.nome, listaClasse[i].fields.modificador];
					_arrayInterface[_interface[0]] = _interface;
					PopulaTableInterface(_interface);
					$("#cmbInterface").append("<option value='"+_interface[0]+"'>"+_interface[1]+"</option>");
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

function carregarClasse(idClasse)
{
	$.post("/classe/carregar_ajax", {idClasse:idClasse}, 
		function(data){
		  if(data.status == "OK")
		  {
		    $("#txtClasseEditar").val(data.nome);
		    if(data.modificador == "public")
		    {
		    	$("#rbClassePublicaEditar").prop("checked", true);
		    	$("#rbClassePrivadaEditar").prop("checked", false);
		    	$("#rbClasseProtegidaEditar").prop("checked", false);
		    }else{
		    	if(data.modificador == "private"){
		    		$("#rbClassePublicaEditar").prop("checked", false);
		    		$("#rbClassePrivadaEditar").prop("checked", true);
		    		$("#rbClasseProtegidaEditar").prop("checked", false);
		    	}else{
		    		$("#rbClassePublicaEditar").prop("checked", false);
		    		$("#rbClassePrivadaEditar").prop("checked", false);
		    		$("#rbClasseProtegidaEditar").prop("checked", true);
		    	}
		    }
		    if(data.persistencia == 1)
		    {
		    	$("#ckPersistenciaEditar").prop("checked", true);
		    }else{
		    	$("#ckPersistenciaEditar").prop("checked", false);
		    }
		  }else
		  {
		    $("#lbMensagemErro").text(data.status);
		    $("#modalErro").modal("show");
		  }
		}
	);
}

function cadastrarClasse(nome, modificador, persistencia, projeto_id)
{
  var idClasse = null;

  $.ajax({url: '/classe/cadastrar_ajax',
    type: 'POST', async:false,
    data: {nome:nome, modificador:modificador, persistencia:persistencia, 
    	isInterface: 0, projeto_id: projeto_id,},
    success: function(data)
    {
      if(data.status != "OK")
      {
        $("#modalErro").modal("show");
      }else{
        $("#txtClasse").val("");
        idClasse = data.idClasse;
      }
    }
  });
  return idClasse;
}

function cadastrarInterface(nome, modificador, projeto_id)
{
  var idClasse = null;

  $.ajax({url: '/classe/cadastrar_ajax',
    type: 'POST', async:false,
    data: {nome:nome, modificador:modificador, persistencia:0, 
    	isInterface: 1, projeto_id: projeto_id,},
    success: function(data)
    {
      if(data.status != "OK")
      {
        $("#modalErro").modal("show");
      }else{
        $("#txtClasse").val("");
        idClasse = data.idClasse;
      }
    }
  });
  return idClasse;
}

function verificaNomeClasse(idClasse, nomeClasse, projeto_id){

	var jaExiste = 0;

	$.ajax({url: '/classe/verificanomeclasse_ajax',
		type: 'POST', async:false,
		data: {idClasse:idClasse, nomeClasse: nomeClasse, projeto_id: projeto_id},
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

function editarClasse(idClasse, modificador, nomeClasse, persistencia)
{
  $.ajax({url: '/classe/editar_ajax',
    type: 'POST', async:false,
    data: {idClasse:idClasse, nomeClasse: nomeClasse, modificador:modificador, persistencia:persistencia},
    success: function(data)
    {
      if(data.status == "OK")
      {
        //Altera o nome no array.
        $("#modalEditarClasse").modal("hide")
      }else
      {
        $("#lbMensagemErro").text(data.status);
        $("#modalErro").modal("show");
      }
    }
  });
}

function excluirClasse(idClasse)
{
  $.ajax({url: '/classe/excluir_ajax',
    type: 'POST', async:false,
    data: {idClasse:idClasse},
    success: function(data)
    {
      if(data.status == "OK")
      {
        $("#modalEditarClasse").modal("hide");
      }else
      {
        $("#lbMensagemErro").text(data.status);
        $("#modalErro").modal("show");
      }
    }
  });
}

function recarregarClasses()
{
	$("#dataTable_classes").dataTable().fnClearTable();
	$("#dataTable_interfaces").dataTable().fnClearTable();
	$("#cmbClasseFilho").empty();
	$("#cmbClassePai").empty();
	$("#cmbClasseImplementacao").empty();
	$("#cmbClasseFilho").append("<option value='-1'>-- Selecione --</option>");
	$("#cmbClassePai").append("<option value='-1'>-- Selecione --</option>");
	$("#cmbClasseImplementacao").append("<option value='-1'>-- Selecione --</option>");
  
	$("#cmbInterface").empty();
	$("#cmbInterface").append("<option value='-1'>-- Selecione --</option>");

  	//recarrega a tabela pois pode ter havido remoções e alterações
  	$.each(_arrayClasse, function (index, classe)
	{
		if(classe != null)
		{

			PopulaTableClasse(classe);
			$("#cmbClasseFilho").append("<option value='"+classe[0]+"'>"+classe[1]+"</option>");
	      	$("#cmbClassePai").append("<option value='"+classe[0]+"'>"+classe[1]+"</option>");
	      	$("#cmbClasseImplementacao").append("<option value='"+classe[0]+"'>"+classe[1]+"</option>");
		}
	});

	$.each(_arrayInterface, function (index, classe)
	{
		if(classe != null)
		{
			PopulaTableInterface(classe);
			$("#cmbInterface").append("<option value='"+classe[0]+"'>"+classe[1]+"</option>");
		}
	});
}

function PopulaTableClasse(classe)
{
	var persistencia = classe[3] == 1? "<span>Sim</span>" : "<span>Não</span>";

	// 0 IdProjeto, 1 - nomeCasoUso, 2 - modificador,3 persistencia
	$("#dataTable_classes").dataTable().fnAddData
	(
		[
		  	"<a id='linkEditar_"+classe[0]+"' class='editar' href='#'>"+classe[1]+"</a>",
		  	"<span>"+classe[2]+"</span>",
		  	persistencia,
		  	"<div style='text-align:center'><a id='linkCasosUso_"+classe[0]+"' class='casosUso' href='#'>Definir</a></div>",
        	"<div style='text-align:center'><a id='linkAtributos_"+classe[0]+"' class='atributos' href='#'>Definir</a></div>",
      		"<div style='text-align:center'><a id='linkMetodos_"+classe[0]+"' class='metodos' href='#'>Definir</a></div>",
		]
	);
	return false;
}

function PopulaTableInterface(classe)
{
	// 0 IdProjeto, 1 - nomeInterface, 2 - modificador
	$("#dataTable_interfaces").dataTable().fnAddData
	(
		[
		  	"<a id='linkEditar_"+classe[0]+"' class='editar' href='#'>"+classe[1]+"</a>",
		  	"<span>"+classe[2]+"</span>",
        	"<div style='text-align:center'><a id='linkAtributos_"+classe[0]+"' class='atributos' href='#'>Definir</a></div>",
      		"<div style='text-align:center'><a id='linkMetodos_"+classe[0]+"' class='metodos' href='#'>Definir</a></div>",
		]
	);
	return false;
}