$(
	function() {
		DataTable("dataTable_casosuso");
		
		$(window).load
	    (
	      function () {
	      	var codProjeto = GetURLParameter('cp');
	        listarCasoUso(codProjeto); //lista todos os casos de uso do projeto
	        PopulaComboBoxRelacoesCasoUso();
	      }
	    );

	    $('#myTab a').click(function (e) {
	        e.preventDefault();
	        $(this).tab('show');
	    });

	    $("#btnInserirCasoUso").click(
			function()
			{
				var nomeCasoUso = $("#txtNomeCasoUso").val();
				var descricao = $("#txtDescricaoCasoUso").val();
				var idProjeto = GetURLParameter('cp');
				$.when(cadastrarCasoUso(nomeCasoUso, descricao, idProjeto)).done(
				  function(idCasoUso)
				  {
				    if(idCasoUso != null){
				      var casoUso = [idCasoUso, nomeCasoUso, descricao];
				      _arrayCasosUso[idCasoUso] = casoUso;
				      PopulaTableCasoUso(casoUso); //Popula a tabela de casos de uso
				      recarregarComboboxRelacoes(); //recarrega as combos de relações
				    }
				  }
				);
			}
	    );

	    $("#btnExcluirCasoUso").click(
	        function()
	        {
	          var idCasoUso = $("#hfCodigoCasoUso").val();
	          $.when(excluirCasoUso(idCasoUso)).done(
	            function()
	            {
	            	recarregarCasosUso();//recarrega o datatable
	            	recarregarComboboxRelacoes();//recarrega as combos de relações
	            }
	          );
	        }
	    );

	    $("#btnEditarCasoUso").click(
	        function()
	        {
	          var idCasoUso = $("#hfCodigoCasoUso").val();
	          var nomeCasoUso = $("#txtNomeCasoUsoEditar").val();
	          var descricao = $("#txtDescricaoCasoUsoEditar").val();
	          editarCasoUso(idCasoUso, nomeCasoUso, descricao);
	          recarregarCasosUso();//recarrega o datatable de casos de uso
	          recarregarComboboxRelacoes();//recarrega as combos de relações
	        }
        );

	    $("#dataTable_casosuso").delegate(
	      "a.editar","click", function()
	      {
	        var idCasoUso = $(this).prop("id").split("_")[1];
	        $("#hfCodigoCasoUso").val(idCasoUso);
	        carregarCasoUso(idCasoUso);//carrega as informações para o modal
	      }
	    );

	    $('#linkModal').click(function () {
	        $("#modalEditarCasoUso").modal("show");
	    });


	    // store the currently selected tab in the hash value
	    $("ul.nav-tabs > li > a").on("shown.bs.tab", function (e) {
	        var id = $(e.target).attr("href").substr(1);
	        window.location.hash = id;
	    });

	    // on load of the page: switch to the currently selected tab
	    var hash = window.location.hash;
	    $('#myTab a[href="' + hash + '"]').tab('show');
	}
);

var _arrayCasosUso = new Array();

function listarCasoUso(idProjeto)
{
	var listaCasosUso;
	$.ajax({url: '/casosdeuso/listar_ajax',
		type: 'POST', async:false,
    	data: {idProjeto: idProjeto},
		success : function(data){
		  if(data.status == "OK")
		  {
		    listaCasosUso = data['casosuso'];
		    for (var i=0; i<listaCasosUso.length; i++) 
		    {
		      var casoUso = [listaCasosUso[i].pk, listaCasosUso[i].fields.nome, listaCasosUso[i].fields.descricao];
		      _arrayCasosUso[listaCasosUso[i].pk] = casoUso;
		      PopulaTableCasoUso(casoUso);
		    }
		  }else
		  {
		    $("#lbMensagemErro").text(data.status);
		    $("#modalErro").modal("show");
		  }
		}
	}); 
}

function cadastrarCasoUso(nomeCasoUso, descricao, projeto_id)
{
  var idCasoUso = null;

  $.ajax({url: '/casosdeuso/cadastrar_ajax',
    type: 'POST', async:false,
    data: {nomeCasoUso:nomeCasoUso, descricao:descricao, projeto_id: projeto_id},
    success: function(data)
    {
      if(data.status != "OK")
      {
        $("#modalErro").modal("show");
      }else{
        $("#txtNomeCasoUso").val("");
        $("#txtDescricaoCasoUso").val("");
        idCasoUso = data.idCasoUso;
      }
    }
  });
  return idCasoUso;
}

function editarCasoUso(idCasoUso, nomeCasoUso, descricao)
{
  $.ajax({url: '/casosdeuso/editar_ajax',
    type: 'POST', async:false,
    data: {idCasoUso:idCasoUso, nomeCasoUso: nomeCasoUso, descricao: descricao},
    success: function(data)
    {
      if(data.status == "OK")
      {
        //Altera o nome e descrição do caso de uso no array.
        _arrayCasosUso[idCasoUso][1] = nomeCasoUso;
        _arrayCasosUso[idCasoUso][2] = descricao;
        $("#modalEditarCasoUso").modal("hide")
      }else
      {
        $("#lbMensagemErro").text(data.status);
        $("#modalErro").modal("show");
      }
    }
  });
}

function excluirCasoUso(idCasoUso)
{
  $.ajax({url: '/casosdeuso/excluir_ajax',
    type: 'POST', async:false,
    data: {idCasoUso:idCasoUso},
    success: function(data)
    {
      if(data.status == "OK")
      {
        $("#modalEditarCasoUso").modal("hide");
        _arrayCasosUso[idCasoUso] = null; //remove do array
      }else
      {
        $("#lbMensagemErro").text(data.status);
        $("#modalErro").modal("show");
      }
    }
  });
}

function carregarCasoUso(idCasoUso)
{
	$.post("/casosdeuso/carregar_ajax", {idCasoUso:idCasoUso}, 
		function(data){
		  if(data.status == "OK")
		  {
		    $("#txtNomeCasoUsoEditar").val(data.nomeCasoUso);
		    $("#txtDescricaoCasoUsoEditar").val(data.descricao);
		    $("#modalEditarCasoUso").modal("show");
		  }else
		  {
		    $("#lbMensagemErro").text(data.status);
		    $("#modalErro").modal("show");
		  }
		}
	);
}

function recarregarCasosUso()
{
  $("#dataTable_casosuso").dataTable().fnClearTable();
  //recarrega a tabela pois pode ter havido remoções e alterações
  $.each(_arrayCasosUso, function (index, casoUso)
    {
      if(casoUso != null)
      {
        PopulaTableCasoUso(casoUso);
      }
    }
  );
}

function PopulaTableCasoUso(casoUso)
{
	// 0 IdProjeto, 1 - nomeCasoUso, 2 - descrição
	$("#dataTable_casosuso").dataTable().fnAddData
	(
		[
		  "<a id='linkEditar_"+casoUso[0]+"' class='editar' href='#'>"+casoUso[1]+"</a>",
		  "<div>"+casoUso[2]+"</div>",
		]
	);
	return false;
}

function PopulaComboBoxRelacoesCasoUso()
{
	$.each(_arrayCasosUso, function (index, casoUso){
		if(casoUso != null)
		{
			$("#cmbComponente1").append("<option value='"+casoUso[0]+"#casouso'>"+casoUso[1]+"</option>");
			$("#cmbComponente2").append("<option value='"+casoUso[0]+"#casouso'>"+casoUso[1]+"</option>");
		}
	});
}