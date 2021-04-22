const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

let HoraMundial;



window.addEventListener('load', () => {
    formulario.addEventListener('submit', searchWeather);
})


function searchWeather(e) {
    e.preventDefault();

    //Validar hay uno que tiene id ciudad y otro pais, el value es para saber que escribio el user
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if (ciudad === '' || pais === '') {
        //Hubo un error
        mostrarError('Ambos campos son Obligatorios.');
        return; //con este detenemos nuestro codigo.

    }

    //Consultar la API si pasa la validacion
    consultarAPI2(ciudad, pais);
    consultarAPI(ciudad, pais, );
}


function mostrarError(mensaje) {
    const alerta = document.querySelector('.bg-red-100') //la uso porque se que no esta en ningun otro lado
    if (!alerta) {
        //CREEMOS UNA ALERTA CON SCRITING
        const alerta = document.createElement('div');
        //clases de tailwind
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4',
            'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
        <strong class="font-bold">Error!!</strong>
        <span class="block">${mensaje}</span>
     `;

        container.appendChild(alerta);
        //ELIMINEMOS LA ALERTA
        setTimeout(() => {
            alerta.remove();
        }, 4000)

    }
}


function consultarAPI2(ciudad, pais) {
    const apiKey = '567d4a613fe14aa4b8c00709911e98fc';
    const url2 = `https://api.ipgeolocation.io/timezone?apiKey=${apiKey}&location=${ciudad},%20${pais}`;


    fetch(url2) //ya sabemos que es json....la mayoria es asi...excepto los de pago XML
        .then(answer => answer.json())
        .then(data => {
            if (data.cod === "404") {
                mostrarError('Ciudad no encontrada.')
                return;
            }
            //Imprimir la respuesta en el html
            guardarHora(data);

        })
}



function guardarHora(data) {
    const { date_time_txt } = data;
    const HoraRemota = date_time_txt;
    const HoraLocal2 = document.createElement('div');
    HoraLocal2.innerHTML = `Hora Local: ${HoraRemota}`;
    HoraLocal2.classList.add('text-2xl', 'col-start-5', 'col-span-4');
    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white', 'grid', 'grid-cols-12', 'gap-4', 'mt-5');
    resultadoDiv.appendChild(HoraLocal2);
    resultado.appendChild(resultadoDiv);
    console.log(HoraRemota);
    console.log(HoraLocal2);
    console.log(resultadoDiv);
}


function consultarAPI(ciudad, pais) {
    const appID = '47f3586bf5961638beb5900079181fee';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;
    console.log(url);

    Spinner();

    fetch(url) //ya sabemos que es json....la mayoria es asi...excepto los de pago XML
        .then(respuesta => respuesta.json())
        .then(datos => {
            limpiarHTML();
            if (datos.cod === "404") {
                mostrarError('Ciudad no encontrada.')
                return;
            }
            //Imprimir la respuesta en el html
            showWeather(datos);
        })
}


function showWeather(datos) {
    const { name, main: { temp, temp_max, temp_min, feels_like }, weather: { 0: { icon } }, dt } = datos;
    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);
    const sensacion = kelvinACentigrados(feels_like);
    const icono = icon;
    const horario = unixToHuman(dt);
    let imgsrc;
    let palabra;

    switch (true) {
        case (icono === '01d'):
            palabra = "Soleado"
            imgsrc = "img/soleado.png"
            break;

        case (icono === '01n'):
            palabra = "Despejado"
            imgsrc = "img/luna.png"
            break;

        case (icono === '02d'):
            palabra = " Parcialmente Nublado"
            imgsrc = "img/parciald.png"
            break;

        case (icono === '02n'):
            palabra = " Parcialmente Nublado"
            imgsrc = "img/parcialn.png"
            break;

        case ((icono === '03d') || (icono === '03n') || (icono === '04d') || (icono === '04n')):
            palabra = "Nublado"
            imgsrc = "img/totalmentn.png"
            break;

        case ((icono === '09d') || (icono === '09n') || (icono === '10d') || (icono === '10n')):
            palabra = " Lluvia"
            imgsrc = "img/lluvia.png"
            break;

        case ((icono === '11d') || (icono === '11n')):
            palabra = "Tormenta Electrica"
            imgsrc = "img/tormenta.png"
            break;

        case ((icono === '13d') || (icono === '13n')):
            palabra = "Nieve"
            imgsrc = "img/snowf.png"
            break;

        case ((icono === '50d') || (icono === '50n')):
            palabra = "Neblina"
            imgsrc = "img/mist.png"
            break;
    }


    const nombreCiudad = document.createElement('div');
    nombreCiudad.innerHTML = `El Clima en ${name}, es:`;
    nombreCiudad.classList.add('text-4xl', 'mt-5', 'font-bold', 'col-start-5', 'col-span-4')

    const actual = document.createElement('div');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl', 'text-center', 'col-start-5', 'col-span-2');

    const divImagen = document.createElement('div');
    const imagenC = document.createElement('img');
    imagenC.src = imgsrc;
    divImagen.classList.add('col-start-7', 'col-span-2');
    imagenC.classList.add('mx-auto');
    divImagen.appendChild(imagenC);

    const minMax = document.createElement('div');
    minMax.innerHTML = `min/Max   ${min}&#8451;/${max}&#8451;`
    minMax.classList.add('font-bold', 'text-center', 'col-start-5', 'col-span-2');

    const tempSensa = document.createElement('div');
    tempSensa.innerHTML = `Sensación Termica: ${sensacion} &#8451;`;
    tempSensa.classList.add('font-bold', 'text-center', 'col-start-5', 'col-span-2');

    const cielo = document.createElement('div');
    cielo.innerHTML = `Cielo: ${palabra}`;
    cielo.classList.add('font-bold', 'col-start-7', 'col-span-2', 'text-center');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white', 'grid', 'grid-cols-12', 'gap-4');
    resultadoDiv.appendChild(nombreCiudad);
    /* resultadoDiv.appendChild(HoraLocal); */
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(divImagen);
    resultadoDiv.appendChild(minMax);
    resultadoDiv.appendChild(tempSensa);
    resultadoDiv.appendChild(cielo);
    resultado.appendChild(resultadoDiv);

}

