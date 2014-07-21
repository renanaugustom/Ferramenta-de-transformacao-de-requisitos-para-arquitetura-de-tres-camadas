$(
  function()
  {
    DataTable('dataTable_atores');

    $(window).load
    (
      function () {
        var codProjeto = GetURLParameter('cp');
        listarAtores(codProjeto);
        PopulaComboBoxRelacoesAtor();
      }
    );

    $("#btnInserirAtor").click(
      function()
      {
        var nomeAtor = $("#txtNomeAtor").val();
        var idProjeto = GetURLParameter('cp');

        if(nomeAtor == "" || idProjeto == -1)
        {
          $("#lbMensagemAlerta").text("Preencha os campos corretamente");
          $("#modalAlerta").modal("show");
        }else
        {
          $.when(cadastrarAtor(nomeAtor, idProjeto)).done(
            function(idAtor)
            {
              if(idAtor != null){
                var ator = [idAtor, nomeAtor];
                _arrayAtores[idAtor] = ator;
                PopulaTableAtores(ator);
                recarregarComboboxRelacoes();
              }
            }
          );
        } 
      }
    );

    $("#dataTable_atores").delegate(
      "a.editar","click", function()
      {
        var idAtor = $(this).prop("id").split("_")[1];
        $("#hfCodigoAtor").val(idAtor);
        carregarAtor(idAtor);
      }
    );

    $("#btnEditarAtor").click(
        function()
        {
          var idAtor = $("#hfCodigoAtor").val();
          var nomeAtor = $("#txtNomeAtorEditar").val();
          editarAtor(idAtor, nomeAtor);
          recarregarAtores();
          recarregarComboboxRelacoes();
        }
    );

    $("#btnExcluirAtor").click(
        function()
        {
          var idAtor = $("#hfCodigoAtor").val();
          $.when(excluirAtor(idAtor)).done(
            function()
            {
              recarregarAtores();
              recarregarComboboxRelacoes();
            }
          );
        }
    );
  }
);

var _arrayAtores = new Array();

function cadastrarAtor(nomeAtor, projeto_id)
{
  var idAtor = null;

  $.ajax({url: '/ator/cadastrar_ajax',
    type: 'POST', async:false,
    data: {nomeAtor:nomeAtor, projeto_id: projeto_id},
    success: function(data)
    {
      if(data.status != "OK")
      {
        $("#modalErro").modal("show");
      }else{
        $("#txtNomeAtor").val("");
        idAtor = data.idAtor;
      }
    }
  });
  return idAtor;
}

function carregarAtor(idAtor)
{
  $.post("/ator/carregar_ajax", {idAtor:idAtor}, 
    function(data){
      if(data.status == "OK")
      {
        $("#txtNomeAtorEditar").val(data.nomeAtor);
        $("#modalEditarAtor").modal("show");
      }else
      {
        $("#lbMensagemErro").text(data.status);
        $("#modalErro").modal("show");
      }
    }
  );
}

function editarAtor(idAtor, nomeAtor)
{
  $.ajax({url: '/ator/editar_ajax',
    type: 'POST', async:false,
    data: {idAtor:idAtor, nomeAtor: nomeAtor},
    success: function(data)
    {
      if(data.status == "OK")
      {
        //Altera o nome do ator no array.
        _arrayAtores[idAtor][1] = nomeAtor;
        $("#modalEditarAtor").modal("hide")
      }else
      {
        $("#lbMensagemErro").text(data.status);
        $("#modalErro").modal("show");
      }
    }
  });
}

function excluirAtor(idAtor)
{
  $.ajax({url: '/ator/excluir_ajax',
    type: 'POST', async:false,
    data: {idAtor:idAtor},
    success: function(data)
    {
      if(data.status == "OK")
      {
        $("#modalEditarAtor").modal("hide");
        _arrayAtores[idAtor] = null; //remove do array
      }else
      {
        $("#lbMensagemErro").text(data.status);
        $("#modalErro").modal("show");
      }
    }
  });
}

function listarAtores(idProjeto)
{
  var listaAtores;
  $.ajax({url: "/ator/listar_ajax",
    type: 'POST', async:false,
    data: {idProjeto:idProjeto},
    success: function(data){
      if(data.status == "OK")
      {
        listaAtores = data['atores'];
        for (var i=0; i<listaAtores.length; i++) 
        {
          var ator = [listaAtores[i].pk, listaAtores[i].fields.nome];
          _arrayAtores[listaAtores[i].pk] = ator;
          PopulaTableAtores(ator);
        }
      }else
      {
        $("#lbMensagemErro").text(data.status);
        $("#modalErro").modal("show");
      }
    }
  }); 
}

function recarregarAtores()
{
  $("#dataTable_atores").dataTable().fnClearTable();
  //recarrega a tabela pois pode ter havido remoções e alterações
  $.each(_arrayAtores, function (index, ator)
    {
      if(ator != null)
      {
        PopulaTableAtores(ator);
      }
    }
  );
}

function PopulaTableAtores(ator)
{
  // 0 idAtor, 1 - nomeAtor
  $("#dataTable_atores").dataTable().fnAddData
  (
    [
      "<a id='linkEditar_"+ator[0]+"' class='editar' href='#'>"+ator[1]+"</a>",
    ]
  );
  return false;
}

function PopulaComboBoxRelacoesAtor()
{
  $.each(_arrayAtores, function (index, ator){
    if(ator != null)
    {
      $("#cmbComponente1").append("<option value='"+ator[0]+"#ator'>"+ator[1]+"</option>");
      $("#cmbComponente2").append("<option value='"+ator[0]+"#ator'>"+ator[1]+"</option>");
    }
  });
}