const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const SEU_NUMERO_WHATSAPP = '5522998704541'; // ← TROQUE AQUI PELO SEU NÚMERO

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

// Páginas públicas
app.get('/', (req, res) => res.render('index'));
app.get('/trabalhos', (req, res) => res.render('trabalhos'));
app.get('/presentes-especiais', (req, res) => {
    res.render('presentes-especiais');
});
app.get('/orcamento', (req, res) => res.render('orcamento', { numeroWhatsApp: SEU_NUMERO_WHATSAPP }));
app.get('/horarios', (req, res) => res.render('horarios'));
app.get('/localizacao', (req, res) => res.render('localizacao'));

// Login
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

// Painel admin
app.get('/admin', (req, res) => {
    if (!req.session.logado) return res.redirect('/login');
    db.all('SELECT * FROM orcamentos ORDER BY data_criado DESC', (err, rows) => {
        if (err) rows = [];
        res.render('painel', { orcamentos: rows || [] });
    });
});

// Enviar orçamento
app.post('/orcamento', (req, res) => {
    const { nome, telefone, ocasiao, detalhes } = req.body;
    db.run(
        'INSERT INTO orcamentos (nome, telefone, ocasiao, detalhes) VALUES (?, ?, ?, ?)',
        [nome, telefone, ocasiao, detalhes],
        function (err) {
            if (err) console.error(err);
            res.render('sucesso', { nome, numeroWhatsApp: SEU_NUMERO_WHATSAPP });
        }
    );
});

// Excluir um orçamento específico
app.get('/excluir-orcamento/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM orcamentos WHERE id = ?`, [id], (err) => {
        if (err) console.log('Erro ao excluir:', err.message);
        res.redirect('/admin');
    });
});

app.listen(PORT, () => {
    console.log(`✅ Servidor rodando!`);
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
    console.log(`🔐 Painel: http://localhost:${PORT}/login`);
});