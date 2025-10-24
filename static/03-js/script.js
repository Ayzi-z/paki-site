/* ============================= */
/* FUNÇÕES DO SISTEMA DE LOGIN E CADASTRO DE USUARIOS*/
/* ============================= */

/*Sistema validador de dados durante o cadastro*/
document.addEventListener('DOMContentLoaded', () => {
    const formCadastro = document.getElementById("formCadastro");
  
    if (formCadastro) /* Verificando se o formulario de cadastro existe na página*/ {
        const inputEmail = formCadastro.querySelector("#email");
        const inputTipo = formCadastro.querySelector('#tipo-usuario');

        inputTipo.addEventListener("change", () => {
            let tipoSelecionado = inputTipo.value
            let grupoTipo = inputTipo.closest(".grupo-formulario");
            
            const inputCodigo = document.querySelector("#grupo-codigo-ativacao");
            
            const inputEscala = document.querySelector('#grupo-dias-trabalho')
            
            if (inputCodigo) inputCodigo.remove();

            if (inputEscala) inputEscala.remove()

            if (tipoSelecionado === "nutricionista") {
                
                /* Criando um input pro codigo de ativacao */
                const divGrupo = document.createElement("div");
                divGrupo.classList.add("grupo-formulario");
                divGrupo.id = "grupo-codigo-ativacao"; 

                const labelCodigo = document.createElement("label");
                labelCodigo.setAttribute("for", "codigo_ativacao");
                labelCodigo.textContent = "Número do seu código de ativação:";

       
                const inputCodigo = document.createElement("input");
                inputCodigo.type = "text";
                inputCodigo.name = "codigo_ativacao";
                inputCodigo.id = "codigo_ativacao";
                inputCodigo.required = true;
                inputCodigo.placeholder = "Digite o código de ativação";

                /*Colocando a label e o input do codigo dentro da div*/
                divGrupo.appendChild(labelCodigo);
                divGrupo.appendChild(inputCodigo);

                /* Colocando a div logo depois do tipo de usuario*/
                grupoTipo.parentNode.insertBefore(divGrupo, grupoTipo.nextSibling);


                /* criando input para inserir a escala de dias do nutricionista*/
                const grupo_formulario = document.createElement("div");
                grupo_formulario.classList.add("grupo-formulario");
                grupo_formulario.id = "grupo-dias-trabalho";
        
                const label = document.createElement("label");
                label.textContent = "Selecione os dias que você trabalha na clinica:";
                grupo_formulario.appendChild(label);

                const diasSemana = ["segunda","terca","quarta","quinta","sexta"];
                const container_opcoes = document.createElement("div");
                diasSemana.forEach(dia => {
                      const label_dia = document.createElement("label");

                      const checkbox = document.createElement("input");
                      checkbox.type = "checkbox";
                      checkbox.name = "dias_trabalho";
                      checkbox.value = dia;

                      label_dia.appendChild(checkbox);

                      const texto = document.createTextNode(dia.charAt(0).toUpperCase() + dia.slice(1));
                      
                      label_dia.appendChild(texto);

                      container_opcoes.appendChild(label_dia);
                });

        grupo_formulario.appendChild(label);
        grupo_formulario.appendChild(container_opcoes);
        grupoTipo.parentNode.insertBefore(grupo_formulario, grupoTipo.nextSibling);
 
            }
        });

        inputEmail.addEventListener("blur", () => { /*Verificando se o e-mail já existe sempre que sai do campo*/
            let email = inputEmail.value.trim();

            fetch('/validarcadastro', { /*Vendo se o email existe naquela api do banco de dados*/
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            })
            .then(res => res.json())
            .then(dados => {

            console.log(dados)
            
            if (dados.email === true) /* Se o email existe faz isso no input e no formulario*/ {
                window.alert("O email Informado já existe no banco de dados")
                inputEmail.style.borderColor = "red";
                let aviso_email = document.getElementById("aviso-email") /*Vendo se já existe alguma mensagem de erro*/;
                    if (!aviso_email)/* se nao existir uma mensagem de erro no input ele cria uma*/{
                        aviso = document.createElement("p");
                        aviso.id = "aviso-email";
                        aviso.style.color = "red";
                        aviso.textContent = "Este e-mail já existe!";
                        inputEmail.parentNode.appendChild(aviso);
                        
                        event.preventDefault();
                    }
            } else /* Se o e-mail nao existir no banco ele tira os erros do input*/ {
                inputEmail.style.borderColor = "";
                const aviso = document.getElementById("aviso-email");
                if (aviso) aviso.remove();
            }
            });
        });
    }
});


