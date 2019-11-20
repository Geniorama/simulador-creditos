/* Añade aquí tu código JavaScript.

Si estás usando la biblioteca jQuery, entonces no olvides envolver tu código dentro de jQuery.ready() así:

jQuery(document).ready(function( $ ){
    // Tu código aquí dentro
});

--

Si quieres enlazar a un archivo JavaScript que resida en otro servidor (como
<script src="https://example.com/your-js-file.js"></script>), entonces, por favor, usa
la página «Añadir código HTML» , ya que es un código HTML que enlaza a un archivo JavaScript.

Fin del comentario */ 

/*============== FUNCIONES AUXILIARES ===================*/

function sumarDias(fecha, dias){
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
}

function sumarMeses(fecha, num_meses){
    fecha.setMonth(fecha.getMonth() + num_meses);
    return fecha;
}

function crearFecha(dia, mes, ano, separador) {
    var dia = dia.toString();
    var mes = mes.toString();
  
    if (dia.length <= 1) {
        dia = '0' + dia;
    }

    var fecha = dia + separador + mes + separador + ano.toString();
    
    return fecha;
}


function crearFechaMinMax(dia, mes, ano, separador) {
    dia = dia.toString();
    mes = mes + 1
    mes = mes.toString();
  
    if (dia.length <= 1) {
        dia = '0' + dia;
    } else if (mes.length <= 1){
        mes = '0' + mes;
    }

    fecha = ano.toString() + separador + mes + separador + dia;
    
    return fecha;
}

function sumaMultiple(arreglo){
    var suma = 0;

    for (let numero of arreglo) {
        numero = parseInt(numero);
        suma = suma + numero;
    }

    return suma;
}

function convertMoneda(numero) {
    numero = new Intl.NumberFormat('es-CO').format(numero)
    numero = '$'+numero

    return numero
}


/*============== VARIABLES GLOBALES ===================*/

const form_simulador = document.querySelector('#simulator')

