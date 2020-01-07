"use strict";

/*============== FUNCIONES AUXILIARES ===================*/
var meses = new Array("Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic.");

function sumarDias(fecha, dias) {
  var fechaSuma = fecha.setDate(fecha.getDate() + dias);
  return fechaSuma;
}

function sumarMeses(fecha, num_meses) {
  fecha.setMonth(fecha.getMonth() + num_meses);
  var fechaSuma;
  return fechaSuma;
}

function crearFecha(dia, mes, agno, separador) {
  var dia = String(dia);
  var mes = String(mes);

  if (dia.length <= 1) {
    dia = '0' + dia;
  }

  var fecha = dia + separador + mes + separador + agno.toString();
  return fecha;
}

function crearFechaMinMax(dia, mes, agno, separador) {
  var diaNuevo = String(dia);
  var mesNuevo = mes + 1;
  mesNuevo = String(mesNuevo);

  if (diaNuevo.length <= 1) {
    diaNuevo = '0' + diaNuevo;
  } else if (mesNuevo.length <= 1) {
    mesNuevo = '0' + mesNuevo;
  }

  var fechaNueva = agno.toString() + separador + mesNuevo + separador + diaNuevo;
  return fechaNueva;
}

function sumaMultiple(arreglo) {
  var suma = 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = arreglo[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var numero = _step.value;
      numero = parseInt(numero);
      suma = suma + numero;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return suma;
}

function convertMoneda(numero) {
  var numeroMoneda = new Intl.NumberFormat('es-CO').format(numero);
  numeroMoneda = '$' + numeroMoneda;
  return numeroMoneda;
}

function validarCampo(input) {
  if (input == "" || input <= 0) {
    alert('Debe diligenciar el campo' + input.getAttribute('data-name'));
    return false;
  } else {
    console.log('Diligenciado');
  }
}

function crearOpciones(numOpciones, contenedor) {
  var element = '<option selected>Selecciona una opción</option>';

  for (var index = 0; index < numOpciones; index++) {
    var num_opcion = index + 1;
    element += "<option value=".concat(num_opcion, ">").concat(num_opcion, "</option>");
  }

  contenedor.innerHTML = element;
}

function calcCuotaFija(monto, tasa, cuotas) {
  //let valor_cuota = monto*((tasa * Math.pow(1 + tasa, cuotas)) / (Math.pow(1 + tasa, cuotas) - 1));
  //Es igual a
  var valor_cuota = tasa * monto / (1 - Math.pow(1 + tasa, -cuotas));
  valor_cuota = Math.round(valor_cuota);
  return valor_cuota;
}

function createDate360(dateInit, dateFinish) {
  var date_init = document.getElementById(dateInit).value;
  var date_finish = document.getElementById(dateFinish).value;
  var dias = 0;
  date_init = date_init.split('-');
  var date_init_year = parseInt(date_init[0]),
      date_init_month = parseInt(date_init[1]),
      date_init_day = parseInt(date_init[2]);
  date_finish = date_finish.split('-');
  var date_finish_year = parseInt(date_finish[0]),
      date_finish_month = parseInt(date_finish[1]),
      date_finish_day = parseInt(date_finish[2]);

  if (date_finish_day < date_init_day) {
    date_finish_day = date_finish_day + 30;
    date_finish_month = date_finish_month - 1;
  }

  if (date_finish_month < date_init_month) {
    date_finish_month = date_finish_month + 12;
    date_finish_year = date_finish_year - 1;
  } //console.log(date_finish_day)


  dias = date_finish_day + 1 - date_init_day + (date_finish_month - date_init_month) * 30 + (date_finish_year - date_init_year) * 360;
  return dias - 1;
}