/* ============================= */
/* FUNÇÕES DE CONSULTA LADO NUTRICIONISTA*/
/* ============================= */

/*Funcao de adicionar pdf na consulta*/
function selecionarPDF(id) {
    const input = document.getElementById(`pdfInput-${id}`);
    input.click();

    input.addEventListener('change', () => {
      const file = input.files[0];
      if (file) {
        alert(`PDF "${file.name}" adicionado para o usuário ID ${id}`);
        }
    });
}




/*Sistema do slider das perguntas de consulta paciente*/
document.addEventListener('DOMContentLoaded', () => {
    const containerSlider = document.querySelector(".container-slider");
    const sliderPerguntas = document.querySelector(".slider-perguntas");
    const btnVoltar = document.querySelector(".container-slider .controles-slider #voltar-slider");
    const btnAvancar = document.querySelector(".container-slider .controles-slider #avancar-slider");
    const perguntas = document.querySelectorAll(".slider-perguntas .pergunta");
    const controles_slider = document.querySelector(".container-slider .controles-slider")

    if (containerSlider){
        let perguntaAtual = 0;
        const qntPerguntas = perguntas.length;

        if (perguntaAtual == 0){
            btnVoltar.style.display = "none"
            controles_slider.style.justifyContent = "flex-end"
        }
        
        function transicaoPergunta() {

            let movimento = perguntaAtual * -100;
            sliderPerguntas.style.transform = `translateX(${movimento}%)`;  
        }

        btnAvancar.addEventListener("click", () =>{ 
                if ((perguntaAtual + 1) < qntPerguntas){
                    perguntaAtual += 1;
                    btnVoltar.style.display = "block"
                    controles_slider.style.justifyContent = "space-between"
                    transicaoPergunta()
                }

        if ((perguntaAtual + 1) >= qntPerguntas){
            btnAvancar.style.display = "none"

        }
        console.log (`quantidade pergunta ${qntPerguntas}`)
        console.log(`Proxima ${perguntaAtual + 1}`)
        console.log(`Pergunta Atual ${perguntaAtual}`)
        })

        btnVoltar.addEventListener("click", () =>{
            if ((perguntaAtual - 1) >= 0){
                perguntaAtual -= 1;
                btnAvancar.style.display = "block"
            }
            if ((perguntaAtual - 1) < 0 ){
                btnVoltar.style.display = "none"
                controles_slider.style.justifyContent = "flex-end"
            }

            transicaoPergunta();
            console.log(`Pergunta Atual ${perguntaAtual}`)
        })
    }
    
});

