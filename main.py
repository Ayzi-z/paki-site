from flask import Flask, render_template, request, jsonify, redirect, url_for

from flask_sqlalchemy import SQLAlchemy

from flask_login import LoginManager, UserMixin, login_user,login_required,logout_user, current_user

from livereload import Server

from datetime import datetime, date, timedelta, time

app = Flask(__name__)

app.secret_key = 'admin'

# COLOCANDO O GERENCIADOR DE LOGIN NO SITE
lm = LoginManager(app)

# ISSO AQUI FAZ COM QUE QUANDO O USUARIO TENTA ACESSAR UMA PAGINA PROTEGIDA E NAO TÁ LOGADO, ELE VAI SEMPRE SER REDIRECIONADO PRA PAGINA DE LOGIN
lm.login_view = 'login'

# CRIANDO UMA FUNCAO PARA CARREGAR OS DADOS DO USUARIO QUANDO ELE TÁ LOGADO NO LOGIN MANAGER
@lm.user_loader
def carregar_usuario(id):
    usuario = banco.session.query(Usuario).filter_by(id=id).first()

    return usuario

# INICIANDO O BANCO DE DADOS E O FLASK-LOGIN 

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///banco.db'

banco = SQLAlchemy()
banco.init_app(app)


# Criando as tabelas do banco de dados e definindo como uma classe do python para poder usar depois no código
class Usuario(UserMixin, banco.Model):
    __tablename__ = 'usuarios' # isso cria a tabela de usuario e o que tem para baixo são os atributos

    id = banco.Column(banco.Integer, primary_key=True, autoincrement=True, unique=True)

    email = banco.Column(banco.String(120), unique=True)
    
    senha = banco.Column(banco.String())

    nome = banco.Column(banco.String(25))

    sobrenome = banco.Column(banco.String(25))
    
    tipo = banco.Column(banco.String(10), nullable=False)  

    data_nascimento = banco.Column(banco.Date, nullable=False)

    telefone = banco.Column(banco.String(20))

    genero = banco.Column(banco.String(15))

    codigo_ativacao = banco.Column(banco.String(10), nullable=True)

    
class Consulta(banco.Model):
    __tablename__ = 'consultas'
    
    id = banco.Column(banco.Integer, primary_key=True, autoincrement=True, unique=True)
    
    id_paciente = banco.Column(banco.Integer, banco.ForeignKey('usuarios.id'))
    
    id_nutricionista = banco.Column(banco.Integer, banco.ForeignKey('usuarios.id'))
    
    status = banco.Column(banco.String(20), nullable=False, default='pendente')

    data_hora = banco.Column(banco.DateTime, nullable=False)

    motivo = banco.Column(banco.String)

class Escala(banco.Model):
    __tablename__ = 'escalas_nutricionistas'
    
    id = banco.Column(banco.Integer, primary_key=True)

    dias_trabalho = banco.Column(banco.JSON, nullable=False)

    nutricionista_id = banco.Column(banco.Integer, banco.ForeignKey('usuarios.id'))


# Funcao para criar um usuario admin padrao no site
def criar_admin():
    with app.app_context():
        if not Usuario.query.filter_by(email='adminsdopaki@admin.com', tipo='admin', senha = 'admin123').first():
            
            usuario_admin = Usuario(
                email='adminsdopaki@admin.com',
                senha='admin123',
                nome='Admin',
                sobrenome='Geral',
                tipo='admin',
                data_nascimento=date(1, 1, 1),
                genero=None,
                codigo_ativacao=None
            )

            banco.session.add(usuario_admin)
            banco.session.commit()

            print(f'Usuario admin criado com sucesso! \n Email: {usuario_admin.email} \n Senha: {usuario_admin.senha}')

# Funcao para criar um usuario nutricionista padrao no site

