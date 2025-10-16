from flask import Flask, render_template

app = Flask(__name__)

#Rotas Gerais Do Site
@app.route("/")
def index():  
    return render_template('index.html')

@app.route("/sobre")
def sobre():
    return render_template('sobre.html')

@app.route("/sobreUsuario")
def sobreUsuario():
    return'teu nome é tolete'

@app.route("/funcionalidades")
def funcionalidades():
    return render_template('funcionalidades.html')

@app.route("/login")
def login():
    return render_template('login.html')

@app.route("/cadastro")
def cadastro():
    return render_template('cadastro.html')

@app.route("/contato")
def contato():
    return render_template('contato.html')

@app.route("/recuperarSenha")
def recuperarSenha():  
    return render_template('recuperar_senha.html')

# Rotas das funcionalidades 
@app.route("/agendaconsulta")
def agendaconsulta():
    return render_template('agendaconsulta.html')

@app.route("/agendarConsulta")
def agendarConsulta():
    return render_template('func-agendar-consulta.html')

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

if __name__ == '__main__':
    app.run(debug=True)