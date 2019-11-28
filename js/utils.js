/*============== FUNCIONES AUXILIARES ===================*/

function sumarDias(fecha, dias){
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
}

function sumarMeses(fecha, num_meses){
    fecha.setMonth(fecha.getMonth() + num_meses);
    return fecha;
}

function crearFecha(dia, mes, agno, separador) {
    var dia = dia.toString();
    var mes = mes.toString();
  
    if (dia.length <= 1) {
        dia = '0' + dia;
    }

    var fecha = dia + separador + mes + separador + agno.toString();
    
    return fecha;
}


function crearFechaMinMax(dia, mes, agno, separador) {
    dia = dia.toString();
    mes = mes + 1
    mes = mes.toString();
  
    if (dia.length <= 1) {
        dia = '0' + dia;
    } else if (mes.length <= 1){
        mes = '0' + mes;
    }

    fecha = agno.toString() + separador + mes + separador + dia;
    
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


function validarCampo(input) {

    if (input == "" || input <= 0) {
        alert('Debe diligenciar el campo' + input.getAttribute('data-name'))
        return false
    } else {
        console.log('Diligenciado')
    } 
}


function crearOpciones(numOpciones, contenedor) {
    
    let element = '<option selected>Selecciona una opción</option>';

    for (let index = 0; index < numOpciones; index++) {
        let num_opcion = index + 1
        element += `<option value=${num_opcion}>${num_opcion}</option>`
    }
    contenedor.innerHTML = element;
}

/*
Cuota = (Monto * (%MV x (1 + %MV) ^ n)) / ((1 + %MV) ^ n) - 1)

siendo: Monto (valor a ser prestado), n (numero de meses), %MV (Tasa Efectiva Mensual)

%MV = (1 + %EA) ^ (1/12) - 1
*/


function calcCuotaFija(monto, tasa, cuotas) {
    let valor_cuota = Math.round(monto *( (tasa * Math.pow(1 + tasa, cuotas)) / (Math.pow(1 + tasa, cuotas) - 1) ));

    return valor_cuota
  }