def criar_nutricionista():
    with app.app_context():
        if not Usuario.query.filter_by(email='nutricionista@gmail.com', tipo='nutricionista', senha='nutri123').first():
            
            usuario_nutricionista = Usuario(
                email='nutricionista@gmail.com',
                senha='nutri123',
                nome='Nutricionista',
                sobrenome='Geral',
                tipo='nutricionista',
                data_nascimento=date(1, 1, 1),
                genero=None,
                codigo_ativacao=None
            )

            banco.session.add(usuario_nutricionista)
            banco.session.commit()

  
            dias_trabalho = ["terca", "quarta", "quinta", "sexta"]

            escala_padrao = Escala(
                nutricionista_id=usuario_nutricionista.id,
                dias_trabalho=dias_trabalho 
            )

            banco.session.add(escala_padrao)
            banco.session.commit()

            print(f'''
                Usuário nutricionista criado com sucesso!
                Email: {usuario_nutricionista.email}
                Senha: {usuario_nutricionista.senha}
                Escala criada: {dias_trabalho}
            ''')

# Adicionando uma funcao global para dizer qual o tipo de site que tá sendo carregado lá pro Jinja 
@app.context_processor
def tipo_site():
    if current_user.is_authenticated:
        return {'tipo_site': current_user.tipo}
    return {'tipo_site': 'anonimo'}

# ROTAS GERAIS DO NOSSO SITE
@app.route("/")
@login_required
def index():
    print(f"o usuario {current_user.nome} do tipo {current_user.tipo} está usando o P.A.K.I!")
    return render_template('index.html')

@app.route("/sobre")
@login_required
def sobre():
    return render_template('sobre.html')


@app.route("/sobremim")
@login_required
def sobremim():
    return render_template('sobre-usuario.html')

@app.route("/contato")
@login_required
def contato():
    return render_template('contato.html')

# ROTAS DE LOGIN, LOGOUT E CADASTRO
@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'GET':
        return render_template('cadastro.html')

    elif request.method == 'POST':
        
        nome = request.form['nome'].lower().strip()
       
        sobrenome = request.form['sobrenome'].lower().strip()
        
        email = request.form['email'].lower().strip()
        
        senha = request.form['senha']
       
        tipo = request.form['tipo-usuario'].lower().strip()
        
        data_nascimento = datetime.strptime(request.form['data_nascimento'], "%Y-%m-%d").date()
        
        telefone = request.form['telefone'].strip()
        
        genero = request.form['genero'].lower().strip()
       
        # Verificando se o usuário já existe
        if Usuario.query.filter_by(email=email).first():
            return redirect(url_for('cadastro'))
        
        novo_usuario = Usuario(
            email=email,
            senha=senha,
            nome=nome,
            sobrenome=sobrenome,
            tipo=tipo,
            data_nascimento=data_nascimento,
            telefone=telefone,
            genero=genero
        )

        banco.session.add(novo_usuario)
        banco.session.commit()
               
        if tipo == 'nutricionista': # Se a conta for do tipo nutricionista adiciona o codigo e escala
            
            codigo_ativacao = request.form['codigo_ativacao'].strip()
            novo_usuario.codigo_ativacao = codigo_ativacao

            dias_trabalho = request.form.getlist('dias_trabalho')
            nova_escala = Escala(
                nutricionista_id=novo_usuario.id,
                dias_trabalho=dias_trabalho
            )
            banco.session.add(nova_escala)
            banco.session.commit() 

        login_user(novo_usuario)
        
        return redirect(url_for('index'))

@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        if current_user.is_anonymous: #Vendo se o usuario nao está logado
            return render_template('login.html')
        else : #Se ele ja estiver logado, redireciona para a pagina inicial
            return redirect(url_for('index'))
    
    elif request.method == 'POST':
        email = request.form['email']
        senha = request.form['senha']

        usuario = banco.session.query(Usuario).filter_by(email=email, senha=senha).first()

        if usuario: #Se o usuario existir faz o login no site
            login_user(usuario)
            return redirect(url_for('index'))

        else: #Se nao apenas redireciona para o login de novo
            return redirect(url_for('login'))

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route("/recuperarSenha")
def recuperarSenha():
    return render_template('recuperar_senha.html')

# ROTAS DAS FUNCIONALIDADES DO SITE

@app.route("/funcionalidades", methods=['GET'])

def funcionalidades():
    return render_template('funcionalidades.html')

@app.route("/consulta")
def consulta():
    return render_template('consulta.html')

@app.route("/consulta/minhasconsultas")
def minhas_consultas():
    return render_template('func-minha-consulta.html')

