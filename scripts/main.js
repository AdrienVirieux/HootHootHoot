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

// Affichage des température

// --------- tempo -----------
function getRandomArbitrary(min, max) {
    return  Math.floor(Math.random() * (max - min) + min);
}
var A_temperatures = [];
for(var i = 20; i > 0; --i) {
    var x = getRandomArbitrary(-20,60);
    A_temperatures.push(x);
}
// --------- ----- -----------

var p_in_temperature = document.getElementById('p_in_temperature');
var span_in_temperature =  document.getElementById('span_in_temperature');
var p_out_temperature = document.getElementById('p_out_temperature');
var span_out_temperature =  document.getElementById('span_out_temperature');
var section = p_in_temperature.parentNode;

var i = 0;
var interval = setInterval(function() {
    if(i < A_temperatures.length) {
        if(document.getElementById('titre_message'))
            document.getElementById('titre_message').remove();
            
        let I_temperature = A_temperatures[i];
        let O_temperature = A_temperatures[i];
        let color = 'grey';

        // Température extérieure
        if(O_temperature < 0)
            color = 'blue';
        else if(35 < O_temperature)
            color = 'red';
        else
            color = 'grey';
        span_out_temperature.setAttribute("class", color);
        span_out_temperature.innerText = O_temperature;

        // Température intérieure
        if(I_temperature < 0)
            color = 'blue';
        else if(0 <= I_temperature && I_temperature < 12)
            color = 'cyan';
        else if(22 <= I_temperature && I_temperature < 50)
            color = 'orange';
        else if(50 <= I_temperature)
            color = 'red';
        else
            color = 'grey';
        span_in_temperature.setAttribute("class", color);
        span_in_temperature.innerText = I_temperature;
        
        ++i;

        // Affichage des problèmes
        let titre_message = document.createElement("h4")
        titre_message.setAttribute('id', 'titre_message');
        if(O_temperature < 0)
            titre_message.innerText = 'Banquise en vue !';
        else if(35 < O_temperature)
            titre_message.innerText = 'Hot ! Hot ! Hot !';
        else
            titre_message.innerText = 'Tout va bien !';

    } else {
        clearInterval(interval);
        interval = null;
    }
}, 2000)

// -----------------------------------------------

var socket = new WebSocket('wss://ws.hothothot.dog:9502');
socket.onopen = function(event) {
    console.log("Connexion établie");
    
    //On indique sur notre page web que la connexion est établie
    let label = document.getElementById("status");
    label.innerHTML = "Connexion établie";

    //Envoi d'un message au serveur (obligatoire)
    socket.send("coucou !");

    // au retour...
    socket.onmessage = function(event) {
        var datas = document.getElementById("datas");
        datas.innerHTML = event.data;
    }
}

Array.from(document.querySelectorAll('#nav-onglet ul li a')).forEach(function(onglet) {
    onglet.addEventListener('click', 
        function(event) {
            Array.from(document.querySelectorAll('.active')).forEach(function(elem_active) {
                elem_active.removeAttribute('class');
            });
            let element_a_id = event.target.attributes.href.value.replace('#', '');
            document.getElementById(element_a_id).setAttribute('class', 'active');
        }
    );
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/my-custom-pwa/sw.js') // à adapter à l'URL du projet
        .then(() => { console.log('Service Worker Registered'); });
}
