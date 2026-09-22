$(function () {
    const menu = $('nav#nav-esquerda ul.menu-principal');
    const btnMenu = $('#menu-toggle');
    const btnClose = $('#menu-close');

    function mostrarMenu() {
        menu.css('display', 'flex')
            .removeClass('animate__fadeOutRight')
            .addClass('animate__animated animate__fadeInRight animate__slow');
        btnMenu.css('display', 'none');
        btnClose.css('display', 'flex');
    }

    function esconderMenu() {
        menu.css('display', 'none')
            .removeClass('animate__animated animate__fadeInRight animate__fadeOutRight');
        btnMenu.css('display', 'flex');
        btnClose.css('display', 'none');
    }

    btnMenu.on('click', mostrarMenu);
    btnClose.on('click', esconderMenu);
    menu.find('a').on('click', esconderMenu);
});