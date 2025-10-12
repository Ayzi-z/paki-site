/* ============================= */
/* FUNÇÕES E FUNCIONALIDADES DO PACIENTE */
/* ============================= */

/*Sistema de slider das perguntas de consulta*/
document.addEventListener('DOMContentLoaded', () => {
    const containerSlider = document.querySelector(".container-slider");
    const sliderPerguntas = document.querySelector(".slider-perguntas");
    const btnVoltar = document.querySelector(".container-slider .controles-slider #voltar-slider");
    const btnAvancar = document.querySelector(".container-slider .controles-slider #avancar-slider");
    const perguntas = document.querySelectorAll(".slider-perguntas .pergunta")

    let pergunta_atual = 0;
    const qntPerguntas = perguntas.length;

    console.log(`Temos ${qntPerguntas} perguntas`)
   
   function transicaoPergunta(){
        let movimento = pergunta_atual * -100;
        sliderPerguntas.style.transform = `translateX(${movimento}%)`;  
   }

   btnAvancar.addEventListener("click", () =>{
        if ((pergunta_atual + 1) < qntPerguntas){
            pergunta_atual += 1;
        }
        transicaoPergunta();
        console.log(`Pergunta Atual ${pergunta_atual}`)
   })

    btnVoltar.addEventListener("click", () =>{
        if ((pergunta_atual - 1) >= 0){
            pergunta_atual -= 1;
        }
        transicaoPergunta();
        console.log(`Pergunta Atual ${pergunta_atual}`)
   })
  
});





window.onload = function() {
    listarItens();
    document.getElementById("formulario_agendarconsulta").addEventListener("submit", adicionarItem);
}

function adicionarItem(event) {
    event.preventDefault();
    let descricao = document.getElementById('descricao_consulta').value;
    let tipoSelecionado = document.querySelector('input[name="tipo_consulta"]:checked');
    let urgenciaSelecionada = document.querySelector('input[name="urgencia"]:checked');

    if (!descricao || !tipoSelecionado || !urgenciaSelecionada) {
        mensagem_popup("Preencha todos os campos antes de adicionar a consulta!", "alerta");
    } else {
        let tipo = tipoSelecionado.value;
        let urgencia = urgenciaSelecionada.value;

        let item = {
            descricao: descricao,
            tipo: tipo,
            urgencia: urgencia
        };

        let itens = carregarLocalStorage();
        itens.push(item);
        salvarLocalStorage(itens);

        document.getElementById('descricao_consulta').value = "";
        listarItens();
    }
}
function listarItens() {
    let lista = document.getElementById("lista_consultas");
    lista.innerHTML = "";
    let itens = carregarLocalStorage();

    for (let i = 0; i < itens.length; i++) {
        let item = itens[i];

        let li = document.createElement("li");
        li.className = "consulta_agendada";

        let h1 = document.createElement("h1");
        h1.textContent = "Tipo: " + item.tipo;

        let h2 = document.createElement("h2");
        h2.textContent = "Motivo: " + item.descricao;

        let h3 = document.createElement("h3");
        h3.textContent = "Urgência: " + item.urgencia;

        let divBotoes = document.createElement("div");
        divBotoes.className = "botoes_consulta";

        let btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.onclick = function() {
            editarItem(i);
        };

        let btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.onclick = function() {
            removerItem(i);
        };

        divBotoes.appendChild(btnEditar);
        divBotoes.appendChild(btnExcluir);

        li.appendChild(h1);
        li.appendChild(h2);
        li.appendChild(h3);
        li.appendChild(divBotoes);

        lista.appendChild(li);
    }
}

function removerItem(index) {
    let itens = carregarLocalStorage();
    itens.splice(index, 1);
    salvarLocalStorage(itens);
    listarItens();
}

function editarItem(index) {
    let itens = carregarLocalStorage();
    let novaDescricao = prompt("Edite o motivo da consulta:", itens[index].descricao);
    if (novaDescricao && novaDescricao.trim() !== "") {
        itens[index].descricao = novaDescricao.trim();
        salvarLocalStorage(itens);
        listarItens();
    }
}

function salvarLocalStorage(itens) {
    localStorage.setItem("consultas", JSON.stringify(itens));
}

function carregarLocalStorage() {
    let itens = localStorage.getItem("consultas");
    if (itens) {
        return JSON.parse(itens);
    } else {
        return [];
    }
}

function agendar_consulta(){
    window.location.href = "agendar-consulta.html";
}

/*SISTEMA DE CHAMAR E ESCONDER MENU MOBILE E TABLET*/

/* Função para sempre exibir o menu no pc e ocultar inicialmente no mobile (para evitar bugs entre mudar do mobile para o pc)*/
function transicao_menu() { 
   const nav = document.querySelector('.menu_nav')

    if (window.innerWidth > 1151) {
        nav.style.display = 'block'
    } else{
        nav.style.display = 'none'
    };
};
window.addEventListener("resize", transicao_menu);

/*Função para exibir menu mobile*/
document.getElementById("botao-menu-mobile").addEventListener("click",function(){
    const nav = document.querySelector('.menu_nav')

    if (nav.style.display == 'none'){
        nav.style.display = 'block'
    } else{
        nav.style.display = 'none'
    };
});

