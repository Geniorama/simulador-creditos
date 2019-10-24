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

    calcular(){
        
        let interes = ((this.monto * this.tasa) / 30) * 30;
        interes = Math.round(interes);
        

        /*
        Si en A1 pones Tasa (tipo de interes del periodo)
        en B1 el nPer  (número de Periodos)
        en C1 el Va  (Capital inicial)

        Esta fórmula:
        =(A1*(1+A1)^B1)*C1/(((1+A1)^B1)-1)
        
        var valorFuturo=parseFloat(this.valor)*Math.pow(1+parseFloat(this.tasa)/100,parseInt(this.periodo));
        */

        //let k = (this.tasa*(1+this.tasa)^this.cuotas)*this.monto/(((1+this.tasa)^this.cuotas)-1);

        let k = parseFloat(this.monto)*Math.pow(1+parseFloat(this.tasa)/100,parseInt(this.cuotas));

        k = Math.round(k);

        return k;
        
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

    
    console.log(simulacion.calcular());
    

})