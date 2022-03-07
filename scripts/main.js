// Fonctions implémentée
function sideMenu() {
    let sideNav = document.getElementById('side-nav');
    if (sideNav.style.display == 'none') {
        sideNav.style.display = 'block';
    }
    else {
        sideNav.style.display = 'none';
    }
}

// -----------------------------------------------
// Avoir le jour d'aujourd'hui
// Source : https://stackoverflow.com/questions/58531156/javascript-how-to-format-the-date-according-to-the-french-convention
var options = { year: 'numeric', month: 'long', day: 'numeric' };
var opt_weekday = { weekday: 'long' };
var today = new Date();
var weekday = toTitleCase(today.toLocaleDateString("fr-FR", opt_weekday));
function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}
var the_date = weekday + ' ' + today.toLocaleDateString("fr-FR", options);

document.getElementById('titreTemp').innerText = the_date;


// -----------------------------------------------
// LISTENERS

// Ajout de Listener pour changer d'onglet
Array.from(document.querySelectorAll('#nav-onglet li, #nav-onglet span')).forEach(function (onglet) {
    onglet.addEventListener('click',
        function (event) {
            Array.from(document.querySelectorAll('.active')).forEach(function (elem_active) {
                elem_active.removeAttribute('class');
            });
            var elemEvent = event.target;
            if (event.target.tagName == 'SPAN')
                var elemEvent = event.target.parentNode;
            let element_a_id = elemEvent.getAttribute("value");
            document.getElementById(element_a_id).setAttribute('class', 'active');

            let elemBackColor = window.getComputedStyle(elemEvent, null).getPropertyValue("background-color");
            document.getElementById('content').style.backgroundColor = elemBackColor;
        }
    );
});

// Ajout de listener poour définir la température à mettre en favori
Array.from(document.querySelectorAll('section p img')).forEach(function (onglet) {
    onglet.addEventListener('click',
        function (event) {
            if (event.target.getAttribute('class') == "favori") {
                event.target.removeAttribute('class');
                event.target.setAttribute('src', 'img/star-empty.png')
                return;
            }
            Array.from(document.querySelectorAll('.favori')).forEach(function (elem_active) {
                elem_active.removeAttribute('class');
                elem_active.setAttribute('src', 'img/star-empty.png')
            });
            event.target.setAttribute('class', 'favori');
            event.target.setAttribute('src', 'img/star.png');
        }
    );
});


// -----------------------------------------------

// if (document.querySelector('.favori') != null)
//     console.log(document.querySelector('.favori').style.backgroundColor);

// document.getElementById('body-content').style.backgroundColor;

// -----------------------------------------------

localStorage['myKey'] = 'somestring'; // only strings
localStorage['myKey'] = 'konar'; // only strings

// Une thes belle alerte alerte
//window.alert("Va te faire enculé sale fils de pute");

var myVar = localStorage['myKey'];
console.log(myVar);

// -----------------------------------------------

var spanMin = document.getElementById('span_min_temperature');
var spanMax = document.getElementById('span_max_temperature');
function checkMinMax() {
    if (document.getElementsByClassName('favori')[0] == null) return;
    else if (document.getElementsByClassName('favori')[0].parentNode.id == 'p_in_temperature') {
        var temperature = document.getElementById('span_in_temperature').textContent;
    }
    else {
        var temperature = document.getElementById('span_out_temperature').textContent;
    }

    console.log(temperature);
    if (spanMin.textContent ==  "" && spanMax.textContent == "") {
        spanMin.innerText = temperature;
        spanMax.innerText = temperature;
    }
    else {
        if (spanMin > temperature) {
            spanMin.innerText = temperature;
        }
        if (spanMax < temperature) {
            spanMax.innerHTML = temperature;
        }
    }
}

// -----------------------------------------------

var span_in_temperature = document.getElementById('span_in_temperature');
var span_out_temperature = document.getElementById('span_out_temperature');

