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
