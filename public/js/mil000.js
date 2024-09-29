$(document).ready(function () {
    $('.mil000').each(function () {
        var numero = $(this).text();
        $(this).text(formatearNumeroSinDecimales(numero));
    });
});

function formatearNumeroSinDecimales(numero) {
    // Convertir el número a un entero
    numero = Math.floor(parseFloat(numero));

    // Formatear la parte entera con punto como separador de miles
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}e