function kelvinACentigrados(grados) {
    return parseInt(grados - 273.15);
}

//CONVIRTAMOLA EN ARROW FUNCTION
/* const kelvinACentigrados = gardos => parseInt(grados - 273.15); */


function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

//esta funcione es estandar de JS
function unixToHuman(time) {
    const milliseconds = time * 1000;
    dateObject = new Date(milliseconds);
    const humanDateFormat = dateObject.toLocaleString("es-CO", { timeZoneName: "short" });
    return humanDateFormat;
}


//Esta funcion no es propia la baje de:
// https://tobiasahlin.com/spinkit/
//hay que añadir 3 cosas el JS, el CSS y el HTML
function Spinner() {
    limpiarHTML();
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-fading-circle');
    divSpinner.innerHTML = `
    <div class="sk-circle1 sk-circle"></div>
    <div class="sk-circle2 sk-circle"></div>
    <div class="sk-circle3 sk-circle"></div>
    <div class="sk-circle4 sk-circle"></div>
    <div class="sk-circle5 sk-circle"></div>
    <div class="sk-circle6 sk-circle"></div>
    <div class="sk-circle7 sk-circle"></div>
    <div class="sk-circle8 sk-circle"></div>
    <div class="sk-circle9 sk-circle"></div>
    <div class="sk-circle10 sk-circle"></div>
    <div class="sk-circle11 sk-circle"></div>
    <div class="sk-circle12 sk-circle"></div>
    `;

    resultado.appendChild(divSpinner);
}

//este es el texto animado y tambien lo saque de:
// https://tobiasahlin.com/moving-letters/
//y hay que hacer similar a spinkit
// Wrap every letter in a span
var textWrapper = document.querySelector('.ml3');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({ loop: true })
    .add({
        targets: '.ml3 .letter',
        opacity: [0, 1],
        easing: "easeInOutQuad",
        duration: 2250,
        delay: (el, i) => 150 * (i + 1)
    }).add({
        targets: '.ml3',
        opacity: 0,
        duration: 500,
        easing: "easeOutExpo",
        delay: 500
    });