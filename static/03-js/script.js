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

    /* ============================= */
    /* FUNÇÕES DE CONSULTA LADO PACIENTE*/
    /* ============================= */

    /*Esse é o objeto que vai salvar as informacoes da nova consulta, e depois vai ser mandado pro Flask*/
    let novaConsulta = {
        data_hora: {},
        motivo: "",
        id_nutricionista: "",
        id_paciente: ""
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
                        if (validarPergunta(perguntaAtual)== false) return /* Validando se a pergunta tá preenchida corretamente*/
                        perguntaAtual += 1;
                        btnVoltar.style.display = "block"
                        controles_slider.style.justifyContent = "space-between"
                        transicaoPergunta()
                    }

            if ((perguntaAtual + 1) >= qntPerguntas){
                btnAvancar.style.display = "none"

                function resumoConsulta(){
                    const contaneirPaciente = document.createElement('div')
                    
                    const containerMedico = document.createElement('div')    
                
                    const container_resumo = document.querySelector('#resumo-consulta')

                    const botaoagendar = document.createElement('button')

                    botaoagendar.textContent = 'Confirmar consulta'
                    botaoagendar.addEventListener('click', agendarConsulta);
                    

                    container_resumo.appendChild(botaoagendar)

                    console.log(novaConsulta.data_hora); 
                    console.log(novaConsulta.id_nutricionista);

                }
                
                resumoConsulta()
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

        function validarPergunta(perguntaAtual) {
                /* Validação da pergunta de horário*/
                if (perguntaAtual === 0) {
                    const horarios = Object.values(novaConsulta.data_hora).flat();
            
                    if (horarios.length !== 1) {
                        mensagem_popup("Por favor, selecione uma data e horário válidos", "erro");
                        return false;
                    }
                    return true;
                }

                /*Validação da pergunta de nutricionista*/
                if (perguntaAtual === 1) {
                    if (!novaConsulta.id_nutricionista) {
                        mensagem_popup("Por favor, selecione um nutricionista.", "erro");
                        return false;
                    }
                    return true;
                }

                // Pergunta 2: Motivo da consulta
                if (perguntaAtual === 2) {
                    const textarea = document.querySelector("#pergunta-motivo textarea");
                    if (!textarea || !textarea.value.trim()) {
                        mensagem_popup("Por favor, insira um motivo válido.", "erro");
                        return false;
                    } else {
                        novaConsulta.motivo = textarea.value.trim();
                    }
                    return true;
                }
                return true;
            }

        }
        
    });

    /*Funcao para pegar datas e horarios disponiveis do nosso backend e listar no calendario */
    document.addEventListener('DOMContentLoaded', async () => {
        const perguntaData = document.querySelector('.slider-perguntas #pergunta-data')

        if (perguntaData){

            async function definirPacienteAtual() {
                const resposta = await fetch('/api/usuarioatual', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                
                const dadosUsuario = await resposta.json();
        
                novaConsulta.id_paciente = dadosUsuario.id;

                console.log('ID do paciente definido:', novaConsulta.id_paciente);
            }

            definirPacienteAtual()
            /*Pegando o JSON com os dias e horarios disponiveis na API do flas para definir mes atual, ano atual e os horarios disponíveis*/
            
            let dadosHorarios = {}
            let mesAtual
            let anoAtual

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
                }

                console.log(dadosHorarios, mesAtual, anoAtual)
            }
            
            await carregarHorarios();

            const diasCalendario = document.querySelectorAll('.dias-calendario .data');
            const nomeMes = document.querySelector('.nome-mes');
            const btnProximoMes = document.querySelector('.mes #avancar');
            const btnMesAnterior = document.querySelector('.mes #voltar');
            const listaHorarios = document.querySelector('.lista-horarios');
            
            
            /* Funcao para marcar os dias disponíveis no calendario e adicionar event listeners neles para chamar a funcao de listar os horarios*/    
            function configurarCalendario(dadosHorarios) {
                const nomeMeses = [
                    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
                ];

                nomeMes.textContent = `${nomeMeses[mesAtual - 1]} de ${anoAtual}`

                diasCalendario.forEach(dia => {
                    dia.classList.remove('disponivel', 'selecionado');
                    
                    const diaAtual = String(dia.textContent).padStart(2, '0');
                    const mesAtualStr = String(mesAtual).padStart(2, '0');
                    const dataString = `${anoAtual}-${mesAtualStr}-${diaAtual}`
                    
                    if (dadosHorarios[dataString]) {
                        dia.classList.add('disponivel');
                        console.log(dataString)

                        dia.addEventListener('click', (event) => {
                            
                            event.preventDefault()
                            diasCalendario.forEach(dia => dia.classList.remove('selecionado'));
                            dia.classList.add('selecionado');
                            listarhorarios(dataString);

                            novaConsulta.data_hora = {}
                            novaConsulta.data_hora[dataString] = []
                            
                            console.log(novaConsulta)
                            
                        });
                    }
                });

                btnProximoMes.onclick = (e) => {
                    e.preventDefault();
                    const datasDoProximoMes = Object.keys(dadosHorarios).filter(d => {
                        const [ano, mes] = d.split('-').map(Number);
                        return (ano > anoAtual) || (ano === anoAtual && mes > mesAtual);
                    });
                    if (datasDoProximoMes.length) {
                        const [ano, mes] = datasDoProximoMes[0].split('-').map(Number);
                        anoAtual = ano;
                        mesAtual = mes;
                        configurarCalendario(dadosHorarios);
                    }
                };
                
                btnMesAnterior.addEventListener('click', (event) => {
                event.preventDefault();
                const datas = Object.keys(dadosHorarios);
                const prevData = datas.reverse().find(d => Number(d.split('-')[1]) < mesAtual);
                if (prevData) {
                    const [ano, mes] = prevData.split('-').map(Number);
                    mesAtual = mes;
                    anoAtual = ano;
                    configurarCalendario(dadosHorarios);
                }
                });
            }
            
            configurarCalendario(dadosHorarios);
        
            /*Funcao para ficar listando os horários disponiveis de acordo com o dia selecionado no front-end*/
            function listarhorarios(dataString) {
                listaHorarios.innerHTML = '';
                
                const horarios = dadosHorarios[dataString];
            
                console.log(`Horários para ${dataString}`)
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

                    input.addEventListener('click', () => {
                        novaConsulta.data_hora[dataString] = [hora];
                        console.log('novaConsulta atualizada:', novaConsulta);
                        listarmedicos()
                    });
                });
            }

            /*Funcao para listar os medicos disponíveis para o dia e hora selecionado*/

            function listarmedicos() {
                console.log('Listando Nutricionistas');

                fetch("http://127.0.0.1:5000/api/verhorarios", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({data_hora: novaConsulta.data_hora})
                })
                .then(response => response.json())
                .then(dados => {
                    console.log("Nutricionistas disponiveis:", dados);

                    const listaMedicos = document.querySelector('.lista-medicos');
                    listaMedicos.innerHTML = '';

                    dados.forEach(medico => {
                        const li = document.createElement('li');
                        const label = document.createElement('label');
                        const input = document.createElement('input');
                        const iconenutri = document.createElement('div');
                        const descricao = document.createElement('div');
                        const nome = document.createElement('h1');

                        label.classList.add('cartao-medico');

                        iconenutri.classList.add('icone-medico');
                        iconenutri.innerHTML = '<i class="fa-solid fa-user-doctor" style="color: #63E6BE;"></i>';

                        descricao.classList.add('descricao-med');
                        nome.textContent = `${medico.nome} ${medico.sobrenome}`;
                        descricao.appendChild(nome);

                        input.type = 'radio';
                        input.name = 'medico';
                        input.value = medico.id;

                        input.addEventListener('change', () => {
                            if (input.checked) {
                                novaConsulta.id_nutricionista = medico.id;
                                console.log('Médico selecionado:', medico);
                                console.log('Nova Consulta até o momento:', novaConsulta)
                                const cartoesnutricionistas = document.querySelectorAll('.lista-medicos .li .label')

                                cartoesnutricionistas.forEach(cartao => cartao.classList.remove('selecionado'));

                                label.classList.add('selecionado')
                            }
                        });

                        label.appendChild(iconenutri);
                        label.appendChild(descricao);
                        label.appendChild(input);

                        li.appendChild(label);
                        listaMedicos.appendChild(li);
                    });
                });
            }


            const inputMotivo = document.querySelector('#pergunta-motivo textarea')
                    
            
            inputMotivo.addEventListener('input', adicionarMotivo)
            function adicionarMotivo(){
                const motivo = inputMotivo.value
            
                novaConsulta.motivo = motivo

                console.log(novaConsulta)
            }
        } 
    });

    /*Funcao para enviar a consulta em si  para o backend*/
    async function agendarConsulta(event){
        event.preventDefault()
        
        await fetch('/consulta/agendar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaConsulta)
        });

        window.location.href = '/consulta/minhasconsultas'
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
            imagem.src = "/static/imagens/icones animados/erro.gif"
            h1.textContent = "Erro!"

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
