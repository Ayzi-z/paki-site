
/*Sistema do menu lateral*/
document.getElementById("botao_menu").addEventListener("click", chamar_menu)

function chamar_menu(){
    const botao_menu = document.querySelector('#botao_menu')
    const menu_lateral = document.querySelector('#menu_lateral')

    botao_menu.classList.toggle('botaomenu_clicado')
    menu_lateral.classList.toggle('menu_lateralexibir') 
}

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

