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

    dias = ((date_finish_day + 1) - (date_init_day)) + (((date_finish_month) - (date_init_month)) * 30) + ((date_finish_year - date_init_year) * 360);

    return dias - 1;
}

export const separarMiles = input => {
    let input_monto = document.getElementById(input);

    input_monto.addEventListener('keyup', (e) => {
        let entrada = e.target.value.split('.').join('');
        entrada = entrada.split('').reverse();

        let salida = [];
        let aux = '';
        
        let paginador = Math.ceil(entrada.length / 3);

        for (let i = 0; i < paginador; i++) {
            for (let j = 0; j < 3; j++) {
               if(entrada[j + (i*3)] != undefined){
                    aux += entrada[j + (i*3)];
               }    
            }
            salida.push(aux);
            aux = '';

            e.target.value = salida.join('.').split("").reverse().join("");
            
        }
        
    })
}
