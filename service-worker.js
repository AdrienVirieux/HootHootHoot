
var CACHE_NAME = '_HotHotHot_offline';
var urlCache = [
    "/",
    "/img/",
    "/scripts/",
    "/styles/"
];

// Charge les ressources puis les mets en cache
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
    caches.match(event.request)
        .then(function(response) {
        // Cache Trouvé - return la réponse
        if (response) {
            return response;
        }

        return fetch(event.request).then(
            function(response) {
            // On check si la réponse est valide
            if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
            }

            // On clone la réponse pour la mettre en cache et l'afficher dans le browser
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
                .then(function(cache) {
                cache.put(event.request, responseToCache);
                });

            return response;
            }
        );
        })
    );
});

// Récupère les ressources depuis le serveur
const fromNetwork = (request, timeout) => new Promise((fulfill, reject) => {
    const timeoutId = setTimeout(reject, timeout);
    fetch(request).then(response => {
      clearTimeout(timeoutId);
      fulfill(response);
      update(request);
    }, reject);
});

// récupère les ressources depuis le cache
const fromCache = request => caches.open(CURRENT_CACHE).then(cache => cache.match(request).then(matching => matching));

// met en cache la page
const updateCache = request => caches.open(CURRENT_CACHE).then(cache =>fetch(request).then(response => cache.put(request, response)));

// Serveur First
self.addEventListener('fetch', event => {
  event.respondWith(
    fromNetwork(event.request, 10000).catch(() => fromCache(event.request))
  );
  event.waitUntil(updateCache(event.request));
});

// Récupérer les ressources depuis le serveur, si réussi on les mets en cache.
// Afficher depuis le cache.

// -----------------------------------------------
// Notifications
function randomNotification() {  
    var randomNumber = getRandomInt(5);  
    console.log(randomNumber);  
    if(randomNumber >= 2) {  
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
        if(result === 'granted') {  
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