export const meses = ["Ene.","Feb.","Mar.","Abr.","May.","Jun.","Jul.","Ago.","Sept.","Oct.","Nov.","Dic."];

export const sumarDias = (fecha, dias) => {
    let resultado = fecha.setDate(fecha.getDate() + dias);
    return resultado;
}

export const sumarMeses = (fecha, num_meses) => {
    let resultado = fecha.setMonth(fecha.getMonth() + num_meses);
    return resultado;
}

export const crearFecha = (dia, mes, agno, separador) => {
    let diaFecha = String(dia);
    let mesFecha = String(mes);
    let agnoFecha = String(agno);
  
    if (diaFecha.length <= 1) {
        diaFecha = '0' + diaFecha;
    }

    let fecha = diaFecha + separador + mesFecha + separador + agnoFecha;
    
    return fecha;
}

export const crearFechaMinMax = (dia, mes, agno, separador) => {
    let diaFecha = String(dia);
    let mesFecha = String(mes + 1);
    let agnoFecha = String(agno);
  
    if (diaFecha.length <= 1) {
        diaFecha = '0' + diaFecha;
    } else if (mesFecha.length <= 1){
        mesFecha = '0' + mesFecha;
    }

    let fecha = agnoFecha + separador + mesFecha + separador + diaFecha;
    
    return fecha;
}

export const sumaMultiple = arreglo => {
    let suma = 0;

    for (let numero of arreglo) {
        numero = parseInt(numero);
        suma = suma + numero;
    }

    return suma;
}

export const convertMoneda = numero => {
    let numeroMoneda = new Intl.NumberFormat('es-CO').format(numero);
    numeroMoneda = '$'+ numeroMoneda;

    return numeroMoneda;
}

export const validarCampo = input => {
    if (input == "" || input <= 0) {
        alert('Debe diligenciar el campo' + input.getAttribute('data-name'))
        return false
    } else {
        console.log('Diligenciado')
    }
}

export const crearOpciones = (numOpciones, contenedor) => {
    let element = '<option selected>Selecciona una opción</option>';

    for (let index = 0; index < numOpciones; index++) {
        let num_opcion = index + 1;
        element += `<option value=${num_opcion}>${num_opcion}</option>`;
    }
    contenedor.innerHTML = element;
}

export const calcCuotaFija = (monto, tasa, cuotas) => {
    //let valor_cuota = monto*((tasa * Math.pow(1 + tasa, cuotas)) / (Math.pow(1 + tasa, cuotas) - 1));

    //Es igual a
    let valor_cuota = (tasa * monto) / (1 - Math.pow((1 + tasa), -cuotas));
    valor_cuota = Math.round(valor_cuota);

    return valor_cuota;
}

export const createDate360 = (dateInit, dateFinish) => {
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
        date_finish_day = date_finish_day + 30;
        date_finish_month = date_finish_month - 1;
    }

    if (date_finish_month < date_init_month) {
        date_finish_month = date_finish_month + 12;
        date_finish_year = date_finish_year -1;
    }
    //console.log(date_finish_day)


    dias = ((date_finish_day + 1) - (date_init_day)) + (((date_finish_month) - (date_init_month)) * 30) + ((date_finish_year - date_init_year) * 360);

    return dias - 1;
}

export const es_bisiesto = year => {
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        let resultado = true;
        return resultado;
    } else {
        let resultado = false;
        return resultado;
    }  
}
