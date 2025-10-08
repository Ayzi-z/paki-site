from flask import Flask, render_template, redirect


app = Flask(__name__)
app.config['SECRET_KEY'] = 'SENHAMTSEGURA123'




@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')
    email = request.form.get('email')


@app.route('/cadastro')
def cadastro():
    return render_template('cadastro.html')


if __name__ == '__main__':
    app.run(debug=True)
