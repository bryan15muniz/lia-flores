const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const SEU_NUMERO_WHATSAPP = '5522992044992';

db.run(`CREATE TABLE IF NOT EXISTS orcamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    ocasiao TEXT,
    presente TEXT,
    tipoEntrega TEXT,
    endereco TEXT,
    tamanhoBuque TEXT,
    estiloBuque TEXT,
    detalhes TEXT,
    data_criado DATETIME DEFAULT CURRENT_TIMESTAMP,
    respondido INTEGER DEFAULT 0
)`);

app.use(session({
    secret: 'liaflores2026segredo',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.render('index'));
app.get('/trabalhos', (req, res) => res.render('trabalhos'));
app.get('/presentes-especiais', (req, res) => res.render('presentes-especiais'));
app.get('/orcamento', (req, res) => res.render('orcamento'));
app.get('/horarios', (req, res) => res.render('horarios'));
app.get('/localizacao', (req, res) => res.render('localizacao'));

app.get('/login', (req, res) => res.render('login', { erro: null }));
app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;
    if (usuario === 'admin' && senha === 'flores2026') {
        req.session.logado = true;
        res.redirect('/admin');
    } else {
        res.render('login', { erro: 'Usuário ou senha incorretos!' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/admin', (req, res) => {
    if (!req.session.logado) return res.redirect('/login');
    db.all('SELECT * FROM orcamentos ORDER BY data_criado DESC', (err, rows) => {
        if (err) rows = [];
        res.render('painel', { orcamentos: rows || [] });
    });
});

app.post('/orcamento', (req, res) => {
    const { nome, telefone, ocasiao, presente, tipoEntrega, endereco, tamanhoBuque, estiloBuque, detalhes } = req.body;

    db.run(
        `INSERT INTO orcamentos 
        (nome, telefone, ocasiao, presente, tipoEntrega, endereco, tamanhoBuque, estiloBuque, detalhes, data_criado) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [nome, telefone, ocasiao, presente, tipoEntrega, endereco, tamanhoBuque, estiloBuque, detalhes, new Date()],
        function (err) {
            if (err) console.error(err);

            let mensagem = `💐 Orçamento - Lia Flores

👤 Nome: ${nome}

📱 Telefone: ${telefone}`;

            if (ocasiao) mensagem += `

🎉 Ocasião: ${ocasiao}`;
            if (presente) mensagem += `

🎁 Presente: ${presente}`;
            if (tamanhoBuque) mensagem += `

💐 Tamanho do buquê: ${tamanhoBuque}`;
            if (estiloBuque) mensagem += `

💐 Estilo do buquê: ${estiloBuque}`;

            mensagem += `

🚚 ${tipoEntrega === 'entrega' ? 'Entrega em domicílio' : 'Retirada na loja'}`;

            if (tipoEntrega === 'entrega' && endereco) mensagem += `

🏠 Endereço: ${endereco}`;

            mensagem += `

📝 Detalhes: ${detalhes || 'Nenhum'}`;

            res.redirect(`https://wa.me/${SEU_NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`);
        }
    );
});

app.get('/excluir-orcamento/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM orcamentos WHERE id = ?`, [id], (err) => {
        if (err) console.log('Erro:', err.message);
        res.redirect('/admin');
    });
});

app.listen(PORT, () => {
    console.log('=========================================');
    console.log('✅ Servidor rodando!');
    console.log('🌐 SITE:   http://localhost:' + PORT);
    console.log('🔐 PAINEL: http://localhost:' + PORT + '/admin');
    console.log('=========================================');
});