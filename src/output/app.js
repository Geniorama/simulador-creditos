"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//Simulador
var Simulator =
/*#__PURE__*/
function () {
  function Simulator(arreglo_datos) {
    _classCallCheck(this, Simulator);

    this.monto = arreglo_datos.monto;
    this.cuotas = arreglo_datos.cuotas;
    this.fecha_solicitud = arreglo_datos.fecha_solicitud;
    this.fecha = arreglo_datos.fecha_pick;
    this.cont_dias = arreglo_datos.cont_dias;
    this.modo = arreglo_datos.modo;
    this.programa = arreglo_datos.programa;
    this.tasa = arreglo_datos.tasa;
    this.seguro = arreglo_datos.seguro;
    this.recaudo = arreglo_datos.recaudo;
    this.papeleria = arreglo_datos.papeleria;
    this.transferencia = arreglo_datos.transferencia;
    this.iva = arreglo_datos.iva;
    this.tasa_aval = arreglo_datos.tasa_aval;
  }

  _createClass(Simulator, [{
    key: "calculate",
    value: function calculate() {
      var fecha = this.fecha;
      var contdias = this.cont_dias;
      fecha = fecha.split('-');
      fecha = new Date(fecha[0], fecha[1] - 1, fecha[2]);
      var estudio = 0;
      var seguro_cuota = 0;
      var iva = 0;
      var comision = 0;
      var iva_19 = 0;
      var suma_seguro_cuota = 0;
      var total_cuota = 0;
      var saldo_inicial = this.monto;
      var cuota_fija = 0;
      var items = new Array();

      for (var i = 0; i < this.cuotas; i++) {
        var numero = i + 1;
        var interes = 0; //Variación de interés por días de interés

        if (numero == 1) {
          // interes = Math.round((this.monto * this.tasa) / 30) * contdias;
          interes = this.monto * this.tasa / 30 * contdias;
          interes = Math.round(interes);
          cuota_fija = calcCuotaFija(this.monto, Math.pow(1 + this.tasa, contdias / 30) - 1, this.cuotas);
          var k = Math.round(cuota_fija - interes);
        } else {
          interes = Math.round(saldo_inicial * this.tasa);
          cuota_fija = calcCuotaFija(this.monto - k, this.tasa, this.cuotas - 1);
        }

        var abono_al_capital = Math.round(cuota_fija - interes);
        saldo_inicial -= Math.round(abono_al_capital);
        var saldo_total = saldo_inicial + abono_al_capital;
        var fecha_pagos = crearFecha(fecha.getDate(), meses[fecha.getMonth()], fecha.getFullYear(), ' / ');
        sumarMeses(fecha, 1);
        var pago_seguro = Math.round(saldo_total * this.seguro / 100);
        suma_seguro_cuota = pago_seguro + suma_seguro_cuota;
        interes = convertMoneda(interes);
        saldo_total = convertMoneda(saldo_total);
        abono_al_capital = convertMoneda(abono_al_capital);
        var item = {
          fecha_pago: fecha_pagos,
          numero: numero,
          interes: interes,
          abono_al_capital: abono_al_capital,
          cuota_fija: total_cuota,
          saldo_al_capital: saldo_total,
          seguro_cuota: seguro_cuota,
          comision: comision
        };
        items.push(item);
      }

      ; //Valores fijos

      estudio = Math.round((suma_seguro_cuota + this.transferencia + this.recaudo * this.cuotas + this.papeleria) / this.cuotas * this.cuotas);
      seguro_cuota = Math.round(estudio / this.cuotas);
      iva = Math.round(seguro_cuota * this.iva / 100);
      var contador = 0;

      for (var _i = 0, _items = items; _i < _items.length; _i++) {
        var iterator = _items[_i];
        contador = contador + 1;

        if (contador == 1) {
          cuota_fija = calcCuotaFija(this.monto, Math.pow(1 + this.tasa, contdias / 30) - 1, this.cuotas);
        } else {
          cuota_fija = calcCuotaFija(this.monto - k, this.tasa, this.cuotas - 1);
        }

        comision = Math.round(((cuota_fija + seguro_cuota + iva) / (1 - 1 * this.tasa_aval / 100 * (1 + 1 * this.iva / 100)) - (cuota_fija + seguro_cuota + iva)) / (1 + 1 * this.iva / 100));
        iva_19 = Math.round(comision * this.iva / 100);
        var itemsCuota = [cuota_fija, comision, iva_19, seguro_cuota, iva];
        total_cuota = sumaMultiple(itemsCuota);
        iterator.cuota_fija = convertMoneda(total_cuota);
        iterator.seguro_cuota = convertMoneda(seguro_cuota);
        iterator.comision = convertMoneda(comision);
      }

      return items;
    }
  }]);

  return Simulator;
}();
/*============== FUNCIONES FORMULARIO ===================*/


