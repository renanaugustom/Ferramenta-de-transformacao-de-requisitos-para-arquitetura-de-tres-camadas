var _arrayParametro = new Array();

$(
	function() {
		DataTable("dataTable_parametro");

	    $("#btnInserirParametro").click(
			function()
			{
				var nomeParametro = $("#txtParametro").val();
				var tipo = $("#cmbTipoParametro").val();
				var nomeTipo = $("#cmbTipoParametro option:selected").text();
				var idMetodo = $("#hfCodigoMetodo").val();

				$.when(verificaNomeParametro(nomeParametro, idMetodo)).done(
					function(jaExiste){
						if(jaExiste == 1)
						{
							$("#lbMensagemAlerta").text("Este parâmetro já existe.");
							$("#modalAlerta").modal("show");
						}else{
							$.when(cadastrarParametro(nomeParametro, tipo, idMetodo)).done(
							  function(idParametro)
							  {
							    if(idParametro != null){
							      var parametro = [idParametro, nomeParametro, tipo, nomeTipo];
							      _arrayParametro[idParametro] = parametro;
							      PopulaTableParametro(parametro); //Popula a tabela
							    }
							  }
							);
						}
					}
				);
			}
	    );

	    $("#dataTable_parametro").delegate(
			"a.excluirParametro","click", function()
			{
				var idParametro = $(this).prop("id").split("#")[1];

				$.when(excluirParametro(idParametro)).done(
				    function()
				    {
				    	recarregarParametro();//recarrega o datatable
				    }
				);
			}
	    );
	}
);

function listarParametros(idMetodo)
{
	var listaParametros;
	_arrayParametro = new Array();

	$("#dataTable_parametro").dataTable().fnClearTable();

	$.ajax({url: '/parametros/listar_ajax',
		type: 'POST', async:false,
    	data: {idMetodo: idMetodo},
		success : function(data){
		  if(data.status == "OK")
		  {
		    listaParametros = data['parametros'];
		    for (var i=0; i<listaParametros.length; i++) 
		    {
		      var parametro = [listaParametros[i].pk, listaParametros[i].nome, 
		      	listaParametros[i].tipo, listaParametros[i].nomeTipo];
		      _arrayParametro[listaParametros[i].pk] = parametro;
		      PopulaTableParametro(parametro);
		    }
		  }else
		  {
		    $("#lbMensagemErro").text(data.status);
		    $("#modalErro").modal("show");
		  }
		}
	}); 
}

function cadastrarParametro(nome, tipo_id, metodo_id)
{
  var idParametro = null;

  $.ajax({url: '/parametros/cadastrar_ajax',
    type: 'POST', async:false,
    data: {nome:nome, tipo_id:tipo_id, metodo_id: metodo_id},
    success: function(data)
    {
      if(data.status != "OK")
      {
        $("#modalErro").modal("show");
      }else{
        $("#txtParametro").val("");
        idParametro = data.idParametro;
      }
    }
  });
  return idParametro;
}

function verificaNomeParametro(nomeParametro, metodo_id){

	var jaExiste = 0;

	$.ajax({url: '/parametros/verificanomeparametro_ajax',
		type: 'POST', async:false,
		data: {nomeParametro:nomeParametro, metodo_id: metodo_id},
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

function excluirParametro(idParametro)
{
  $.ajax({url: '/parametros/excluir_ajax',
    type: 'POST', async:false,
    data: {idParametro:idParametro},
    success: function(data)
    {
      if(data.status == "OK")
      {
        $("#modalEditarCasoUso").modal("hide");
        _arrayParametro[idParametro] = null; //remove do array
      }else
      {
        $("#lbMensagemErro").text(data.status);
        $("#modalErro").modal("show");
      }
    }
  });
}

function recarregarParametro()
{
  $("#dataTable_parametro").dataTable().fnClearTable();
  //recarrega a tabela pois pode ter havido remoções e alterações
  $.each(_arrayParametro, function (index, parametro)
    {
      if(parametro != null)
      {
        PopulaTableParametro(parametro);
      }
    }
  );
}

function PopulaTableParametro(parametro)
{
	// 0 idParametro, 1 - nomeParametro, 2 - tipoParametro, 3 - nomeTipo
	$("#dataTable_parametro").dataTable().fnAddData
	(
		[
		  "<div>"+parametro[1]+"</div>",
		  "<div>"+parametro[3]+"</div>",
		  "<a id='linkExcluirParametro#"+parametro[0]+"' class='excluirParametro' href='#'>Excluir</a>",
		]
	);
	return false;
}