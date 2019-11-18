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
    constructor(monto, cuotas, fecha, modo, programa, tasa, seguro, recaudo, papeleria, transferencia, iva, tasa_aval, estudio){
        this.monto = monto;
        this.cuotas = cuotas;
        this.fecha = fecha;
        this.modo = modo;
        this.programa = programa;
        this.tasa = tasa;
        this.seguro = seguro;
        this.recaudo = recaudo;
        this.papeleria = papeleria;
        this.transferencia = transferencia;
        this.iva = iva;
        this.tasa_aval = tasa_aval;
        this.estudio = estudio;
        
    }

    calculate(){
        var meses = new Array ("Ene.","Feb.","Mar.","Abr.","May.","Jun.","Jul.","Ago.","Sept.","Oct.","Nov.","Dic.");
   
        var numero = 0;
        var cuota_fija = Math.round(this.monto *( (this.tasa * Math.pow(1 + this.tasa, this.cuotas)) / (Math.pow(1 + this.tasa, this.cuotas) - 1) ));
        var interes = 0;
        var num_cuotas = this.cuotas;
        var abono_al_capital = 0;
        var saldo_al_capital = this.monto;
        var fecha = this.fecha;
        var fecha = fecha.split('-');
        fecha = new Date(fecha[0], fecha[1], fecha[2]);
        var suma_total_pago_seguro = 0
        var saldo_total = 0;
        var fecha_pagos = '';
        var pago_seguro = 0;

        this.estudio = Math.round(((309 + this.transferencia + this.recaudo * this.cuotas + this.papeleria) / this.cuotas) * this.cuotas);
        var seguro_cuota = Math.round(this.estudio / this.cuotas);
        var iva = Math.round((seguro_cuota * this.iva) / 100);
        var comision = 0;
        var iva_19 = 0;
        var total_cuota = 0;

        var items = new Array();

            for (var i=0; i < num_cuotas; i++) {
                numero = i + 1;
                interes = Math.round(saldo_al_capital * this.tasa);
                abono_al_capital = Math.round(cuota_fija - interes);
                saldo_al_capital -= Math.round(abono_al_capital);
                saldo_total = saldo_al_capital + abono_al_capital;
                
                fecha_pagos = crearFecha(fecha.getDate(), meses[fecha.getMonth()], fecha.getFullYear(), ' - ');
                sumarMeses(fecha, 1);
                
                pago_seguro = Math.round((saldo_total * this.seguro) / 100);

                suma_total_pago_seguro = suma_total_pago_seguro + pago_seguro

                //Operación comisión
                comision = Math.round((((cuota_fija + seguro_cuota + iva) / (1-((1*this.tasa_aval)/100)*(1+((1*this.iva)/100))))-(cuota_fija + seguro_cuota + iva)) / (1+((1*this.iva)/100)));
                iva_19 = Math.round((comision*this.iva)/100);

                let itemsCuota = [cuota_fija, comision, iva_19, seguro_cuota, iva];
                total_cuota = sumaMultiple(itemsCuota);

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


           

           console.log(this.estudio)
        return items;

    }
}



//DIBUJANDO LA TABLA
formulario.addEventListener('submit', function(e) {
    e.preventDefault();

    datos = new FormData(formulario);

    const monto =  parseInt(datos.get('valor'));
    const cuotas =  parseInt(datos.get('cuotas'));
    const fecha = datos.get('fecha');
    const modo = datos.get('modo-pago');
    const programa = datos.get('tipo-programa');
    const tasa = 0.014;
    const seguro = 0.028;
    const recaudo = 2100;
    const papeleria = 2000;
    const transferencia = 5355;
    const iva = 19;
    const tasa_aval = 3.7;
    const estudio = 0
   
    const simulacion = new Simulator(monto, cuotas, fecha, modo, programa, tasa, seguro, recaudo, papeleria, transferencia, iva, tasa_aval, estudio);

    const valores = simulacion.calculate();

    tabla_res.classList.remove('d-none');

    cont_res.innerHTML = '';
    
    for (const valor of valores) {

            cont_res.innerHTML += `
            <tr>
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
