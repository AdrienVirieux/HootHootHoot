var CACHE_NAME = '_HotHotHot_offline';
var urlCache = [
    "/img/menu-bar.png",
    "/img/star-empty.png",
    "/img/star.png",
    "/scripts/main.js",
    "/scripts/graph.js",
    "/scripts/chart.js",
    "/styles/bootstrap.css",
    "/styles/style.css",
    "/offline.html"
];

// Charge les ressources puis les mets dans le cache
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log("Cashe Opened");
            return cache.addAll(urlCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            // Cache Trouvé - retourne la réponse
            if (response) return response;
            return fetch(event.request).then(function(response) {
                // On clone la réponse
                var responseToCache = response.clone();
                // On met le clone dans le cache
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request, responseToCache);
                });
                // On retourne la réponse au navigateur
                return response;
            })
        }).catch(function() {
            // Si pas de cache et serveur offline on fallback sur la page offline
            return caches.match('/offline.html');
        })
    );
});

// -----------------------------------------------
// Notifications
function randomNotification() {
    var randomNumber = getRandomInt(5);
    console.log(randomNumber);
    if (randomNumber >= 2) {
        var notifTitle = "Chaud, non ?";
        var notifBody = 'Température : ' + randomNumber + '.';
        var notifImg = '/assets/images/android-chrome-192x192.png';
        var options = {
            body: notifBody,
            icon: notifImg
        }
        var notif = new Notification(notifTitle, options);
    }
    setTimeout(randomNotification, 180000);
}

//On génére un nombre aléatoire pour la démo  
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

var button = document.getElementById("notifications");
button.addEventListener('click', function(e) {
    Notification.requestPermission().then(function(result) {
        if (result === 'granted') {
            randomNotification();
        }
    });
});


// -----------------------------------------------
// bouton d'installation
let deferredPrompt;
const addBtn = document.querySelector('.add-button');
addBtn.style.display = 'block';

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt  
    e.preventDefault();
    // Stash the event so it can be triggered later.  
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen  
    addBtn.style.display = 'block';

    addBtn.addEventListener('click', (e) => {
        // hide our user interface that shows our A2HS button  
        addBtn.style.display = 'none';
        // Show the prompt  
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt  
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
    });
});