var form_simulador = document.getElementById('simulator');

if (form_simulador) {
  //Campos
  var input_cuotas = document.getElementById('cuotas');
  var input_solicitud = document.getElementById('fecha-solicitud');
  var input_cuota_uno = document.getElementById('fecha-cuota-uno');
  var input_tipo_programa = document.getElementById('tipo-programa');
  var input_monto = document.getElementById('valor');
  var input_modo_pago = document.getElementById('modo-pago'); //Contenedores

  var cont_res = document.getElementById('res');
  var label_value = document.querySelector('.text-large');
  var container_res = document.getElementById('container-result');
  var get_fecha_actual = new Date();
  var fecha_actual_selec = crearFechaMinMax(get_fecha_actual.getDate(), get_fecha_actual.getMonth(), get_fecha_actual.getFullYear(), '-');
  input_solicitud.setAttribute('min', fecha_actual_selec);
  input_cuota_uno.readOnly = true; //Fechas

  input_solicitud.addEventListener('change', function () {
    if (this.value === '') {
      input_cuota_uno.readOnly = true;
    } else {
      input_cuota_uno.readOnly = false;
      input_cuota_uno.setAttribute('min', this.value);
      var fecha_actual_solicitud = this.value.split('-');
      fecha_actual_solicitud = new Date(fecha_actual_solicitud[0], fecha_actual_solicitud[1] - 1, fecha_actual_solicitud[2]);
      var fecha_max = sumarDias(fecha_actual_solicitud, 60);
      fecha_max = crearFechaMinMax(fecha_max.getDate(), fecha_max.getMonth(), fecha_max.getFullYear(), '-');
      input_cuota_uno.setAttribute('max', fecha_max);
    }
  }); //Tipo programa

  input_tipo_programa.addEventListener('change', function () {
    //Pregrado
    if (this.value == 1) {
      crearOpciones(6, input_cuotas);
    } else if (this.value == 2) {
      //Posgrado
      crearOpciones(12, input_cuotas);
    }
  }); //Recibiendo datos

  form_simulador.addEventListener('submit', function (e) {
    e.preventDefault();
    var inputsForm = [input_modo_pago, input_tipo_programa, input_monto, input_cuotas, input_solicitud, input_cuota_uno];
    var contador = 0;

    for (var _i2 = 0, _inputsForm = inputsForm; _i2 < _inputsForm.length; _i2++) {
      var input_obj = _inputsForm[_i2];
      var input_name = input_obj.getAttribute('data-name');
      var input_value = input_obj.value;

      var _contador = _contador + 1;

      if (input_value == 0 || input_value == "undefined" || input_value == "" || input_value == null) {
        alert("El campo " + input_name + " está vacío");
        return false;
      } else {
        if (_contador == inputsForm.length) {
          var datos_formulario;

          (function () {
            //Campos
            var getValueInput = function getValueInput(field) {
              var fieldName = document.getElementById(field);
              var fieldVal = fieldName.value;
              return fieldVal;
            };

            //Url Get
            var urlGet = function urlGet(url, button) {
              url_get = "".concat(url, "?modo-pago=").concat(datos_formulario.modo, "&tipo-programa=").concat(datos_formulario.programa, "&valor=").concat(datos_formulario.monto, "&cuotas=").concat(datos_formulario.cuotas, "&fecha-solicitud=").concat(datos_formulario.fecha_solicitud, "&fecha-cuota-uno=").concat(datos_formulario.fecha_pick);
              button.setAttribute('href', url_get);
            };

            var dif_dias = createDate360('fecha-solicitud', 'fecha-cuota-uno');
            datos_formulario = {
              monto: parseInt(getValueInput('valor')),
              cuotas: parseInt(getValueInput('cuotas')),
              fecha_solicitud: getValueInput('fecha-solicitud'),
              fecha_pick: getValueInput('fecha-cuota-uno'),
              cont_dias: dif_dias,
              modo: getValueInput('modo-pago'),
              programa: getValueInput('tipo-programa'),
              tasa: 0.014,
              seguro: 0.028,
              recaudo: 2100,
              papeleria: 2000,
              transferencia: 5355,
              iva: 19,
              tasa_aval: 3.7
            };

            if (datos_formulario.modo == 2) {
              datos_formulario.tasa_aval = 3.0;
            }

            var simulador = new Simulator(datos_formulario);
            var valores = simulador.calculate();
            container_res.classList.remove('d-none');
            cont_res.innerHTML = '';
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = valores[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var valor = _step.value;
                cont_res.innerHTML += "\n                            <tr>\n                                <td>".concat(valor.numero, "</td>\n                                <td>").concat(valor.fecha_pago, "</td>\n                                <td>").concat(valor.cuota_fija, "</td>              \n                            </tr>\n                            ");

                if (valor.numero == 2) {
                  label_value.innerHTML = valor.cuota_fija;
                }
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

            var button_form_send = document.getElementById('button-form-send');
            urlGet('http://univercity.com.co/demo/michelsen/credito-educativo/formulario/', button_form_send);
            var botonPDF = document.querySelector('#button-pdf');
            botonPDF.addEventListener('click', function (e) {
              e.preventDefault();
              var doc = new jsPDF('landscape');
              doc.setFontSize(12);
              doc.text(20, 20, 'SIMULADOR CRÉDITO EDUCATIVO - FUNDACIONES MICHELSEN');
              doc.setFontSize(9);
              var fecha_actual = new Date();
              fecha_actual = crearFecha(fecha_actual.getDate(), meses[fecha_actual.getMonth()], fecha_actual.getFullYear(), ' / ');
              var fecha_solic = datos_formulario.fecha_solicitud;
              fecha_solic = fecha_solic.split('-');
              fecha_solic = new Date(fecha_solic[0], fecha_solic[1] - 1, fecha_solic[2]);
              fecha_solic = crearFecha(fecha_solic.getDate(), meses[fecha_solic.getMonth()], fecha_solic.getFullYear(), ' / ');

              if (datos_formulario.modo == 1) {
                datos_formulario.modo = 'Pagaré';
              } else if (datos_formulario.modo == 2) {
                datos_formulario.modo = 'Cheque';
              }

              if (datos_formulario.programa == 1) {
                datos_formulario.programa = 'Pregrado';
              } else if (datos_formulario.programa == 2) {
                datos_formulario.programa = 'Postgrado';
              }

              doc.text(20, 30, "Fecha de solicitud: ".concat(fecha_solic));
              doc.text(20, 35, "Modo de pago: ".concat(datos_formulario.modo));
              doc.text(20, 40, "Tipo de programa: ".concat(datos_formulario.programa));
              doc.text(20, 45, "Valor solicitado: ".concat(convertMoneda(datos_formulario.monto)));
              doc.text(20, 50, "Plazo: ".concat(datos_formulario.cuotas, " meses"));
              doc.text(210, 30, "Fecha de simulaci\xF3n: ".concat(fecha_actual)); //Encabezados tabla

              doc.line(20, 56, 100, 56);
              doc.text(20, 62, 'No. Cuota');
              doc.text(40, 62, 'Fecha pago');
              doc.text(80, 62, 'Valor cuota');
              doc.line(20, 65, 100, 65);
              var numero_inicial_fila = 65;
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = valores[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var item = _step2.value;
                  numero_inicial_fila = numero_inicial_fila + 10;
                  doc.text(20, numero_inicial_fila, "".concat(item.numero));
                  doc.text(40, numero_inicial_fila, "".concat(item.fecha_pago));
                  doc.text(80, numero_inicial_fila, "".concat(item.cuota_fija));
                }
                /*doc.setFontSize(10)
                doc.text(20, 120, `IMPORTANTE`);
                  doc.setFontSize(7)
                doc.text(20, 130, `1. El valor real de la primera cuota del crédito puede variar del proyectado en esta consulta por motivos de ajuste de los intereses entre la fecha de contabilización del crédito y la fecha de la primera facturación.`);
                  doc.text(20, 136, `2. La fecha de solicitud seleccionada en el formulario se usa para efectos de la simulación, contrario a la fecha de simulación, que corresponde a la fecha de generación de este documento`);
                */
                //Guardar pdf

              } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                    _iterator2["return"]();
                  }
                } finally {
                  if (_didIteratorError2) {
                    throw _iteratorError2;
                  }
                }
              }

              doc.save('Simulación Crédito - Fund. Michelsen.pdf');
            });
          })();
        }
      }
    }
  });
}