function getTemperature() {
    fetch("https://hothothot.dog/api/capteurs?format=json", { method: "POST" })
        .then(response => response.json())
        .then(function (data) {
            let temperatureIn = data["capteurs"]["0"]["Valeur"];
            let temperatureOut = data["capteurs"]["1"]["Valeur"];

            // Température extérieure
            let color = 'white';
            if (temperatureOut < 0)
                color = 'blue';
            else if (35 < temperatureOut)
                color = 'red';
            span_out_temperature.setAttribute("class", color);
            span_out_temperature.innerText = temperatureOut;

            // Température intérieure
            color = 'white'
            if (temperatureIn < 0)
                color = 'blue';
            else if (0 <= temperatureIn && temperatureIn < 12)
                color = 'cyan';
            else if (22 <= temperatureIn && temperatureIn < 50)
                color = 'orange';
            else if (50 <= temperatureIn)
                color = 'red';
            else
                color = 'white';
            span_in_temperature.setAttribute("class", color);
            span_in_temperature.innerText = temperatureIn;

            checkMinMax();

            // Affichage des problèmes
            let titre_message_in = document.getElementById('alerte-span-out');
            if (temperatureOut < 0)
                titre_message_in.innerText = 'Banquise en vue !';
            else if (35 < temperatureOut)
                titre_message_in.innerText = 'Hot ! Hot ! Hot !';

            let titre_message_out = document.getElementById('alerte-span-in');
            if (temperatureIn < 0)
                titre_message_out.innerText = 'Canalisations gelées, appelez SOS plombier et mettez un bonnet !';
            else if (0 <= temperatureIn && temperatureIn < 12)
                titre_message_out.innerText = 'Montez le chauffage ou mettez un gros pull  !';
            else if (22 < temperatureIn && temperatureIn <= 50)
                titre_message_out.innerText = 'Baissez le chauffage !';
            else if (50 <= temperatureIn)
                titre_message_out.innerText = 'Appelez les pompiers ou arrêtez votre barbecue !';
        });
}

getTemperature();
var interval = setInterval(function () {
    getTemperature();
}, 120000);



// -----------------------------------------------
// Affichage des température
// --------- tempo -----------
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
var A_temperatures = [];
for (var i = 20; i > 0; --i) {
    var x = getRandomArbitrary(-20, 60);
    A_temperatures.push(x);
}
// --------- ----- -----------

var i = 0;
// var interval = setInterval(function () {
//     if (i < A_temperatures.length) {
//         if (document.getElementById('titre_message'))
//             document.getElementById('titre_message').remove();

//         let I_temperature = A_temperatures[i];
//         let O_temperature = A_temperatures[A_temperatures.length - 1 - i];
//         let color = 'grey';

//         // Température extérieure
//         if (O_temperature < 0)
//             color = 'blue';
//         else if (35 < O_temperature)
//             color = 'red';
//         else
//             color = 'grey';
//         span_out_temperature.setAttribute("class", color);
//         span_out_temperature.innerText = O_temperature;

//         // Température intérieure
//         if (I_temperature < 0)
//             color = 'blue';
//         else if (0 <= I_temperature && I_temperature < 12)
//             color = 'cyan';
//         else if (22 <= I_temperature && I_temperature < 50)
//             color = 'orange';
//         else if (50 <= I_temperature)
//             color = 'red';
//         else
//             color = 'grey';
//         span_in_temperature.setAttribute("class", color);
//         span_in_temperature.innerText = I_temperature;

//         ++i;

//         // Affichage des problèmes
//         let titre_message_in = document.getElementById('alerte-span-out');
//         if (O_temperature < 0)
//             titre_message_in.innerText = 'Banquise en vue !';
//         else if (35 < O_temperature)
//             titre_message_in.innerText = 'Hot ! Hot ! Hot !';

//         let titre_message_out = document.getElementById('alerte-span-in');
//         if (I_temperature < 0)
//             titre_message_out.innerText = 'Canalisations gelées, appelez SOS plombier et mettez un bonnet !';
//         else if (0 <= I_temperature < 12)
//             titre_message_out.innerText = 'Montez le chauffage ou mettez un gros pull  !';
//         else if (22 < I_temperature <= 50)
//             titre_message_out.innerText = 'Baissez le chauffage !';
//         else if (50 <= I_temperature)
//             titre_message_out.innerText = 'Appelez les pompiers ou arrêtez votre barbecue !';

//     } else {
//         clearInterval(interval);
//         interval = null;
//     }
// }, 5000)

// -----------------------------------------------

// Websocket
// var socket = new WebSocket('wss://ws.hothothot.dog:9502');
// socket.onopen = function (event) {
//     console.log("Connexion établie");

//     //Envoi d'un message au serveur (obligatoire)
//     socket.send("coucou !");

//     // au retour...
//     socket.onmessage = function (event) {
//         if (event != null) {
//             var datas = document.getElementById("datas");
//             datas.innerHTML = event.data;
//         }
//     }
// }

// fetch('https://hothothot.dog/api/capteurs?format=json')
//     .then(response=>response.json())
//     .then(data=>{ console.log(data["capteurs"]["0"]["Valeur"]); });





if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/service-worker.js') // à adapter à l'URL du projet
        .then(() => { console.log('Service Worker Registered'); });
}

// -----------------------------------------------
// Affichage des ancinnes température dans un tableau