$(
	function()
	{
		
	}
);

function DataTable(id) 
{
	$("#" + id).dataTable
	(
		{
			"bPaginate": true,
			"bLengthChange": true,
			"bFilter": true,
			"bInfo": false,
			"bAutoWidth": true,
			"sPaginationType": "full_numbers",
			"aLengthMenu": [[5, 10, 20, -1], [5, 10, 20, "Todos"]],
			"oLanguage": 
			{
				"sProcessing":   "Processando...",
				"sLengthMenu":   "Mostrar _MENU_ registros",
				"sZeroRecords":  "Não foram encontrados resultados",
				"sInfo":         "Mostrando de _START_ até _END_ de _TOTAL_ registros",
				"sInfoEmpty":    "Mostrando de 0 até 0 de 0 registros",
				"sInfoFiltered": "(filtrado de _MAX_ registros no total)",
				"sInfoPostFix":  "",
				"sSearch":       "Buscar:",
				"sUrl":          "",
				"oPaginate": 
				{
					"sFirst":    "Primeiro",
					"sPrevious": "Voltar",
					"sNext":     "Proximo",
					"sLast":     "Último"
				}
			}
		}
	);
	$("#" + id + "_filter").hide();
}

/*Função para validar campos data. 
	0 - indica que está validado
	1 - indica que campo esta vazio
	2 - indica que campo não é uma data válida*/
function validaData(valor){
	var erro = 0;

	if($.trim(valor) == ""){
		erro = 1;
	}else if (!$.parseDate(valor)) 
	{
		erro = 2;
	}
	
	return erro;
}

/*Função para validar campos texto. 
	0 - indica que está validado
	1 - indica que campo esta vazio*/
function validaString(valor){
	var erro = 0;

	if($.trim(valor) == ""){
		erro = 1;
	}
	
	return erro;
}

/*Função para validar combobox. 
	0 - indica que alguma opção esta selecionada - validado
	1 - indica que nenhuma opção esta selecionada*/
function validaCombobox(valor){
	var erro = 0;

	if(valor == "-1"){
		erro = 1;
	}
	
	return erro;
}

/*Função para validar float. 
	0 - indica que está validado
	1 - indica que campo esta vazio
	2 - indica que campo não é um float válido*/
function validaFloat(valor){
	var erro = 0;

	if(valor == ""){
		erro = 1;
	}else
	{
		if(isNaN($.parseFloat(valor)))
		{
			erro = 2;
		}
	}
	return erro;
}

/*Função para validar inteiros. 
	0 - indica que está validado
	1 - indica que campo esta vazio
	2 - indica que campo não é um int válido*/
function validaInt(valor){
	var erro = 0;

	if(valor == ""){
		erro = 1;
	}else
	{
		if(isNaN($.parseInt(valor)))
		{
			erro = 2;
		}
	}
	return erro;
}


/*Função usada para pegar os parametros passados pela URL*/
function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
	var i = 0;
    for (i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}