if(form_simulador){
  const cont_cuotas = document.getElementById('cuotas')
  const cont_res = document.querySelector('#res')
  const label_value = document.querySelector('.text-large')
  const botonPDF = document.querySelector('#button-pdf')
  const meses = new Array ("Ene.","Feb.","Mar.","Abr.","May.","Jun.","Jul.","Ago.","Sept.","Oct.","Nov.","Dic.");
  const container_res = document.querySelector('#container-result')


  /*============== FUNCIONES FORMULARIO ===================*/


  const campo_fecha = document.querySelector('#fecha')
  let get_fecha_actual = new Date();

  
  fecha_actual_selec = crearFechaMinMax(get_fecha_actual.getDate(), get_fecha_actual.getMonth(), get_fecha_actual.getFullYear(), '-');

  campo_fecha.setAttribute('min', fecha_actual_selec)

  let fecha_max = sumarDias(get_fecha_actual, 60)

  fecha_max = crearFechaMinMax(fecha_max.getDate(), fecha_max.getMonth(), fecha_max.getFullYear(), '-')

  campo_fecha.setAttribute('max', fecha_max)
  campo_fecha.addEventListener('click', function() {
      console.log(this.value)
  })

  


  const tipo_programa = document.querySelector('#tipo-programa')

  tipo_programa.addEventListener('change', function() {

      let valor_programa = this.value

          //Pregrado
          if (valor_programa == 1) {
              valor = 'Pregrado';
              const num_opciones = 6;
              let element = '<option selected>Selecciona una opción</option>';

              for (let index = 0; index < num_opciones; index++) {
                  let num_opcion = index + 1
                  element += `<option value=${num_opcion}>${num_opcion}</option>`
              }
              cont_cuotas.innerHTML = element;

          } else if (valor_programa == 2) {
              //Postgrado
              valor = 'Postgrado';
              const num_opciones = 12;
              let element = '<option selected>Selecciona una opción</option>';

              for (let index = 0; index < num_opciones; index++) {
                  let num_opcion = index + 1
                  element += `<option value=${num_opcion}>${num_opcion}</option>`
              }
              cont_cuotas.innerHTML = element;
          }   

  })


  //Simulador

  class Simulator {
      constructor(arreglo_datos){
          this.monto = arreglo_datos.monto;
          this.cuotas = arreglo_datos.cuotas;
          this.fecha = arreglo_datos.fecha_pick;
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

      calculate(){

          var cuota_fija = Math.round(this.monto *( (this.tasa * Math.pow(1 + this.tasa, this.cuotas)) / (Math.pow(1 + this.tasa, this.cuotas) - 1) ));
          var fecha = this.fecha;
          var fecha = fecha.split('-');
          fecha = new Date(fecha[0], fecha[1] - 1, fecha[2]);

          var estudio = 0
          var seguro_cuota = 0
          var iva = 0
          var comision = 0
          var iva_19 = 0
          var suma_seguro_cuota = 0
          var total_cuota = 0

          var items = new Array();

              for (var i=0; i < this.cuotas; i++) {
                  let numero = i + 1;
                  let interes = Math.round(this.monto * this.tasa);
                  let abono_al_capital = Math.round(cuota_fija - interes);

                  this.monto -= Math.round(abono_al_capital);
                  let saldo_total = this.monto + abono_al_capital;

                  let fecha_pagos = crearFecha(fecha.getDate(), meses[fecha.getMonth()], fecha.getFullYear(), ' / ');

                  sumarMeses(fecha, 1);

                  console.log(fecha)

                  let pago_seguro = Math.round((saldo_total * this.seguro) / 100);

                  suma_seguro_cuota = pago_seguro + suma_seguro_cuota

                  interes = convertMoneda(interes)
                  saldo_total = convertMoneda(saldo_total)
                  abono_al_capital = convertMoneda(abono_al_capital)

                  var item = {
                      fecha_pago : fecha_pagos,
                      numero : numero, 
                      interes : interes, 
                      abono_al_capital : abono_al_capital, 
                      cuota_fija : total_cuota,
                      saldo_al_capital : saldo_total,
                      seguro_cuota : seguro_cuota,
                      comision : comision
                  };

                  items.push(item);
              };

              //Valores fijos
              estudio = Math.round(((suma_seguro_cuota + this.transferencia + this.recaudo * this.cuotas + this.papeleria) / this.cuotas) * this.cuotas);
              seguro_cuota = Math.round(estudio / this.cuotas);
              iva = Math.round((seguro_cuota * this.iva) / 100);
              comision = Math.round((((cuota_fija + seguro_cuota + iva) / (1-((1*this.tasa_aval)/100)*(1+((1*this.iva)/100))))-(cuota_fija + seguro_cuota + iva)) / (1+((1*this.iva)/100)));
              iva_19 = Math.round((comision*this.iva)/100);

              itemsCuota = [cuota_fija, comision, iva_19, seguro_cuota, iva];
              var itemsCuota = [cuota_fija, comision, iva_19, seguro_cuota, iva];
              total_cuota = sumaMultiple(itemsCuota);

              for (const iterator of items) {
                  iterator.cuota_fija = convertMoneda(total_cuota)
                  iterator.seguro_cuota = convertMoneda(seguro_cuota) 
                  iterator.comision = convertMoneda(comision)
              }

          return items;

      }
  }


  //DIBUJANDO LA TABLA
  form_simulador.addEventListener('submit', function(e) {
      e.preventDefault();

      datos = new FormData(form_simulador);

      var datos_formulario = {
          monto  : parseInt(datos.get('valor')),
          cuotas : parseInt(datos.get('cuotas')),
          fecha_pick  : datos.get('fecha'),
          modo   : datos.get('modo-pago'),
          programa : datos.get('tipo-programa'),
          tasa : 0.014,
          seguro : 0.028,
          recaudo : 2100,
          papeleria : 2000,
          transferencia : 5355,
          iva : 19,
          tasa_aval : 3.7,
      }

      console.log(datos_formulario.fecha_pick)

      if(datos_formulario.modo == 0){
            alert('Debes seleccionar un modo de pago')
      } else if (datos_formulario.cuotas == 0){
            alert('Debes seleccionar la cantidad de cuotas')
      } else if (datos_formulario.programa == 0){
            alert('Debes seleccionar el tipo de programa')
      } else {
            if (datos_formulario.modo == 2) {
                datos_formulario.tasa_aval = 3.0
            } 
            
            const simulacion = new Simulator(datos_formulario);

            const valores = simulacion.calculate();

            container_res.classList.remove('d-none');

            cont_res.innerHTML = '';



            for (const valor of valores) {

                    cont_res.innerHTML += `
                    <tr>
                        <td>${valor.numero}</td>
                        <td>${valor.fecha_pago}</td>
                        <td>${valor.saldo_al_capital}</td> 
                        <td>${valor.interes}</td>
                        <td>${valor.abono_al_capital}</td>
                        <td>${valor.comision}</td> 
                        <td>${valor.seguro_cuota}</td> 
                        <td>${valor.cuota_fija}</td>              
                    </tr>
                    `;

                    if (valor.numero == 1) {
                        label_value.innerHTML = valor.cuota_fija
                    }
            }  

            
            botonPDF.addEventListener('click', function(e) {
                e.preventDefault()
                var doc = new jsPDF('landscape');
            
                doc.setFontSize(12)
                doc.text(20, 20, 'SIMULADOR CRÉDITO EDUCATIVO');

                doc.setFontSize(9)

                let fecha_actual = new Date();
                fecha_actual = crearFecha(fecha_actual.getDate(), meses[fecha_actual.getMonth()], fecha_actual.getFullYear(), ' / ');

                if (datos_formulario.modo == 1) {
                    datos_formulario.modo = 'Pagaré'
                } else if (datos_formulario.modo == 2) {
                    datos_formulario.modo = 'Cheque'
                }

                if (datos_formulario.programa == 1) {
                    datos_formulario.programa = 'Pregrado'
                } else if (datos_formulario.programa == 2) {
                    datos_formulario.programa = 'Postgrado'
                }

                doc.text(20, 30, `Fecha de simulación: ${fecha_actual}`);
                doc.text(20, 35, `Modo de pago: ${datos_formulario.modo}`);
                doc.text(20, 40, `Tipo de programa: ${datos_formulario.programa}`);
                doc.text(20, 45, `Valor solicitado: ${convertMoneda(datos_formulario.monto)}`);
                doc.text(20, 50, `Plazo: ${datos_formulario.cuotas} meses`);

                //Encabezados tabla
                doc.line(20, 56, 250, 56); 

                doc.text(20, 62, 'No. Cuota');
                doc.text(40, 62, 'Fecha pago');
                doc.text(80, 62, 'Saldo');
                doc.text(110, 62, 'Intereses');
                doc.text(140, 62, 'Abono al capital');
                doc.text(170, 62, 'Comisión');
                doc.text(200, 62, 'Seguro');
                doc.text(230, 62, 'Valor cuota');

                doc.line(20, 65, 250, 65);

                var numero_inicial_fila = 65

                for (const item of valores) {
                    numero_inicial_fila = numero_inicial_fila + 10
                    doc.text(20, numero_inicial_fila, `${item.numero}`)
                    doc.text(40, numero_inicial_fila, `${item.fecha_pago}`)
                    doc.text(80, numero_inicial_fila, `${item.saldo_al_capital}`)
                    doc.text(110, numero_inicial_fila, `${item.interes}`)
                    doc.text(140, numero_inicial_fila, `${item.abono_al_capital}`)
                    doc.text(170, numero_inicial_fila, `${item.comision}`)
                    doc.text(200, numero_inicial_fila, `${item.seguro_cuota}`)
                    doc.text(230, numero_inicial_fila, `${item.cuota_fija}`)
                }


                //Guardar pdf
                doc.save('Simulación Crédito - Fund. Michelsen.pdf')
            })

      }
  })

}
