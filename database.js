const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'lia_flores.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('❌ Erro ao conectar:', err.message);
    else console.log('✅ Banco conectado!');
});

db.run(`
  CREATE TABLE IF NOT EXISTS orcamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    ocasiao TEXT,
    detalhes TEXT,
    data_criado DATETIME DEFAULT CURRENT_TIMESTAMP,
    respondido INTEGER DEFAULT 0
  )
`);

module.exports = db;