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

// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//     caches.match(event.request)
//         .then(function(response) {
//         Cache Trouvé - return la réponse
//         if (response) {
//             return response;
//         }

//         return fetch(event.request).then(
//             function(response) {
//             On check si la réponse est valide
//             if(!response || response.status !== 200 || response.type !== 'basic') {
//                 return response;
//             }

//             On clone la réponse pour la mettre en cache et l'afficher dans le browser
//             var responseToCache = response.clone();

//             caches.open(CACHE_NAME)
//                 .then(function(cache) {
//                 cache.put(event.request, responseToCache);
//                 });

//             return response;
//             }
//         );
//         })
//     );
// });

// // Récupère les ressources depuis le serveur
// const fromNetwork = (request, timeout) => new Promise((fulfill, reject) => {
//     const timeoutId = setTimeout(reject, timeout);
//     fetch(request).then(response => {
//       clearTimeout(timeoutId);
//       fulfill(response);
//       update(request);
//     }, reject);
// });

// // récupère les ressources depuis le cache
// const fromCache = request => caches.open(CURRENT_CACHE).then(cache => cache.match(request).then(matching => matching));

// // met en cache la page
// const updateCache = request => caches.open(CURRENT_CACHE).then(cache =>fetch(request).then(response => cache.put(request, response)));

// // Serveur First
// self.addEventListener('fetch', event => {
//   event.respondWith(
//     fromNetwork(event.request, 10000).catch(() => fromCache(event.request))
//   );
//   event.waitUntil(updateCache(event.request));
// });

// Récupérer les ressources depuis le serveur, si réussi on les mets en cache.
// Afficher depuis le cache.