@app.route("/consulta/agendar", methods = ['GET', 'POST'])
def agendar_consulta():
    if request.method == 'GET':
        return render_template('func-agendar-consulta.html')
    elif request.method == 'POST':
        dados = request.get_json()

        data_hora = dados.get('data_hora')
        
        motivo = dados.get('motivo')

        id_nutricionista = int(dados.get('id_nutricionista'))
        
        id_paciente = int(dados.get('id_paciente'))


        data_hora_dicio = dados.get('data_hora')
        dia_str, horarios = list(data_hora_dicio.items())[0]
        horario_str = horarios[0]
        hora, minuto = map(int, horario_str.split(':'))
        data_hora = datetime.combine(datetime.strptime(dia_str, "%Y-%m-%d").date(), time(hora, minuto))



        consulta_existente = Consulta.query.filter_by(
            id_nutricionista=id_nutricionista,
            data_hora=data_hora
        ).first()

        if consulta_existente:
            return jsonify({"erro": "Horário já ocupado"})

        nova_consulta = Consulta(
            id_paciente=id_paciente,
            id_nutricionista=id_nutricionista,
            data_hora=data_hora,
            motivo=motivo,
            status='pendente'
        )
        banco.session.add(nova_consulta)
        banco.session.commit()

        return redirect(url_for('minhas_consultas'))

@app.route("/gerenciarusuarios")
@login_required
def gerenciarusuarios():

    return render_template('func-gerenciar-usuarios.html') 


@app.route("/loja")
def loja():
    return render_template('loja.html')

@app.route("/lojaCarrinho")
def lojaCarrinho():
    return render_template('loja-carrinho.html')

@app.route("/detalheProduto")
def detalheProduto():
    return render_template('loja-detalhe-produto.html')

@app.route("/detalheProduto2")
def detalheProduto2():
    return render_template('loja-detalhe-produto2.html')

# MINI APIS DO NOSSO SITE PARA FAZER BUSCAR DADOS NO SERVIDOR DO FLASK

# Mini api que a gente usa para validar dados de cadastro
@app.route('/validarcadastro', methods=['POST'])
def validarcadastro():
    dados = request.get_json()
    if not dados or 'email' not in dados:
        return jsonify({"erro": "Email não fornecido!"})

    email = dados['email']
    
    #Vendo se o e-mail existe ou não no banco de dados
    if  Usuario.query.filter_by(email=email).first():
        return jsonify({"email": True})
    else:
        return jsonify({"email": False})

# Mini api que a gente usa para retornar os dias e horarios disponiveis para consulta nos 14 dias, e os nutricionistas disponiveis para um dia e hora específico
@app.route('/api/verhorarios', methods=['GET', 'POST'])
def apihorarios():
    def verhorarios(qnt_dias = 14):  
        hoje = datetime.now().date()
        horarios_disponiveis = {}
        print(f'Hoje é {hoje}')

        nutricionistas = Usuario.query.filter_by(tipo='nutricionista').all()

        for contador in range(qnt_dias):
            dia = hoje + timedelta(days=contador)
            nome_dia = ["segunda", "terca", "quarta", "quinta", "sexta", "sábado", "domingo"][dia.weekday()]

            if dia.weekday() < 5: # fazendo escala de segunda a sexta
                dia_str = dia.strftime('%Y-%m-%d')

                # Colocando a hora que a clinica abre e a hora que ela fecha no dia
                abre = datetime.combine(dia, time(7, 0))
                fecha = datetime.combine(dia, time(21, 0))

                while abre <= fecha - timedelta(hours=1, minutes=15):
                    if abre > datetime.now():
                        for nutricionista in nutricionistas:
                            escala_nutri = Escala.query.filter_by(nutricionista_id=nutricionista.id).first()
                            if escala_nutri and nome_dia in escala_nutri.dias_trabalho:
                                dia_ocupado = Consulta.query.filter_by(
                                    id_nutricionista = nutricionista.id,
                                    data_hora = abre
                                ).first()
                                if not dia_ocupado:

                                    horarios_disponiveis.setdefault(dia_str, []).append(abre.strftime("%H:%M"))
                                    break
                    abre += timedelta(hours = 1, minutes = 15)
        return horarios_disponiveis

    def vernutricionistas(dados):
        if not dados or 'data_hora' not in dados:
            return []

        # pegando a primeira data e horário enviados
        dia_str, horarios = list(dados['data_hora'].items())[0]
        horario_str = horarios[0]

        dia = datetime.strptime(dia_str, "%Y-%m-%d").date()
        hora, minuto = map(int, horario_str.split(':'))
        dt = datetime.combine(dia, time(hora, minuto))

        nome_dia = ["segunda", "terca", "quarta", "quinta", "sexta", "sábado", "domingo"][dia.weekday()]

        nutricionistas = Usuario.query.filter_by(tipo='nutricionista').all()
        disponiveis = []

        for nutricionista in nutricionistas:
            escala = Escala.query.filter_by(nutricionista_id=nutricionista.id).first()
            if escala and nome_dia in escala.dias_trabalho:
                consulta_ocupada = Consulta.query.filter_by(
                    id_nutricionista=nutricionista.id,
                    data_hora=dt
                ).first()
                if not consulta_ocupada:
                    disponiveis.append({
                        "id": nutricionista.id,
                        "nome": nutricionista.nome,
                        "sobrenome": nutricionista.sobrenome
                    })
        return disponiveis

    if request.method == 'GET':
        return jsonify(verhorarios())
        
    elif request.method == 'POST':
        dados = request.get_json()
        return jsonify(vernutricionistas(dados))

