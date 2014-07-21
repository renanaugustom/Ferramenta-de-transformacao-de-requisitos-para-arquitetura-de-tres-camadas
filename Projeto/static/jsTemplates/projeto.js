$(
  function()
  {
    DataTable('dataTable_projetos');

    $(window).load
    (
      function () {
        listar();
      }
    );

    $("#btnInserir").click(
      function()
      {
        var nomeProjeto = $("#txtProjeto").val();
        $.when(cadastrar(nomeProjeto)).done(
          function(idProjeto)
          {
            if(idProjeto != null){
              var projeto = [idProjeto, nomeProjeto];
              _arrayProjetos[idProjeto] = projeto;
              PopulaTableProjetos(projeto);
            }
          }
        );
      }
    );

    $("#dataTable_projetos").delegate(
      "a.editar","click", function()
      {
        var idProjeto = $(this).prop("id").split("_")[1];
        $("#hfCodigoProjeto").val(idProjeto);
        carregar(idProjeto);
      }
    ).delegate
    (
      "a.gerarCodigo","click", function()
      {
        var idProjeto = $(this).prop("href").split("#")[1];
        gerarCodigos(idProjeto);
      }
    );

    $("#btnEditar").click(
        function()
        {
          var idProjeto = $("#hfCodigoProjeto").val();
          var nomeProjeto = $("#txtProjetoEditar").val();
          editar(idProjeto, nomeProjeto);
          recarregarProjetos();
        }
    );

    $("#btnExcluir").click(
        function()
        {
          var idProjeto = $("#hfCodigoProjeto").val();
          $.when(excluir(idProjeto)).done(
            function()
            {
              recarregarProjetos();
            }
          );
        }
    );
  }
);

var _arrayProjetos = new Array();

function cadastrar(projeto)
{
  var idProjeto = null;

  $.ajax({url: '/projetos/cadastrar_ajax',
    type: 'POST', async:false,
    data: {texto:projeto},
    success: function(data)
    {
      if(data.status != "OK")
      {
        $("#modalErro").modal("show");
      }else{
        $("#txtProjeto").val("");
        idProjeto = data.idProjeto;
      }
    }
  });
  return idProjeto;
}

function carregar(idProjeto)
{
  $.post("/projetos/carregar_ajax", {idProjeto:idProjeto}, 
    function(data){
      if(data.status == "OK")
      {
        $("#txtProjetoEditar").val(data.nomeProjeto);
        $("#modalEditar").modal("show");
      }else
      {
        $("#lbMensagemErro").text(data.status);
        $("#modalErro").modal("show");
      }
    }
  );
}

function editar(idProjeto, nomeProjeto)
{
  $.ajax({url: '/projetos/editar_ajax',
    type: 'POST', async:false,
    data: {idProjeto:idProjeto, nomeProjeto: nomeProjeto},
    success: function(data)
    {
      if(data.status == "OK")
      {
        //Altera o nome do projeto no array.
        _arrayProjetos[idProjeto][1] = nomeProjeto;
        $("#modalEditar").modal("hide")
      }else
      {
        $("#lbMensagemErro").text(data.status);
        $("#modalErro").modal("show");
      }
    }
  });
}

function excluir(idProjeto)
{
  $.ajax({url: '/projetos/excluir_ajax',
    type: 'POST', async:false,
    data: {idProjeto:idProjeto},
    success: function(data)
    {
      if(data.status == "OK")
      {
        $("#modalEditar").modal("hide");
        _arrayProjetos[idProjeto] = null; //remove do array
      }else
      {
        $("#lbMensagemErro").text(data.status);
        $("#modalErro").modal("show");
      }
    }
  });
}

function listar()
{
  var listaProjetos;
  $.post("/projetos/listar_ajax", 
    function(data){
      if(data.status == "OK")
      {
        listaProjetos = data['projetos'];
        for (var i=0; i<listaProjetos.length; i++) 
        {
          var projeto = [listaProjetos[i].pk, listaProjetos[i].fields.nome];
          _arrayProjetos[listaProjetos[i].pk] = projeto;
          PopulaTableProjetos(projeto);
        }
      }else
      {
        $("#lbMensagemErro").text(data.status);
        $("#modalErro").modal("show");
      }
    }
  ); 
}

function gerarCodigos(idProjeto)
{
  $.ajax({url: '/gerarcodigo/gerarcodigo_ajax',
    type: 'POST', async:false,
    data: {idProjeto:idProjeto},
    success: function(data)
    {
      $("#modalGerarCodigo").modal("show");
      //alert("deu certo");
    }
  });
}

function recarregarProjetos()
{
  $("#dataTable_projetos").dataTable().fnClearTable();
  //recarrega a tabela pois pode ter havido remoções e alterações
  $.each(_arrayProjetos, function (index, projeto)
    {
      if(projeto != null)
      {
        PopulaTableProjetos(projeto);
      }
    }
  );
}

function PopulaTableProjetos(projeto)
{
  // 0 IdProjeto, 1 - nomeProjeto
  $("#dataTable_projetos").dataTable().fnAddData
  (
    [
      "<a id='linkEditar_"+projeto[0]+"' class='editar' href='#'>"+projeto[1]+"</a>",
      "<div style='text-align:center'><a href='/casosdeuso?cp="+projeto[0]+"'>Definir</a></div>",
      "<div style='text-align:center'><a href='/classe?cp="+projeto[0]+"'>Definir</a></div>",
      "<div style='text-align:center'><a class='gerarCodigo' href='#"+projeto[0]+"'>Gerar</a></div>",
    ]
  );
  return false;
}