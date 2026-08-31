const sqlite3 = require("sqlite3").verbose();

// Abre o arquivo ./tasks.db se já existir, ou cria um se não
const db = new sqlite3.Database("./tasks.db", (err) => {
    if(err){
        console.error("Falha ao conectar à base de dados:", err.message);
    } else{
        console.log("Conetado à base de dados SQLIte.");
    }
});

// Definindo as tabelas

// O driver do SQLite roda comandos assíncronicamente por padrão, então tecnicamente
// as duas chamadas de db.run() iriam se sobrepor. serialize() força tudo dentro da função
// a rodar estritamente em ordem
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            hashedPassword TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed INTEGER NOT NULL DEFAULT 0,
            userId INTEGER NOT NULL,
            FOREIGN KEY (userId) REFERENCES users(id)
        )
    `);
});

module.exports = db;