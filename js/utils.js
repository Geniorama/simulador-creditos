/*============== FUNCIONES AUXILIARES ===================*/

const meses = new Array ("Ene.","Feb.","Mar.","Abr.","May.","Jun.","Jul.","Ago.","Sept.","Oct.","Nov.","Dic.");

function sumarDias(fecha, dias){
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
}

function sumarMeses(fecha, num_meses){
    fecha.setMonth(fecha.getMonth() + num_meses);
    return fecha;
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
    dia = String(dia);
    mes = mes + 1
    mes = String(mes);
  
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

function calcCuotaFija(monto, tasa, cuotas) {
    //let valor_cuota = monto*((tasa * Math.pow(1 + tasa, cuotas)) / (Math.pow(1 + tasa, cuotas) - 1));

    //Es igual a
    let valor_cuota = (tasa * monto) / (1 - Math.pow((1 + tasa), -cuotas))
    valor_cuota = Math.round(valor_cuota)

    return valor_cuota
}


function createDate360(dateInit, dateFinish) {

    let date_init = document.getElementById(dateInit).value
    let date_finish = document.getElementById(dateFinish).value

    let dias = 0

    date_init = date_init.split('-')
    
    let date_init_year = parseInt(date_init[0]),
        date_init_month = parseInt(date_init[1]),
        date_init_day = parseInt(date_init[2])

    date_finish = date_finish.split('-')
    
    let date_finish_year = parseInt(date_finish[0]),
        date_finish_month = parseInt(date_finish[1]),
        date_finish_day = parseInt(date_finish[2])

    if (date_finish_day < date_init_day) {

        date_finish_day = date_finish_day + 30
        date_finish_month = date_finish_month - 1
    }

    if (date_finish_month < date_init_month) {
        date_finish_month = date_finish_month + 12
        date_finish_year = date_finish_year -1
    }
    //console.log(date_finish_day)


    dias = ((date_finish_day + 1) - (date_init_day)) + (((date_finish_month) - (date_init_month)) * 30) + ((date_finish_year - date_init_year) * 360)

    return dias - 1
}

