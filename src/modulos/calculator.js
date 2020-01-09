import moment from 'moment';
import {sumaMultiple, convertMoneda, calcCuotaFija} from './utils'; 
 //Simulador

 moment.locale('es');

 class Simulator {
    constructor(arreglo_datos){
        this.monto = arreglo_datos.monto;
        this.cuotas = arreglo_datos.cuotas;
        this.fecha_solicitud = arreglo_datos.fecha_solicitud;
        this.fecha = arreglo_datos.fecha_pick;
        this.cont_dias = arreglo_datos.cont_dias;
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

        let fecha = this.fecha
        let contdias = this.cont_dias
        fecha = fecha.split('-');
        fecha = new Date(fecha[0], fecha[1] - 1, fecha[2])
        
        let estudio = 0
        let seguro_cuota = 0
        let iva = 0
        let comision = 0
        let iva_19 = 0
        let suma_seguro_cuota = 0
        let total_cuota = 0
        let saldo_inicial = this.monto

        let cuota_fija = 0
        let items = new Array();

            for (var i=0; i < this.cuotas; i++) {
                let numero = i + 1;
                let interes = 0;
                
                //Variación de interés por días de interés
                if (numero == 1) {
                    
                   // interes = Math.round((this.monto * this.tasa) / 30) * contdias;
                    interes = ((this.monto * this.tasa) / 30) * contdias
                    interes = Math.round(interes)

                    cuota_fija = calcCuotaFija(this.monto, (Math.pow((1+this.tasa), (contdias/30)))-1, this.cuotas)
                    var k = Math.round(cuota_fija - interes)
                    fecha = fecha;
                    
                } else {
                    interes = Math.round(saldo_inicial * this.tasa)
                    cuota_fija = calcCuotaFija((this.monto - k), this.tasa, (this.cuotas - 1))
                    fecha = moment(fecha).add(1, 'M');
                }

                let abono_al_capital = Math.round(cuota_fija - interes);

                saldo_inicial -= Math.round(abono_al_capital);
                let saldo_total = saldo_inicial + abono_al_capital;

                let fecha_pagos = moment(fecha).format("MMM / DD / YYYY");

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

                if (contador == 1) {
                    cuota_fija = calcCuotaFija(this.monto, (Math.pow((1+this.tasa), (contdias/30)))-1, this.cuotas)
                    
                } else {
                    cuota_fija = calcCuotaFija((this.monto - k), this.tasa, (this.cuotas - 1))
                }

                comision = Math.round((((cuota_fija + seguro_cuota + iva) / (1-((1*this.tasa_aval)/100)*(1+((1*this.iva)/100))))-(cuota_fija + seguro_cuota + iva)) / (1+((1*this.iva)/100)));
                iva_19 = Math.round((comision*this.iva)/100);
                let itemsCuota = [cuota_fija, comision, iva_19, seguro_cuota, iva];
                total_cuota = sumaMultiple(itemsCuota);

                iterator.cuota_fija = convertMoneda(total_cuota)
                iterator.seguro_cuota = convertMoneda(seguro_cuota) 
                iterator.comision = convertMoneda(comision)
            } 

        return items;

    }
}

export default Simulator;