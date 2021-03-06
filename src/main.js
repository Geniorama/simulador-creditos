import moment from 'moment';
import {crearOpciones, createDate360, convertMoneda, separarMiles, calcularFechas, mostrarError} from './modulos/utils';
import Simulator from './modulos/calculator';

/*============== FUNCIONES FORMULARIO ===================*/

//const form_simulador = document.getElementById('simulator')

const simularCredito = input => {
    const form_simulador = document.getElementById(input);

    if (form_simulador) {
        //Campos
        const input_cuotas = document.getElementById('cuotas')
        const input_solicitud = document.getElementById('fecha-solicitud')
        const input_cuota_uno = document.getElementById('fecha-cuota-uno')
        const input_tipo_programa = document.getElementById('tipo-programa')
        const input_monto = document.getElementById('valor')
        const input_modo_pago = document.getElementById('modo-pago')
    
        separarMiles('valor');
    
        //Contenedores
        const cont_res = document.getElementById('res')
        const label_value = document.querySelector('.text-large')
        const container_res = document.getElementById('container-result')
    
    
        //Fechas

        calcularFechas('fecha-solicitud', 'fecha-cuota-uno', 1, 2)
    
        //Tipo programa
        input_tipo_programa.addEventListener('change', function() {
            //Pregrado
            if (this.value == 1) {
                crearOpciones(6, input_cuotas)
            } else if (this.value == 2) {
            //Posgrado
                crearOpciones(12, input_cuotas)
            }   
        })
    
    
        //Recibiendo datos
        form_simulador.addEventListener('submit', function(e) {
            e.preventDefault();
            let valor_monto = input_monto.value;
            valor_monto = valor_monto.split('.').join('');
        
            let inputsForm = [input_modo_pago, input_tipo_programa, input_monto, input_cuotas,  input_solicitud, input_cuota_uno]
    
            let contador = 0
    
            for (const input_obj of inputsForm) {
                let input_name = input_obj.dataset.title;
                let input_value = input_obj.value;
    
                contador = contador + 1
                
                if (input_value == 0 || input_value == "undefined" || input_value == "" || input_value == null) {
                    mostrarError('modal-errors', `El campo ${input_name} está vacío`);
                    return false
                } else if(valor_monto < 500000){
                    mostrarError('modal-errors', 'Debes ingresar un valor superior a $500.000');
                    return false
                } else {
                if(contador == inputsForm.length){
                        
                        //Campos
                        function getValueInput(field) {
                            const fieldName = document.getElementById(field)
                            let fieldVal =  fieldName.value
                            return fieldVal
                        }
    
                        const dif_dias = createDate360('fecha-solicitud', 'fecha-cuota-uno')
                        
                        var datos_formulario = {
                            monto  : parseInt(valor_monto),
                            cuotas : parseInt(getValueInput('cuotas')),
                            fecha_solicitud : getValueInput('fecha-solicitud'),
                            fecha_pick  : getValueInput('fecha-cuota-uno'),
                            cont_dias : dif_dias,
                            modo   : getValueInput('modo-pago'),
                            programa : getValueInput('tipo-programa'),
                            tasa : 0.014,
                            seguro : 0.028,
                            recaudo : 2100,
                            papeleria : 2000,
                            transferencia : 5355,
                            iva : 19,
                            tasa_aval : 3.7
                        }
    
                        if (datos_formulario.modo == 2) {
                            datos_formulario.tasa_aval = 3.0
                        } 
                        
                        const simulador = new Simulator(datos_formulario);
                        const valores = simulador.calculate();
            
                        container_res.classList.remove('d-none');
            
                        cont_res.innerHTML = '';
            
                        for (const valor of valores) {
            
                                cont_res.innerHTML += `
                                <tr>
                                    <td>${valor.numero}</td>
                                    <td>${valor.fecha_pago}</td>
                                    <td>${valor.cuota_fija}</td>              
                                </tr>
                                `;
            
                                if (valor.numero == 2) {
                                    label_value.innerHTML = valor.cuota_fija
                                }
                        }  
    
                        //Url Get
                        function urlGet(url, button) {
                            let url_get = `${url}?modo-pago=${datos_formulario.modo}&tipo-programa=${datos_formulario.programa}&valor=${datos_formulario.monto}&cuotas=${datos_formulario.cuotas}&fecha-solicitud=${datos_formulario.fecha_solicitud}&fecha-cuota-uno=${datos_formulario.fecha_pick}`
                            button.setAttribute('href', url_get)
                        }
            
                        const button_form_send = document.getElementById('button-form-send')
                        
                        urlGet('http://univercity.com.co/demo/michelsen/credito-educativo/formulario/', button_form_send)
    
                        const botonPDF = document.querySelector('#button-pdf')
                        botonPDF.addEventListener('click', function(e) {
                            e.preventDefault()
                            var doc = new jsPDF('landscape');
                        
                            doc.setFontSize(12)
                            doc.text(20, 20, 'SIMULADOR CRÉDITO EDUCATIVO - FUNDACIONES MICHELSEN');
            
                            doc.setFontSize(9)
    
                            let fecha_solic = datos_formulario.fecha_solicitud;
                            fecha_solic = fecha_solic.split('-')
                            fecha_solic = new Date(fecha_solic[0], fecha_solic[1] - 1, fecha_solic[2])
                            fecha_solic = moment(fecha_solic);
                            fecha_solic = moment(fecha_solic).format("MMM / DD / YYYY");
    
                            let fecha_simulacion = moment().format("MMM / DD / YYYY");
            
                            if (datos_formulario.modo == 1) {
                                datos_formulario.modo = 'Pagaré'
                            } else if (datos_formulario.modo == 2) {
                                datos_formulario.modo = 'Cheque'
                            }
            
                            if (datos_formulario.programa == 1) {
                                datos_formulario.programa = 'Pregrado'
                            } else if (datos_formulario.programa == 2) {
                                datos_formulario.programa = 'Postgrado'
                            }
            
                            doc.text(20, 30, `Fecha de solicitud: ${fecha_solic}`);
                            doc.text(20, 35, `Modo de pago: ${datos_formulario.modo}`);
                            doc.text(20, 40, `Tipo de programa: ${datos_formulario.programa}`);
                            doc.text(20, 45, `Valor solicitado: ${convertMoneda(datos_formulario.monto)}`);
                            doc.text(20, 50, `Plazo: ${datos_formulario.cuotas} meses`);
            
                            doc.text(210, 30, `Fecha de simulación: ${fecha_simulacion}`);
                            //Encabezados tabla
                            doc.line(20, 56, 100, 56); 
            
                            doc.text(20, 62, 'No. Cuota');
                            doc.text(40, 62, 'Fecha pago');
                            doc.text(80, 62, 'Valor cuota');
            
                            doc.line(20, 65, 100, 65);
            
                            var numero_inicial_fila = 65
            
                            for (const item of valores) {
                                numero_inicial_fila = numero_inicial_fila + 10
                                doc.text(20, numero_inicial_fila, `${item.numero}`)
                                doc.text(40, numero_inicial_fila, `${item.fecha_pago}`)
                                doc.text(80, numero_inicial_fila, `${item.cuota_fija}`)
                            }
    
                            doc.setFontSize(10)
                            doc.text(20, 120, `IMPORTANTE`);
    
                            doc.setFontSize(7)
                            doc.text(20, 130, `1. El valor real de la primera cuota del crédito puede variar del proyectado en esta consulta por motivos de ajuste de los intereses entre la fecha de contabilización del crédito y la fecha de la primera facturación.`);
    
                            doc.text(20, 136, `2. La fecha de solicitud seleccionada en el formulario se usa para efectos de la simulación, contrario a la fecha de simulación, que corresponde a la fecha de generación de este documento`);
                            
                            //Guardar pdf
                            doc.save('Simulación Crédito - Fund. Michelsen.pdf')
                        })
                }
                
                }
    
            }
    
        })
    
    }
}

simularCredito('simulator')
