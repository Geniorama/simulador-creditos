var formulario = document.querySelector('#simulator');
var contenedor = document.querySelector('#variable-content');
var cont_cuotas = document.getElementById('cuotas');

function seleccion(calculo) {

    if (calculo == 'programa') {
        var valor =  document.querySelector('#tipo-programa').value;

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

    } else if (calculo == 'modo_pago'){
        var modo = document.getElementById('modo-pago').value;

        if (modo == 2) {
            contenedor.innerHTML = `
            <div class="form-group">
                <label for="nombre-banco">Nombre banco</label>
                <select class="custom-select" id="nombre-banco" name="nombre-banco">
                    <option selected>Selecciona una opción</option>
                    <option value="1">Banco de Bogotá</option>
                    <option value="2">Av. Villas</option>
                    <option value="3">Banco de Occidente</option>
                    <option value="4">Banco Popular</option>
                    <option value="5">BBVA</option>
                    <option value="6">6</option>
                </select>
            </div>

            <div class="form-group">
                <label for="numero-cuenta">Número cuenta</label>
                <input type="text" id="numero-cuenta" name="numero-cuenta" class="form-control">
            </div>

            <div class="form-group">
                <label for="numero-cheque">Número de cheque</label>
                <input type="text" id="numero-cheque" name="numero-cheque" class="form-control">
            </div>
            `
        } else {
            contenedor.innerHTML = '';
        }
    }
    
} 


/* Función que suma o resta días a una fecha, si el parámetro
   días es negativo restará los días*/

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
        this.iva = 19;
        this.tasa_aval = 3.7;
        
    }

    calculate(){
        
        //var cuota_fija = this.monto*(this.tasa/(Math.pow(1+this.tasa, this.cuotas)-1));
        var comision = 7510;
        var seguro = 4655;
        var iva = 884;
        var iva_19 = 1427;
        
        var cuota_fija = this.monto *( (this.tasa * Math.pow(1 + this.tasa, this.cuotas)) / (Math.pow(1 + this.tasa, this.cuotas) - 1) );
        cuota_fija = Math.round(cuota_fija);
        var num_cuotas = parseInt(this.cuotas);
        var saldo_al_capital = this.monto;
        var fecha = this.fecha;
        var fecha = fecha.split('-');
        fecha = new Date(fecha[0], fecha[1], fecha[2]);

        var items = new Array();
        
            for (var i=0; i < num_cuotas; i++) {
                var interes = saldo_al_capital * this.tasa;
                var abono_al_capital = cuota_fija - interes;
                saldo_al_capital -= abono_al_capital;
                var numero = i + 1;
                var fecha_pago = sumarMeses(fecha, 1);

                var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");

                fecha_pago = crearFecha(fecha_pago.getDate(), meses[fecha_pago.getMonth()], fecha_pago.getFullYear(), ' - ');
                
               
                interes = Math.round(interes);
                abono_al_capital = Math.round(abono_al_capital);
                saldo_al_capital = Math.round(saldo_al_capital);

                var item = {
                    fecha_pago : fecha_pago,
                    numero : numero, 
                    interes : interes, 
                    abono_al_capital : abono_al_capital, 
                    cuota_fija : cuota_fija,
                    saldo_al_capital : saldo_al_capital
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

    cont_res.innerHTML = '';
    
    for (const valor of valores) {

            cont_res.innerHTML += `
            <tr>
                <td>${valor.fecha_pago}</td>
                <td>${valor.interes}</td>
                <td>${valor.abono_al_capital}</td>
                <td>${valor.cuota_fija}</td>
                <td>${valor.saldo_al_capital}</td>
            </tr>
            `;
    }

})

var cont_ciudades = document.querySelector('#ciudades');
//cont_ciudades = '';
function mostrarCiudades(){
    fetch('../colombia.json')
    .then(res => res.json())
    .then(data => {
        for (const i of data) {
            
             console.log(i);
        }
    })
}

mostrarCiudades();

//<td>${valor.fecha_pago.getDay().toString() + "-" + valor.fecha_pago.getMonth().toString() + "-" + valor.fecha_pago.getFullYear().toString()}</td>