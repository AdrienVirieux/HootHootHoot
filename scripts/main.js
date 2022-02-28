function sideMenu() {
    let sideNav = document.getElementById('side-nav');
    if (sideNav.style.display == 'none') {
        sideNav.style.display = 'block';
    } else {
        sideNav.style.display = 'none';
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
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('service-worker.js').then(function(registration) {
            // Register fonctionne
            console.log('Service Worker registration successful with scope: ', registration.scope);
        }, function(err) {
            // Register ne marche pas
            console.log('Service Worker registration failed: ', err);
        });
    });
}