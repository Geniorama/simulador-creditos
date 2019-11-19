//ESTE ARCHIVO ES DE LA RAMA NUEVA


/*============== VARIABLES GLOBALES ===================*/

const formulario = document.querySelector('#simulator');
const contenedor = document.querySelector('#variable-content');
const cont_cuotas = document.getElementById('cuotas');
const cont_res = document.querySelector('#res');
const tabla_res = document.querySelector('#tabla-res');


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


function sumaMultiple(arreglo){
    var suma = 0;

    for (let numero of arreglo) {
        numero = parseInt(numero);
        suma = suma + numero;
    }

    return suma;
}



/*============== FUNCIONES FORMULARIO ===================*/

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
        this.fecha = arreglo_datos.fecha;
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
        var meses = new Array ("Ene.","Feb.","Mar.","Abr.","May.","Jun.","Jul.","Ago.","Sept.","Oct.","Nov.","Dic.");
        var cuota_fija = Math.round(this.monto *( (this.tasa * Math.pow(1 + this.tasa, this.cuotas)) / (Math.pow(1 + this.tasa, this.cuotas) - 1) ));
        var fecha = this.fecha;
        var fecha = fecha.split('-');
        fecha = new Date(fecha[0], fecha[1], fecha[2]);
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

                let pago_seguro = Math.round((saldo_total * this.seguro) / 100);

                suma_seguro_cuota = pago_seguro + suma_seguro_cuota


                //Operación comisión

                var item = {
                    fecha_pago : fecha_pagos,
                    numero : numero, 
                    interes : interes, 
                    abono_al_capital : abono_al_capital, 
                    cuota_fija : total_cuota,
                    saldo_al_capital : saldo_total,
                    seguro_cuota : seguro_cuota
                };
 
                items.push(item);
            };

            
            estudio = Math.round(((suma_seguro_cuota + this.transferencia + this.recaudo * this.cuotas + this.papeleria) / this.cuotas) * this.cuotas);
            seguro_cuota = Math.round(estudio / this.cuotas);
            iva = Math.round((seguro_cuota * this.iva) / 100);
            comision = Math.round((((cuota_fija + seguro_cuota + iva) / (1-((1*this.tasa_aval)/100)*(1+((1*this.iva)/100))))-(cuota_fija + seguro_cuota + iva)) / (1+((1*this.iva)/100)));
            iva_19 = Math.round((comision*this.iva)/100);

            itemsCuota = [cuota_fija, comision, iva_19, seguro_cuota, iva];
            var itemsCuota = [cuota_fija, comision, iva_19, seguro_cuota, iva];
            total_cuota = sumaMultiple(itemsCuota);

            for (const iterator of items) {
                iterator.cuota_fija = total_cuota
                iterator.seguro_cuota = seguro_cuota
            }


        return items;

    }
}



//DIBUJANDO LA TABLA
formulario.addEventListener('submit', function(e) {
    e.preventDefault();

    datos = new FormData(formulario);

    var datos_formulario = {
        monto  : parseInt(datos.get('valor')),
        cuotas : parseInt(datos.get('cuotas')),
        fecha  : datos.get('fecha'),
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

    if (datos_formulario.modo == 2) {
        datos_formulario.tasa_aval = 3.0
    } 

    const simulacion = new Simulator(datos_formulario);

    const valores = simulacion.calculate();

    tabla_res.classList.remove('d-none');

    cont_res.innerHTML = '';
    
    for (const valor of valores) {

            cont_res.innerHTML += `
            <tr>
                <td>${valor.numero}</td>
                <td>${valor.fecha_pago}</td>
                <td>${valor.saldo_al_capital}</td> 
                <td>${valor.interes}</td>
                <td>${valor.abono_al_capital}</td>
                <td>${valor.seguro_cuota}</td> 
                <td>${valor.cuota_fija}</td>              
            </tr>
            `;
    }

})