/*Funcao para pegar datas e horarios disponiveis do nosso backend e listar no calendario e listar medico*/
document.addEventListener('DOMContentLoaded', async () => {
    const perguntaData = document.querySelector('.slider-perguntas #pergunta-data')
    const diasCalendario = document.querySelectorAll('.dias-calendario .data');
    const nomeMes = document.querySelector('.nome-mes');
    const btnProximoMes = document.querySelectorAll('.mes .seta')[1];
    const btnMesAnterior = document.querySelectorAll('.mes .seta')[0];
    const listaHorarios = document.querySelector('.lista-horarios');
    let dadosHorarios = {};
    let mesAtual;
    let anoAtual;

    if (perguntaData){
        async function carregarHorarios() {
            const resposta = await fetch('/api/verhorarios', { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const dados = await resposta.json(); 
            dadosHorarios = dados; 

            const datas = Object.keys(dadosHorarios); 
            if (datas.length > 0) {
                const [ano, mes] = datas[0].split('-').map(Number);
                mesAtual = mes;
                anoAtual = ano;
            } else {
                const hoje = new Date();
                mesAtual = hoje.getMonth() + 1;
                anoAtual = hoje.getFullYear();
            }
            console.log(dadosHorarios, mesAtual, anoAtual)
            configurarCalendario(dadosHorarios)
        }

        /* Definindo mês atual e marcando os dias disponíveis no calendario*/
        function configurarCalendario(dadosHorarios) {
            const nomeMeses = [
                'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ];

            if (dadosHorarios.length === 0) return;
            nomeMes.textContent = `${nomeMeses[mesAtual - 1]} ${anoAtual}`;
            
            /*Aplicando funcoes e estilos nos dias do calendario que estao disponiveis*/
            diasCalendario.forEach(botao => {
                const diaNum = Number(botao.textContent);
                const dataFormatada = `${anoAtual}-${String(mesAtual).padStart(2, '0')}-${String(diaNum).padStart(2, '0')}`;

                if (dados[dataFormatada]) {
                    botao.classList.add('disponivel');
                    botao.addEventListener('click', (event) => {
                        event.preventDefault();
                        selecionarDia(botao, dataFormatada);
                    });
                } else {
                    botao.classList.remove('disponivel');
                    botao.removeEventListener('click', () => selecionarDia(botao, dataFormatada));
                }
            });
        }
     
        function selecionarDia(botao, data) {
            diasCalendario.forEach(b => b.classList.remove('selecionado'));
            botao.classList.add('selecionado');
            listarHorariosDisponiveis(data);
        }

        /*Funcao para ficar listando os horários disponiveis de acordo com o dia selecionado no front-end*/
        function listarHorariosDisponiveis(data) {
            listaHorarios.innerHTML = '';
            const horarios = dadosHorarios[data] || [];

            if (horarios.length === 0) {
                listaHorarios.textContent = 'Nenhum horário disponível neste dia.';
                return;
            }

            horarios.forEach(hora => {
                const label = document.createElement('label');
                label.classList.add('horario-label');

                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'horario';
                input.value = hora;

                const span = document.createElement('span');
                span.textContent = hora;

                label.appendChild(input);
                label.appendChild(span);
                listaHorarios.appendChild(label);
            });
        }

        btnProximoMes.addEventListener('click', (event) => {
            event.preventDefault(); 
            const datas = Object.keys(dadosHorarios);
            const proxData = datas.find(d => Number(d.split('-')[1]) !== mesAtual);
            if (proxData) {
                const [ano, mes] = proxData.split('-').map(Number);
                mesAtual = mes;
                anoAtual = ano;
                configurarCalendario(dadosHorarios);
            }
        });

        btnMesAnterior.addEventListener('click', (event) => {
            event.preventDefault(); // evita refresh
            const datas = Object.keys(dadosHorarios);
            const prevData = datas.reverse().find(d => Number(d.split('-')[1]) < mesAtual);
            if (prevData) {
                const [ano, mes] = prevData.split('-').map(Number);
                mesAtual = mes;
                anoAtual = ano;
                configurarCalendario(dadosHorarios);
            }
        });
        await carregarHorarios();
    } 
});

/*Funcao para agendar consulta em si e enviar para o backend*/
async function agendarConsulta(dia, hora, id_medico, id_paciente, motivo){
    window.location.href = "agendarConsulta";
}



/* ============================= */
/* FUNCÕES DO SITE EM GERAL*/
/* ============================= */

/*Sistemas do menu mobile*/

/* Função para sempre exibir o menu no pc e ocultar inicialmente no mobile (para evitar bugs entre mudar do mobile para o pc)*/
function transicao_menu() { 
   const nav = document.querySelector('.menu_nav')
    if (nav){
        if (window.innerWidth > 1151) {
        nav.style.display = 'block'
        } else{
            nav.style.display = 'none'
        };
    };
    }
    

window.addEventListener("load", transicao_menu);
window.addEventListener("resize", transicao_menu);


/*Função para exibir menu mobile*/
const btn_mobile = document.getElementById("botao-menu-mobile");

if (btn_mobile) {
    document.getElementById("botao-menu-mobile").addEventListener("click",function(){
    const nav = document.querySelector('.menu_nav')

    if (nav.style.display == 'none'){
    nav.style.display = 'block'
    } else{
    nav.style.display = 'none'
    };
    });

}



/*Função de Exibir uma mensagem popup na tela*/
function mensagem_popup(texto, tipo){
    let container_mensagem = document.createElement("div")
    let mensagem = document.createElement("div");
    let imagem = document.createElement("img");
    let h1 = document.createElement("h1");
    let p = document.createElement ("p");

    if (document.querySelector(".container-mensagem-popup")) return;

    if(tipo === 'erro'){

    } else if (tipo === 'alerta'){
        imagem.src = "/static/imagens/icones animados/alerta.gif"
        h1.textContent = "Alerta!"

    } else if (tipo === 'confirmacao'){
        imagem.src = "/static/imagens/icones animados/alerta.gif"
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

/*Sistema de mudar tema*/
const botao_tema = document.getElementById("botao-tema");

if (botao_tema) {
    
    document.getElementById('botao-tema').addEventListener("click", function(){
    let tema_salvo = localStorage.getItem('tema-salvo') || 'claro';
    
    if (tema_salvo === 'escuro'){
        localStorage.setItem('tema-salvo','claro');
        aplicar_tema();

        botao_tema.textContent = "🌙";
        botao_tema.style.background = "#160000ce";

        mensagem_popup(`Tema alterado para ${tema_salvo}!`, "alerta");
        
    } else if (tema_salvo === 'claro') {
        localStorage.setItem('tema-salvo','escuro');
        aplicar_tema();

        botao_tema.textContent = "☀️";
        botao_tema.style.background = "#03697eff";

        mensagem_popup(`Tema alterado para ${tema_salvo}!`, "alerta");
    };
});
}
/*Função para aplicar o tema*/
function aplicar_tema(){
    let tema_salvo = localStorage.getItem("tema-salvo");

    if (tema_salvo === "escuro") {
        document.body.classList.add("escuro");
       
    } else {
        document.body.classList.remove("escuro");
    }
}

aplicar_tema(); /*Chamando a função sempre que o site carregar*/

/*SISTEMAS DA LOJA (que provavelmente vão ser removidos)*/

/*Função de pesquisa de produtos*/

const searchbarLoja = document.querySelector('#searchbar-produtos input');

if (searchbarLoja) {
    searchbarLoja.addEventListener("input", pesquisar_produtos);
}

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

/* Função de troca menu médico (isso aq é temporário somente para a apresentação parcial)*/
function trocar_imagem() {
    let img = document.querySelector(".esboco-medico");

    if (img.src.includes("med1.png")) {
        img.src = "/static/imagens/med2.png";
    } else {
        img.src = "/static/imagens/med1.png";
    }
}

/* Função pra pagina sobre-usuario */

document.addEventListener('DOMContentLoaded', function () {
    
    if (document.title.includes("Sobre o Usuário")) {

    
        fetch('/api/usuarioatual')
            .then(response => response.json())
            .then(usuario => {
                const nomeCompleto = `${usuario.nome} ${usuario.sobrenome}`;

                
                const nomeUsuarioElem = document.getElementById('nome-usuario');
                const emailUsuarioElem = document.getElementById('email-usuario');
                const tipoUsuarioElem = document.getElementById('tipo-usuario');

                if (nomeUsuarioElem) nomeUsuarioElem.innerText = nomeCompleto;
                if (emailUsuarioElem) emailUsuarioElem.innerText = usuario.email;
                if (tipoUsuarioElem) tipoUsuarioElem.innerText =
                    usuario.tipo.charAt(0).toUpperCase() + usuario.tipo.slice(1);

                
                const inputNome = document.getElementById('input-nome');
                if (inputNome) inputNome.value = nomeCompleto;

                
                const inputEmail = document.getElementById('input-email');
                if (inputEmail) {
                    inputEmail.value = usuario.email;
                }

                
                const inputTelefone = document.getElementById('input-telefone');
                if (inputTelefone) {
                    inputTelefone.value = usuario.telefone || '';
                }
            })
            .catch(erro => console.error('Erro ao buscar usuário atual:', erro));

        
        const formDadosPessoais = document.querySelector('#aba-dados form');
        if (formDadosPessoais) {
            formDadosPessoais.addEventListener('submit', function (event) {
                event.preventDefault(); 

                const nomeCompleto = document.getElementById('input-nome').value;
                const telefone = document.getElementById('input-telefone') ? document.getElementById('input-telefone').value : '';

                fetch('/atualizarusuario', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nome_completo: nomeCompleto,
                        telefone: telefone
                    })
                })
                .then(response => response.json())
                .then(resultado => {
                    alert(resultado.mensagem || resultado.erro);
                })
                .catch(erro => {
                    console.error('Erro ao atualizar:', erro);
                    alert('Erro ao atualizar os dados!');
                });
            });
        }

    }
});



/* FUNÇÃO PARA MUDAR ABA NO PERFIL DO USUÁRIO */


function mudarAba(abaId) {
    const tipoUsuario = obterTipoUsuario(); 
    
    
    const permissoes = {
        'paciente': ['dados', 'seguranca'],
        'nutricionista': ['dados', 'profissional', 'seguranca'],
        'admin': ['dados', 'profissional', 'seguranca', 'admin']
    };

    if (!permissoes[tipoUsuario] || !permissoes[tipoUsuario].includes(abaId)) {
        mensagem_popup('Você não tem permissão para acessar esta aba!', 'alerta');
        return;
    }

    const todasAbas = document.querySelectorAll('.aba');
    todasAbas.forEach(aba => {
        aba.classList.remove('ativa');
    });

    const todosConteudos = document.querySelectorAll('.aba-conteudo');
    todosConteudos.forEach(conteudo => {
        conteudo.classList.remove('ativa');
    });

    const abaClicada = document.querySelector(`.aba[onclick="mudarAba('${abaId}')"]`);
    if (abaClicada) {
        abaClicada.classList.add('ativa');
    }

    const conteudoAba = document.getElementById(`aba-${abaId}`);
    if (conteudoAba) {
        conteudoAba.classList.add('ativa');
    }
}


/* FUNÇÃO PARA OBTER O TIPO DE USUÁRIO */

function obterTipoUsuario() {
    if (typeof usuarioTipo !== 'undefined') {
        return usuarioTipo;
    }
    
    const tipoElement = document.getElementById('tipo-usuario-atual');
    if (tipoElement) {
        return tipoElement.value;
    }
    
    const tipoTexto = document.querySelector('.tipo-usuario');
    if (tipoTexto) {
        const texto = tipoTexto.textContent.toLowerCase();
        if (texto.includes('paciente')) return 'paciente';
        if (texto.includes('nutricionista')) return 'nutricionista';
        if (texto.includes('admin')) return 'admin';
    }
    
    return 'paciente'; 
}


/* FUNÇÃO PARA CONFIGURAR ABAS DINAMICAMENTE */

function configurarAbasPerfil() {
    const tipoUsuario = obterTipoUsuario();
    const abasContainer = document.querySelector('.abas-perfil');
    
    if (!abasContainer) return;
    
    const abasPermitidas = {
        'paciente': [
            { id: 'dados', texto: 'Dados Pessoais' },
            { id: 'seguranca', texto: 'Segurança' }
        ],
        'nutricionista': [
            { id: 'dados', texto: 'Dados Pessoais' },
            { id: 'profissional', texto: 'Informações Profissionais' },
            { id: 'seguranca', texto: 'Segurança' }
        ],
        'admin': [
            { id: 'dados', texto: 'Dados Pessoais' },
            { id: 'profissional', texto: 'Informações Profissionais' },
            { id: 'seguranca', texto: 'Segurança' },
            { id: 'admin', texto: 'Administração' }
        ]
    };
    
    abasContainer.innerHTML = '';
    
    const abasDoUsuario = abasPermitidas[tipoUsuario] || abasPermitidas['paciente'];
    
    abasDoUsuario.forEach((aba, index) => {
        const botaoAba = document.createElement('button');
        botaoAba.className = `aba ${index === 0 ? 'ativa' : ''}`;
        botaoAba.setAttribute('onclick', `mudarAba('${aba.id}')`);
        botaoAba.textContent = aba.texto;
        abasContainer.appendChild(botaoAba);
    });
    
    const todosConteudos = document.querySelectorAll('.aba-conteudo');
    todosConteudos.forEach(conteudo => {
        conteudo.classList.remove('ativa');
    });
    
    const primeiroConteudo = document.getElementById(`aba-${abasDoUsuario[0].id}`);
    if (primeiroConteudo) {
        primeiroConteudo.classList.add('ativa');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.container-perfil-usuario')) {
        configurarAbasPerfil();
    }
});


/* FUNÇÕES DO GERENCIAR USUÁRIOS */

document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.container-gerenciar-usuarios')) {
        carregarUsuarios();
        configurarFiltros();
        configurarPesquisa();
    }
});

