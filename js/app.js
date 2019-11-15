/*============== VARIABLES GLOBALES ===================*/

var formulario = document.querySelector('#simulator');
var contenedor = document.querySelector('#variable-content');
var cont_cuotas = document.getElementById('cuotas');


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

function seleccion(calculo) {

    //Tipo programa
    if (calculo == 'programa') {
        var valor =  document.querySelector('#tipo-programa').value;
        //Pregrado
        if (valor == 1) {
            valor = 'Pregrado';
    
            cont_cuotas.innerHTML = `
                <option selected>Selecciona una opción</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
            `;
    
        } else {
            //Postgrado
            valor = 'Postgrado';
            cont_cuotas.innerHTML = `
                <option selected>Selecciona una opción</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
            `;
        }

    }   
} 


//Simulador

class Simulator {
    constructor(monto, cuotas, fecha, modo, programa){
        this.monto = monto;
        this.cuotas = cuotas;
        this.fecha = fecha;
        this.modo = modo;
        this.programa = programa;
        this.tasa = 0.014;
        this.seguro = 0.028;
        this.recaudo = 2100;
        this.papeleria = 2000;
        this.transferencia = 5355;
        this.iva = 19;
        this.tasa_aval = 3.7;
        
    }

    calculate(){
   
        var cuota_fija = this.monto *( (this.tasa * Math.pow(1 + this.tasa, this.cuotas)) / (Math.pow(1 + this.tasa, this.cuotas) - 1) );
        cuota_fija = Math.round(cuota_fija);
        var num_cuotas = parseInt(this.cuotas);
        var saldo_al_capital = this.monto;
        var fecha = this.fecha;
        var fecha = fecha.split('-');
        fecha = new Date(fecha[0], fecha[1], fecha[2]);

        var items = new Array();

        var resultado_suma = 0;

        console.log(resultado_suma);

            for (var i=0; i < num_cuotas; i++) {
                var numero = i + 1;
                var interes = Math.round(saldo_al_capital * this.tasa);
                var abono_al_capital = Math.round(cuota_fija - interes);
                
                saldo_al_capital -= Math.round(abono_al_capital);
                var saldo_total = saldo_al_capital + abono_al_capital;

                var meses = new Array ("Ene.","Feb.","Mar.","Abr.","May.","Jun.","Jul.","Ago.","Sept.","Oct.","Nov.","Dic.");
                let fecha_pagos = crearFecha(fecha.getDate(), meses[fecha.getMonth()], fecha.getFullYear(), ' - ');
                sumarMeses(fecha, 1);
                
                var pago_seguro = Math.round((saldo_total * this.seguro) / 100);

                //NECESITO REEMPLAZAR ESE suma_total_pago_seguro POR LA SUMA TOTAL DE CADA pago_seguro.

                var suma_total_pago_seguro = 0

                var estudio = Math.round(((suma_total_pago_seguro + this.transferencia + this.recaudo * this.cuotas + this.papeleria) / this.cuotas) * this.cuotas);
                var seguro_cuota = Math.round(estudio / this.cuotas);
                
                var iva = Math.round((seguro_cuota * this.iva) / 100);

                //Operación comisión
                let sumaItems = cuota_fija + seguro_cuota + iva;
                var comision = Math.round(((sumaItems / (1-((1*this.tasa_aval)/100)*(1+((1*this.iva)/100))))-sumaItems) / (1+((1*this.iva)/100)));
                var iva_19 = Math.round((comision*this.iva)/100);

                let itemsCuota = [cuota_fija, comision, iva_19, seguro_cuota, iva];
                var total_cuota = sumaMultiple(itemsCuota);

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
        
        
        return items;

    }
}


formulario.addEventListener('submit', function(e) {
    e.preventDefault();

    datos = new FormData(formulario);

    monto =  parseInt(datos.get('valor'));
    cuotas =  parseInt(datos.get('cuotas'));
    fecha = datos.get('fecha');
    modo = datos.get('modo-pago');
    programa = datos.get('tipo-programa');
   
    const simulacion = new Simulator(monto, cuotas, fecha, modo, programa);

    const valores = simulacion.calculate();
    
    const cont_res = document.querySelector('#res');

    const tabla_res = document.querySelector('#tabla-res');

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
