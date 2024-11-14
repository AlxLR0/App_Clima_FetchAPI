const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', ()=>{
    formulario.addEventListener('submit', buscarClima);
})

function buscarClima(e) {
    e.preventDefault();

    // console.log('Buscando clima...');
    

    //validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if (ciudad === '' || pais === '') {
        //hubo error
        mostrarError('Ambos campos son obligatorios');
        return;
    }

    //consultar la api
    consultarAPI(ciudad, pais);

}

function consultarAPI(ciudad, pais) {
    //esto se obtiene creando la api en https://home.openweathermap.org/api_keys
    const appId = 'ca960bfdcb3143b0087916d6a1b84fde';

    //esto de la documentacion https://openweathermap.org/current
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    //mandar llamar l animacion del spinner de carga
    spinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            // console.log(datos);
            limpiartHTML();//limpiar html previo
            if (datos.cod === "404") {
                mostrarError('Ciudad no encontrada');
                return;
            }

            //imprime respuesta en el html
            mostrarClima(datos);
        });
        

    

}

function mostrarClima(datos) {
    const {name,main:{temp, temp_max, temp_min},sys:{country}}= datos;
    const centigrados = kelvinACentrigrados(temp); // la resta de hace para mostrar el calculo en grados celcius en lugar de kelvin
    const max = kelvinACentrigrados(temp_max); // calculo para la temperatura maxima
    const min = kelvinACentrigrados(temp_min); // calculo para la temperatura minima

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name} ${country}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');
    
    //temperatura actual
    const actual = document.createElement('p');
    actual.innerHTML =`${centigrados} &#8451`;
    actual.classList.add('font-bold','text-6xl');

    //temperatura maxima
    const tempMaxima = document.createElement('p');
    tempMaxima.innerText= `Maxima: ${max} °C`;
    tempMaxima.classList.add('text-xl');

    //temperatura minima
    const tempMinima = document.createElement('p');
    tempMinima.innerText= `Minima: ${min} °C`;
    tempMinima.classList.add('text-xl');


    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);
    
    resultado.appendChild(resultadoDiv);
    
}

function kelvinACentrigrados(grados) {
    return parseInt(grados-273.15);
}

function limpiartHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarError(mensaje) {
    const alerta = document.querySelector('.bandera');

    if (!alerta) {
        
        //crear alerta
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4','py-4','rounded',
            'max-w-md','mx-auto', 'mt-6','text-center','bandera'
        );
    
    
        alerta.innerHTML =`
            <strong class="font-bold">ERROR</strong>
            <span class="block">${mensaje}</span>
        `;
    
        container.appendChild(alerta);


        //se desaparece la alerta

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
    
}


function spinner() {

    limpiartHTML(); //para que limpie el html antes de mostrar el spinner 
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-chase');

    divSpinner.innerHTML = `
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
    `;

    resultado.appendChild(divSpinner);
}