async function carregarUsuarios() {
    try {
        const resposta = await fetch('/api/gerenciarusuarios');
        const usuarios = await resposta.json();
        
        preencherTabela(usuarios);
    } catch (erro) {
        console.error('Erro ao carregar usuários:', erro);
        mensagem_popup('Erro ao carregar lista de usuários!', 'erro');
    }
}

/* Função para preencher a tabela e os cards com dados da API */
function preencherTabela(usuarios) {
    const tbody = document.querySelector('#corpo-tabela-usuarios');
    const cardsContainer = document.querySelector('#lista-usuarios-cards');
    
    if (usuarios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px;">
                    Nenhum usuário encontrado.
                </td>
            </tr>
        `;
        
        if (cardsContainer) {
            cardsContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    Nenhum usuário encontrado.
                </div>
            `;
        }
        return;
    }

    tbody.innerHTML = '';
    usuarios.forEach(usuario => {
        const linha = document.createElement('tr');
        
        let badgeClasse = '';
        let badgeTexto = '';
        switch(usuario.tipo) {
            case 'nutricionista':
                badgeClasse = 'badge-medico';
                badgeTexto = 'Nutricionista';
                break;
            case 'admin':
                badgeClasse = 'badge-admin';
                badgeTexto = 'Admin';
                break;
            default:
                badgeClasse = 'badge-paciente';
                badgeTexto = 'Paciente';
        }

        const nomeCompleto = `${usuario.nome} ${usuario.sobrenome}`.trim();
        
       linha.innerHTML = `
    <td>
        <div class="usuario-info">
            <div>
                <strong>${nomeCompleto || 'Nome não informado'}</strong>
                <div>${usuario.tipo === 'nutricionista' ? 'CRN: --' : usuario.tipo.charAt(0).toUpperCase() + usuario.tipo.slice(1)}</div>
            </div>
        </div>
    </td>
            <td>${usuario.email}</td>
            <td><span class="badge-tipo ${badgeClasse}">${badgeTexto}</span></td>
            <td><span class="status-ativo">Ativo</span></td>
            <td>--/--/----</td>
            <td>
                <div class="acoes-usuario">
                    <a href="/sobremim?id=${usuario.id}" class="botao-acao botao-visualizar">👁️</a>
                    <button class="botao-acao botao-excluir" onclick="excluirUsuario(${usuario.id}, '${nomeCompleto || 'Usuário'}')">🗑️</button>
                </div>
            </td>
        `;
        
        tbody.appendChild(linha);
    });

    if (cardsContainer) {
        cardsContainer.innerHTML = '';
        usuarios.forEach(usuario => {
            const card = document.createElement('div');
            card.className = 'card-usuario';
            
            let badgeClasse = '';
            let badgeTexto = '';
            switch(usuario.tipo) {
                case 'nutricionista':
                    badgeClasse = 'badge-medico';
                    badgeTexto = 'Nutricionista';
                    break;
                case 'admin':
                    badgeClasse = 'badge-admin';
                    badgeTexto = 'Admin';
                    break;
                default:
                    badgeClasse = 'badge-paciente';
                    badgeTexto = 'Paciente';
            }

            const nomeCompleto = `${usuario.nome} ${usuario.sobrenome}`.trim();
            
            card.innerHTML = `
    <div class="card-header">
        <div class="card-info">
            <h3>${nomeCompleto || 'Nome não informado'}</h3>
            <div class="card-tipo">${usuario.tipo === 'nutricionista' ? 'CRN: --' : usuario.tipo.charAt(0).toUpperCase() + usuario.tipo.slice(1)}</div>
        </div>
    </div>
                
                <div class="card-detalhes">
                    <div class="card-detalhe">
                        <span class="card-label">Email</span>
                        <span class="card-valor">${usuario.email}</span>
                    </div>
                    <div class="card-detalhe">
                        <span class="card-label">Tipo</span>
                        <span class="card-badge ${badgeClasse}">${badgeTexto}</span>
                    </div>
                    <div class="card-detalhe">
                        <span class="card-label">Status</span>
                        <span class="card-valor status-ativo">Ativo</span>
                    </div>
                    <div class="card-detalhe">
                        <span class="card-label">Cadastro</span>
                        <span class="card-valor">--/--/----</span>
                    </div>
                </div>
                
                <div class="card-acoes">
                    <a href="/sobremim?id=${usuario.id}" class="card-botao visualizar">👁️ Visualizar</a>
                    <button class="card-botao excluir" onclick="excluirUsuario(${usuario.id}, '${nomeCompleto || 'Usuário'}')">🗑️ Excluir</button>
                </div>
            `;
            
            cardsContainer.appendChild(card);
        });
    }
}

