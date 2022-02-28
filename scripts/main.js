
function sideMenu() {
    let sideNav = document.getElementById('side-nav');
    if (sideNav.style.display == 'none') {
        sideNav.style.display = 'block';
    }
    else {
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
    navigator.serviceWorker
        .register('/my-custom-pwa/sw.js') // à adapter à l'URL du projet
        .then(() => { console.log('Service Worker Registered'); });
}
