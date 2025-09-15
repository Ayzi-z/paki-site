/*SISTEMA DE CHAMAR E ESCONDER MENU MOBILE E TABLET*/
document.getElementById("botao-menu-mobile").addEventListener("click",function(){
    const nav = document.querySelector('nav')

    if (nav.style.display == 'none'){
        nav.style.display = 'block'
    } else{
        nav.style.display = 'none'
    };

});  

document.getElementById("botao_menu").addEventListener("click", chamar_menu)

/*SISTEMA DE TEMA*/

/* Função para mudar tema*/
document.getElementById("botao_tema").addEventListener("click",function(){
    let tema_salvo = localStorage.getItem('tema_salvo') || 'claro'; 
    const botao_tema = document.querySelector('#botao_tema')
        
    if (tema_salvo === 'escuro'){
            localStorage.setItem('tema_salvo','claro')
            botao_tema.textContent = '🌙'
        }
        else{
            localStorage.setItem('tema_salvo','escuro')
              botao_tema.textContent = '☀️'
        };
        tema_pagina()
});

/* Função para aplicar o tema*/