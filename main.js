if ('serviceWorker' in navigator) {
    console.log('ServiceWorker es compatible');

    window.addEventListener('load', function(){
        navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('ServiceWorker registrado con éxito (Scope:', reg.scope, ')'))
        .catch(err => console.log('Fallo en el registro del ServiceWorker:', err));
    });
}
else {
    console.log('ServiceWorker no es compatible');
}