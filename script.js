import {traducir} from './traductor.js';
import {obtenerCoordenadas, mostrarMapa} from './generadorDeMapa.js';
import {obtenerHoraActual} from './horario.js'


const urlClima = 'https://api.openweathermap.org/data/2.5/weather'; 
const apiKey = '62b11b4feedd4c31ca0bf8f3c71abcb1';  //openweathermap
const difGradosKelvin = 273.15;

function initElemHora(ciudad) {
    const elemHora = document.getElementById('hora');
    elemHora.innerHTML = `Aquí puedes saber la hora de ${ciudad}`;
    elemHora.style.fontSize = '25px';
}

function restaurarFrase(ciudad) {
    initElemHora(ciudad);
}

function cambiarFrase(nuevaFrase) {
    document.getElementById('hora').innerHTML = nuevaFrase;
}

function agregarEventoMouseEnter(frase) {
    const elemHora = document.getElementById('hora');
    elemHora.addEventListener('mouseenter', () => {
        cambiarFrase(frase);
    });
}

function agregarEventoMouseLeave(ciudad) {
    const elemHora = document.getElementById('hora');
    elemHora.addEventListener('mouseleave', () => {
        restaurarFrase(ciudad);
    });
}

function agregarEventoClick() {
    const buscar = document.getElementById('buscar');
    buscar.addEventListener('click', () => {
        const elemInput = document.getElementById('ciudad');
        let ciudad = elemInput.value;
        ciudad = camelCase(ciudad);
        const alertaContainer = document.getElementById('alerta-container');
        alertaContainer.innerHTML = '';
        initElemHora(ciudad);
        if (ciudad) {
            climaDe(ciudad);
            mostrarHoraActual(ciudad);
            mostrarMapa(ciudad);
            elemInput.value = '';
        } else {
            const alerta = document.createElement('div');
            alerta.className = 'alert alert-danger'; // Clases de Bootstrap para la alerta roja
            alerta.textContent = 'Por favor, ingrese una ciudad antes de continuar.';
            alertaContainer.appendChild(alerta);
        }
    });
}

async function climaDe(ciudad) {
    try {
        const response = await fetch(`${urlClima}?q=${ciudad}&appid=${apiKey}`);
        const datosApiClima = await response.json();

        if (datosApiClima.cod === "404") {
            mostrarError(`La ciudad ${ciudad} no fue encontrada.`);
            return;  // Detenemos la ejecución si no se encuentra la ciudad
        }
        mostrarDatos(datosApiClima);
    } catch (error) {
        console.error('Error al obtener el clima:', error);
    }
}

function mostrarError(mensaje) {
    const divClima = document.getElementById('clima');
    divClima.innerHTML = `<p style="color:red">${mensaje}</p>`;
}


async function mostrarDatos(dataApi) {
    const divClima = document.getElementById('clima');
    divClima.style.backgroundColor = "#6eb1b9";
    divClima.innerHTML = "";

    const nombreCiudad = dataApi.name;
    const temperatura = dataApi.main.temp;
    const humedad = dataApi.main.humidity;
    const icono = dataApi.weather[0].icon;

    // Espera a que la traducción de la descripción esté lista
    const descTraducida = await traducir(dataApi.weather[0].description);
    const descripcion = descTraducida;

    const elemTitulo = document.createElement('h2');
    elemTitulo.textContent = nombreCiudad;

    const elemTemp = document.createElement('p');
    elemTemp.textContent = `La temperatura es: ${Math.round(temperatura - difGradosKelvin)}°C`;

    const elemHum = document.createElement('p');
    elemHum.textContent =`La húmedad es del: ${humedad}%`;

    const elemDescrip = document.createElement('p');
    elemDescrip.textContent = descripcion;

    const elemIcono = document.createElement('img');
    elemIcono.src = `https://openweathermap.org/img/wn/${icono}@2x.png`;
    elemIcono.style.width = '100px';
    elemIcono.style.height = '100px';
    elemIcono.style.display = 'block'; // Cambia la imagen a bloque
    elemIcono.style.margin = '-35px auto 0 auto'; // Aplica márgenes automáticos

    divClima.appendChild(elemTitulo);
    divClima.appendChild(elemTemp);
    divClima.appendChild(elemHum);
    divClima.appendChild(elemDescrip);
    divClima.appendChild(elemIcono);
}

async function mostrarHoraActual(nameCity) {
    let ciudad = nameCity;
    const coordenadas = await obtenerCoordenadas(ciudad);
    const hora = await obtenerHoraActual(coordenadas.lat, coordenadas.lon);

    // Formateamos el nombre de la ciudad
    ciudad = camelCase(ciudad);
    
    let frase = `<strong>Hora actual en ${ciudad}<br>${hora}</strong>`;
    
    agregarEventoMouseLeave(ciudad);
    agregarEventoMouseEnter(frase);
}


function camelCase(ciudad) {
    return ciudad.split(' ')  
            // Convertir la primera letra de cada palabra a mayúscula
            .map(palabra => palabra.length > 3 
            ? palabra.charAt(0).toUpperCase() + palabra.slice(1) 
            : palabra) // Si la palabra tiene más de 3 caracteres, cambia la primera letra a mayúscula
        .join(' '); // Volver a unir las palabras con un espacio
}

window.onload = agregarEventoClick; 




