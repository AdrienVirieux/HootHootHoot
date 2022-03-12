import { graph } from './graph.js'

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


// ------------------------------------------------------------------ //
// ------------------------------------------------------------------ //
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

// Ajout de listener poour définir la température interieure ou exterieure à mettre en favori
Array.from(document.querySelectorAll('section p img')).forEach(function (onglet) {
    onglet.addEventListener('click',
        function (event) {
            Array.from(document.querySelectorAll('.favori')).forEach(function (elem_active) {
                elem_active.removeAttribute('class');
                elem_active.setAttribute('src', 'img/star-empty.png')
            });
            event.target.setAttribute('class', 'favori');
            event.target.setAttribute('src', 'img/star.png');
            checkMinMax();
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
// window.alert("Va te faire enculé sale fils de pute");



// ------------------------------------------------------------------ //
// ------------------------------------------------------------------ //


// WEBSOCKET
function connectToCapteurs() {
    // Initialisation de la Websocket
    const socket = new WebSocket('wss://ws.hothothot.dog:9502');

    // Ajout d'un listener pour les possibles erreurs de la Websocket
    socket.addEventListener('error', function (event) {
        // Afiichage de l'erreur
        console.log("Problème rencontré avec Websocket");

        // On utilise alors la méthode Fetch
        fetch("https://hothothot.dog/api/capteurs?format=json", { method: "POST" })
            .then(console.log("Connexion Fetch établie"))
            .then(response => response.json())  // Convertion du message recu en JSON
            .then(function (data) {
                console.log(data);
                getTemperature(data);
            })
            .catch(err => {
                console.log("Erreur rencontré lors du fetch : " + err)
            })
    });

    // Connection au server avec Websocket
    socket.onopen = function (event) {
        console.log("Connexion Websocket établie");

        // Envoi d'un message au serveur (obligatoire)
        socket.send("couscous");
        socket.onmessage = function (msg) {
            // Convertion du message recu en JSON
            var resultJson = JSON.parse(msg.data);

            console.log(resultJson);
            getTemperature(resultJson);
        }
    }
}


// -----------------------------------------------
// Initialisation du localStorage
// TODO a revoir car perte de données
let structJSON = {
    'IN_TEMP': {
        'MIN': null,
        'MAX': null,
        'TEMP': [],
        'TIME': []
    },
    'OUT_TEMP': {
        'MIN': null,
        'MAX': null,
        'TEMP': [],
        'TIME': []
    }
};
localStorage.setItem('TEMPERATURE', JSON.stringify(structJSON));

// Ajoute les valeurs du serveur recu dans le localStorage
function localCacheTemp(temperatureIn, temperatureOut) {
    let arraysJSON = JSON.parse(localStorage.getItem('TEMPERATURE'));

    // Ajout de la nouvelle température dans l'array respectif
    arraysJSON['IN_TEMP']['TEMP'].push(temperatureIn);
    arraysJSON['OUT_TEMP']['TEMP'].push(temperatureOut);

    // Ajout de la date	
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    arraysJSON['IN_TEMP']['TIME'].push(dateTime);
    arraysJSON['OUT_TEMP']['TIME'].push(dateTime);

    // Modification de la valeur minimum et maximum
    if (arraysJSON['IN_TEMP']['MIN'] == null || arraysJSON['IN_TEMP']['MIN'] > temperatureIn) arraysJSON['IN_TEMP']['MIN'] = temperatureIn;
    if (arraysJSON['IN_TEMP']['MAX'] < temperatureIn) arraysJSON['IN_TEMP']['MAX'] = temperatureIn;

    if (arraysJSON['OUT_TEMP']['MIN'] == null || arraysJSON['OUT_TEMP']['MIN'] > temperatureOut) arraysJSON['OUT_TEMP']['MIN'] = temperatureOut;
    if (arraysJSON['OUT_TEMP']['MAX'] < temperatureOut) arraysJSON['OUT_TEMP']['MAX'] = temperatureOut;


    // TODO le faire en fonction du temps
    // if (arraysJSON['IN_TEMP'].length > 1000) {
    //     arraysJSON['IN_TEMP'].pop(0);
    //     arraysJSON['OUT_TEMP'].pop(0);
    // }

    console.log(arraysJSON);

    // Ajout valeurs dans le localStorage
    localStorage.setItem('TEMPERATURE', JSON.stringify(arraysJSON));
}


// -----------------------------------------------
//
var spanMin = document.getElementById('span_min_temperature');
var spanMax = document.getElementById('span_max_temperature');

//
function checkMinMax() {
    if (document.getElementsByClassName('favori')[0].parentNode.id == 'p_in_temperature') {
        var temperature = JSON.parse(localStorage.getItem('TEMPERATURE'));
        temperature = temperature['IN_TEMP'];
    }
    else {
        var temperature = JSON.parse(localStorage.getItem('TEMPERATURE'));
        temperature = temperature['OUT_TEMP'];
    }

    spanMin.innerText = temperature['MIN'];
    spanMax.innerText = temperature['MAX'];
}


// -----------------------------------------------
// 
var span_in_temperature = document.getElementById('span_in_temperature');
var span_out_temperature = document.getElementById('span_out_temperature');

//
function getTemperature(dataJSON) {
    let temperatureIn = dataJSON["capteurs"]["0"]["Valeur"];
    let temperatureOut = dataJSON["capteurs"]["1"]["Valeur"];

    localCacheTemp(temperatureIn, temperatureOut);

    // Couleur suivant la température extérieure
    let color = 'white';
    if (temperatureOut < 0)
        color = 'blue';
    else if (35 < temperatureOut)
        color = 'red';
    span_out_temperature.setAttribute("class", color);
    span_out_temperature.innerText = temperatureOut;

    // Couleur suivant la température intérieure
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

    

    // // Affichage des problèmes
    // let titre_message_in = document.getElementById('alerte-span-out');
    // if (temperatureOut < 0)
    //     titre_message_in.innerText = 'Banquise en vue !';
    // else if (35 < temperatureOut)
    //     titre_message_in.innerText = 'Hot ! Hot ! Hot !';

    // let titre_message_out = document.getElementById('alerte-span-in');
    // if (temperatureIn < 0)
    //     titre_message_out.innerText = 'Canalisations gelées, appelez SOS plombier et mettez un bonnet !';
    // else if (0 <= temperatureIn && temperatureIn < 12)
    //     titre_message_out.innerText = 'Montez le chauffage ou mettez un gros pull  !';
    // else if (22 < temperatureIn && temperatureIn <= 50)
    //     titre_message_out.innerText = 'Baissez le chauffage !';
    // else if (50 <= temperatureIn)
    //     titre_message_out.innerText = 'Appelez les pompiers ou arrêtez votre barbecue !';
}


// -----------------------------------------------

connectToCapteurs();
var interval = setInterval(function () {
    connectToCapteurs();
}, 180000);



// ------------------------------------------------------------------ //
// ------------------------------------------------------------------ //




if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('../service-worker.js') // à adapter à l'URL du projet
        .then(() => { console.log('Service Worker Registered'); });
}