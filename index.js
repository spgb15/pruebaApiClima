import config from "./config.js";

document.addEventListener('DOMContentLoaded', async () => {
    const dato = document.getElementById('ciudad');
    const boton = document.getElementById('boton');
    const pais = document.getElementById('paises');
    const datos = document.getElementById('datos-group');
    
    

    const url = 'https://restcountries.com/v3.1/all';
    const arreglo = await obtenerDatos(url);

    if (arreglo) {
        cargarPaises(arreglo);
    }


    boton.addEventListener('click', async (e) => {
        e.preventDefault();
        const ciudad = dato.value;
        const paisSeleccionado = pais.value;

        if (!paisSeleccionado || !ciudad) {
            alert('Por favor selecciona un país y escribe una ciudad.');
            return;
        }

        const urlWeather = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${paisSeleccionado}&appid=${config.api_key_weather}`;
        const resultado = await obtenerDatos(urlWeather);

        if (resultado) {
            console.log(resultado);
            datos.innerHTML = `
                <div class="tittle">
                <h2>El clima en ${resultado.name}, ${resultado.sys.country} es:</h2>
                </div>
                <br/>
                <div>
                <p class="temp">Temperatura: ${Math.round(resultado.main.temp - 273.15)} °C</p>
                </div>
                <div>
                <p class="temp_max">Temperatura Máxima: ${Math.round(resultado.main.temp_max - 273.15)} °C</p>
                </div>
                <div>
                <p class="temp_min">Temperatura Mínima: ${Math.round(resultado.main.temp_min - 273.15)} °C</p>
                </div>
                <div>
                <p class="humedad">Humedad: ${resultado.main.humidity} %</p>
                </div>
                <div>
                <p class="presion">Presión: ${resultado.main.pressure} hPa</p>
                </div>
            `;
        }
    });

    function cargarPaises(arreglo) {
        arreglo.forEach(element => {
            const option = document.createElement('option');
            option.value = element.cca2; // Código del país (ISO 3166-1 alpha-2)
            option.textContent = element.name.common; // Nombre común del país
            pais.appendChild(option);
        });
    }

    async function obtenerDatos(url) {
        try {
            const respuesta = await fetch(url);
            const datos = await respuesta.json();
            if (datos.cod == '404') {
                alert('Ciudad no encontrada, Intente de nuevo');
                pais.value = '';
                dato.value = '';
                return null;
            }
            return datos;
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            return null;
        }
    }
});
