 //Simulador

 class Simulator {
    constructor(arreglo_datos){
        this.monto = arreglo_datos.monto;
        this.cuotas = arreglo_datos.cuotas;
        this.fecha_solicitud = arreglo_datos.fecha_solicitud;
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
        const meses = new Array ("Ene.","Feb.","Mar.","Abr.","May.","Jun.","Jul.","Ago.","Sept.","Oct.","Nov.","Dic.");
        var fecha_solicitud_simulador = this.fecha_solicitud
        var fecha = this.fecha
        var fecha_ini = new Date(fecha_solicitud_simulador)
        var fecha_fin = new Date(fecha)
        var dif_fechas = fecha_fin.getTime() - fecha_ini.getTime()
        var contdias = Math.round(dif_fechas/(1000*60*60*24));
        var fecha = fecha.split('-')
        fecha = new Date(fecha[0], fecha[1] - 1, fecha[2])
        var estudio = 0
        var seguro_cuota = 0
        var iva = 0
        var comision = 0
        var iva_19 = 0
        var suma_seguro_cuota = 0
        var total_cuota = 0
        var saldo_inicial = this.monto

        let tasa_int = Math.pow((1 + this.tasa), (1/12)) - 1

        var  cuota_fija = calcCuotaFija(this.monto, this.tasa, this.cuotas)

        var items = new Array();

            for (var i=0; i < this.cuotas; i++) {
                let numero = i + 1;
                let interes = 0;

                //Variación de interés por días de interés
                if (numero == 1) {
                    interes = Math.round((saldo_inicial * this.tasa) / 30) * contdias;
                } else {
                    interes = Math.round(saldo_inicial  * this.tasa)
                }


                let abono_al_capital = Math.round(cuota_fija - interes);

                console.log(cuota_fija)
                saldo_inicial -= Math.round(abono_al_capital);
                let saldo_total = saldo_inicial + abono_al_capital;

                let fecha_pagos = crearFecha(fecha.getDate(), meses[fecha.getMonth()], fecha.getFullYear(), ' / ');

                sumarMeses(fecha, 1);

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
            
            let contador = 0

            for (const iterator of items) {

                contador = contador + 1

                comision = Math.round((((cuota_fija + seguro_cuota + iva) / (1-((1*this.tasa_aval)/100)*(1+((1*this.iva)/100))))-(cuota_fija + seguro_cuota + iva)) / (1+((1*this.iva)/100)));
                iva_19 = Math.round((comision*this.iva)/100);
                itemsCuota = [cuota_fija, comision, iva_19, seguro_cuota, iva];
                var itemsCuota = [cuota_fija, comision, iva_19, seguro_cuota, iva];
                total_cuota = sumaMultiple(itemsCuota);

                iterator.cuota_fija = convertMoneda(total_cuota)
                iterator.seguro_cuota = convertMoneda(seguro_cuota) 
                iterator.comision = convertMoneda(comision)
            }

        return items;

    }
}

/*============== FUNCIONES FORMULARIO ===================*/

const form_simulador = document.getElementById('simulator')

if(form_simulador){
  
  //Campos
  const input_cuotas = document.getElementById('cuotas')
  const input_solicitud = document.getElementById('fecha-solicitud')
  const input_cuota_uno = document.getElementById('fecha-cuota-uno')
  const input_tipo_programa = document.getElementById('tipo-programa')
  const input_monto = document.getElementById('valor')
  const input_modo_pago = document.getElementById('modo-pago')

  //Contenedores
  const cont_res = document.getElementById('res')
  const label_value = document.querySelector('.text-large')
  const container_res = document.getElementById('container-result')

  

  let get_fecha_actual = new Date();
  fecha_actual_selec = crearFechaMinMax(get_fecha_actual.getDate(), get_fecha_actual.getMonth(), get_fecha_actual.getFullYear(), '-');
  input_solicitud.setAttribute('min', fecha_actual_selec)
  input_cuota_uno.readOnly = true
  
  //Fechas
  input_solicitud.addEventListener('change', function() {

    if(this.value.value === ''){
            input_cuota_uno.readOnly = true
        } else {
            input_cuota_uno.readOnly = false
            input_cuota_uno.setAttribute('min', this.value)
            
            let fecha_actual_solicitud = this.value.split('-')
            fecha_actual_solicitud = new Date(fecha_actual_solicitud[0], fecha_actual_solicitud[1] - 1, fecha_actual_solicitud[2])
            let fecha_max = sumarDias(fecha_actual_solicitud, 60)
            fecha_max = crearFechaMinMax(fecha_max.getDate(), fecha_max.getMonth(), fecha_max.getFullYear(), '-')
            input_cuota_uno.setAttribute('max', fecha_max)
        }
    })

  //Tipo programa
  input_tipo_programa.addEventListener('change', function() {
          //Pregrado
          if (this.value == 1) {
            crearOpciones(6, input_cuotas)
          } else if (this.value == 2) {
          //Posgrado
            crearOpciones(12, input_cuotas)
          }   
  })

  //Recibiendo datos
  form_simulador.addEventListener('submit', function(e) {
      e.preventDefault();

      inputsForm = [input_modo_pago, input_tipo_programa, input_monto, input_cuotas,  input_solicitud, input_cuota_uno]

      var contador = 0

      for (const input_obj of inputsForm) {
          input_name = input_obj.getAttribute('data-name')
          input_value = input_obj.value

          contador = contador + 1
          
          if (input_value == 0 || input_value == "undefined" || input_value == "" || input_value == null) {
               alert("El campo " + input_name + " está vacío")
               return false
          } else {
            if(contador == inputsForm.length){
                    let datos = new FormData(form_simulador);

                    var datos_formulario = {
                        monto  : parseInt(datos.get('valor')),
                        cuotas : parseInt(datos.get('cuotas')),
                        fecha_solicitud : datos.get('fecha-solicitud'),
                        fecha_pick  : datos.get('fecha-cuota-uno'),
                        modo   : datos.get('modo-pago'),
                        programa : datos.get('tipo-programa'),
                        tasa : 0.014,
                        seguro : 0.028,
                        recaudo : 2100,
                        papeleria : 2000,
                        transferencia : 5355,
                        iva : 19,
                        tasa_aval : 3.7
                    }

                    if (datos_formulario.modo == 2) {
                        datos_formulario.tasa_aval = 3.0
                    } 
                    
                    const simulador = new Simulator(datos_formulario);
                    const valores = simulador.calculate();
        
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
        
                            if (valor.numero == 2) {
                                label_value.innerHTML = valor.cuota_fija
                            }
                    }  
        
                    const botonPDF = document.querySelector('#button-pdf')
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
             
          }

      }

  })

}