function configurarFiltros() {
    const botoesFiltro = document.querySelectorAll('.filtro-botao');
    
    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', function() {
            botoesFiltro.forEach(b => b.classList.remove('ativo'));
            this.classList.add('ativo');
            
            const filtro = this.getAttribute('data-filtro');
            filtrarUsuarios(filtro);
        });
    });
}

function filtrarUsuarios(filtro) {
    const linhas = document.querySelectorAll('#tabela-usuarios tbody tr');
    
    linhas.forEach(linha => {
        const tipo = linha.querySelector('.badge-tipo').textContent.toLowerCase();
        
        if (filtro === 'todos') {
            linha.style.display = '';
        } else if (filtro === 'medico' && tipo === 'nutricionista') {
            linha.style.display = '';
        } else if (filtro === 'paciente' && tipo === 'paciente') {
            linha.style.display = '';
        } else if (filtro === 'admin' && tipo === 'admin') {
            linha.style.display = '';
        } else {
            linha.style.display = 'none';
        }
    });
}

function configurarPesquisa() {
    const inputPesquisa = document.querySelector('.barra-pesquisa-usuarios input');
    const botaoPesquisa = document.querySelector('.botao-pesquisa');
    
    function pesquisar() {
        const termo = inputPesquisa.value.toLowerCase();
        const linhas = document.querySelectorAll('#tabela-usuarios tbody tr');
        
        linhas.forEach(linha => {
            const textoLinha = linha.textContent.toLowerCase();
            linha.style.display = textoLinha.includes(termo) ? '' : 'none';
        });
    }
    
    inputPesquisa.addEventListener('input', pesquisar);
    botaoPesquisa.addEventListener('click', pesquisar);
}

async function excluirUsuario(id, nome) {
    if (confirm(`Tem certeza que deseja excluir o usuário "${nome}"? Esta ação não pode ser desfeita.`)) {
        try {
            const resposta = await fetch(`/api/excluirusuario/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const resultado = await resposta.json();
            
            if (resposta.ok) {
                mensagem_popup(resultado.mensagem, 'confirmacao');
                carregarUsuarios();
            } else {
                mensagem_popup(resultado.erro, 'erro');
            }
        } catch (erro) {
            console.error('Erro ao excluir usuário:', erro);
            mensagem_popup('Erro ao excluir usuário!', 'erro');
        }
    }
}