/*Função de Mensagem Pop Up*/
function mensagem_popup(texto, tipo){
    let container_mensagem = document.createElement("div")
    let mensagem = document.createElement("div");
    let imagem = document.createElement("img");
    let h1 = document.createElement("h1");
    let p = document.createElement ("p");

    if(tipo === 'erro'){

    } else if (tipo === 'alerta'){
        imagem.src = "/imagens/icones animados/alerta.gif"
        h1.textContent = "Alerta!"

    } else if (tipo === 'confirmacao'){
        imagem.src = "/imagens/icones animados/alerta.gif"
    }; 

    p.textContent = texto

    mensagem.appendChild(imagem);
    mensagem.appendChild(h1);
    mensagem.appendChild(p);
    mensagem.classList.add("mensagem-popup");

    container_mensagem.appendChild(mensagem)
    container_mensagem.classList.add("container-mensagem-popup")

    document.body.appendChild(container_mensagem)  
    
    setTimeout(() => { 
        container_mensagem.remove(); }, 2000
    );

};

/*SISTEMA DE TEMA*/

/*DOM*/
const botao_tema = document.getElementById("botao-tema");

/*Função para mudar tema*/
document.getElementById('botao-tema').addEventListener("click", function(){
    let tema_salvo = localStorage.getItem('tema-salvo') || 'claro';
    if (tema_salvo === 'escuro'){
        localStorage.setItem('tema-salvo','claro');
        aplicar_tema();
         mensagem_popup("Tema alterado para Claro!", "alerta");
        
    } else if (tema_salvo === 'claro') {
        localStorage.setItem('tema-salvo','escuro');
        aplicar_tema();
        mensagem_popup("Tema alterado para escuro!", "alerta");
    };
});

/*Função para aplicar o tema*/
function aplicar_tema(){
    let tema_salvo = localStorage.getItem("tema-salvo");

    if (tema_salvo === "escuro") {
        document.body.classList.add("escuro");
        botao_tema.textContent = "☀️";
        botao_tema.style.background = "#03697eff";
    } else {
        document.body.classList.remove("escuro");
        botao_tema.textContent = "🌙";
        botao_tema.style.background = "#160000ce";
    }
}

aplicar_tema(); /*Chamando a função sempre que o site carregar*/

/*SISTEMAS DA LOJA*/

/*Função de pesquisa de produtos*/

document.querySelector('#searchbar-produtos input').addEventListener("input", pesquisar_produtos);
function pesquisar_produtos() {
    let input = document.querySelector('#searchbar-produtos input').value.toLowerCase();
    let produtos = document.querySelectorAll('.cartao_produto');
    let listaProdutos = document.querySelector('.conteudo_pagina_loja');
    let produtoEncontrado = false;
    let mensagemErro = document.querySelector('.container-msg-sem-produto')
    const containerLoja = document.querySelector('.container_pagina_loja');

    produtos.forEach(produto => {
        let nomeProduto = produto.querySelector('.cartao_produto_descricao h1').textContent.toLowerCase();
        let descricaoProduto = produto.querySelector('.cartao_produto_descricao h2').textContent.toLowerCase();
        if(nomeProduto.includes(input) || descricaoProduto.includes(input)) {
            produto.style.display = '';
            produtoEncontrado = true;
            
        } else {
            produto.style.display = 'none';
        }
    });

    if (mensagemErro) {
            mensagemErro.remove();
    };
    if (produtoEncontrado === false) {

        containerMsg = document.createElement('div');
        msg = document.createElement('div');
        icone = document.createElement('div');
        h1 = document.createElement('h1');
        h2 = document.createElement('h2');

        icone.innerHTML = '<i class="fa-solid fa-face-frown-open" style="color: #63E6BE;"></i>';
        icone.classList.add('icone');
        h1.textContent = "Que pena, não encontramos nenhum produto com esse nome ou descrição.";   
        h2.textContent = "Mas faremos o possível para adicionar esse produto em nosso estoque o mais rápido possível!";
        
        
        containerMsg.classList.add('container-msg-sem-produto');
        msg.classList.add('msg-sem-produto');
        msg.appendChild(icone);
        msg.appendChild(h1);
        msg.appendChild(h2);

        containerMsg.appendChild(msg);
        containerLoja.appendChild(containerMsg);
    };
};

/* Função de troca menu médico*/
function trocar_imagem() {
    let img = document.querySelector(".esboco-medico");

    if (img.src.includes("med1.png")) {
        img.src = "/imagens/med2.png";
    } else {
        img.src = "/imagens/med1.png";
    }
}

/*Função De calcular o IMC*/
function classificarIMC(imc) {
    if (imc < 18.5) return "Abaixo do peso";
    if (imc < 24.9) return "Peso normal";
    if (imc < 29.9) return "Sobrepeso";
    if (imc < 34.9) return "Obesidade grau I";
    if (imc < 39.9) return "Obesidade grau II";
    return "Obesidade grau III";
}

function resultado_imc(event) {
    event.preventDefault();
    const peso = parseFloat(document.getElementById("peso").value);
    const altura = parseFloat(document.getElementById("altura").value);
    const resultadoDiv = document.getElementById("listaResultado");

    if (!peso || !altura) {
        resultadoDiv.innerHTML = "Por favor, insira peso e altura válidos.";
        resultadoDiv.style.color = "red";
        return;
    }

    const alturaMetros = altura / 100;
    const imc = peso / (alturaMetros * alturaMetros);
    const imcFormatado = imc.toFixed(2);
    const classificacao = classificarIMC(imc);

    resultadoDiv.style.color = "black";
    resultadoDiv.innerHTML = `Seu IMC é <b>${imcFormatado}</b> (${classificacao})`;
}