# Mini api para buscar as cosnsultas pelo id do usuário
@app.route('/api/consulta/minhasconsultas/<int:id_usuario>', methods=['GET'])
def apiminhasconsultas(id_usuario):
    consultas = Consulta.query.order_by(Consulta.data_hora.desc()).all()

    listaConsultas = []

    for c in consultas:
        
        if c.id_paciente == id_usuario or c.id_nutricionista == id_usuario:
            listaConsultas.append({
                "id": c.id,
                "id_paciente": c.id_paciente,
                "id_nutricionista": c.id_nutricionista,
                "status": c.status,
                "data_hora": c.data_hora.strftime("%Y-%m-%d %H:%M"),
                "motivo": c.motivo
            })

    return jsonify(listaConsultas)

# Mini api que a gente usa para ver os dados do usuario que tá logado
@app.route('/api/usuarioatual')
@login_required 
def usuarioatual():
    return jsonify({
        "id": current_user.id,
        "email": current_user.email,
        "nome": current_user.nome,
        "sobrenome": current_user.sobrenome,
        "tipo": current_user.tipo
    })

# Mini api para retornar dados dos usuários do sistema em json
@app.route("/api/gerenciarusuarios", methods = ['GET'])
@login_required
def gerenciarusuariosapi():
    if current_user.tipo == 'admin':
        tabelaUsuarios = Usuario.query.all()
        usuarios = []
        for usuario in tabelaUsuarios:
            usuarios.append({
                "id": usuario.id,
                "email": usuario.email,
                "tipo": usuario.tipo,
                "nome": usuario.nome,
                "sobrenome": usuario.sobrenome
            })
        return jsonify(usuarios)

@app.route("/api/usuario/<int:id_usuario>", methods=['GET'])
@login_required
def gerenciarusuariosapi_id(id_usuario):

    usuario = Usuario.query.get(id_usuario)
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado"})

    dados_usuario = {
        "id": usuario.id,
        "email": usuario.email,
        "nome": usuario.nome,
        "sobrenome": usuario.sobrenome,
        "tipo": usuario.tipo,
        "data_nascimento": usuario.data_nascimento.strftime("%Y-%m-%d") if usuario.data_nascimento else None,
        "telefone": usuario.telefone,
        "genero": usuario.genero,
        "codigo_ativacao": usuario.codigo_ativacao,
    }

    return jsonify(dados_usuario)


# CODIGOS PARA RODAR O SERVIDOR DO FLASK

if __name__ == '__main__':
    with app.app_context(): # isso aqui cria o banco de dados
        banco.create_all()
        criar_admin() # isso aqui cria o usuario admin sempre que o servidor for iniciado caso ele nao exista
        criar_nutricionista()

        app.debug = True # isso aqui ativa o modo debug do flask

    server = Server(app.wsgi_app) # isso aqui atualiza automaticamente o servidor quandoa gente altera algo nele
    server.watch('templates/')
    server.watch('static/')
    server.serve(port=5000, host="127.0.0.1", debug=True)