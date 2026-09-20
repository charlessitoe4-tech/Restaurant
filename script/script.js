//ativando o meu mobile

function mostrarMenu(){
    $('nav#nav-esquerda ul.menu-principal').css('display','flex')
    $('nav#nav-esquerda ul.menu-principal').addClass('animate_animated animate_fadeInRightanimate_slow');

    $('nav#nav-esquerda ul#icone-menu li#menu').css('display','none');
    $('nav#nav-esquerda ul#icone-menu li#menuX').css('display','flex');
}

function esconderMenu(){
    $('nav#nav-esquerda ul.menu-principal').css('display','none');

    $('nav#nav-esquerda ul#icone-menu li#menu').css('display','flex');
    $('nav#nav-esquerda ul#icone-menu li#menuX').css('display','none');
}

let controle=true;

$('nav#nav-esquerda ul#icone-menu li#menu').click(function(){
    if(controle==true){
        mostrarMenu();
        controle=false;
    }else{
        esconderMenu();
        controle=true;
    }
});    