const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

// app.use("/auth", authRoutes); em server.js, ou seja,
// as rotas abaixo na real vão ter o "/auth" antes

// POST /auth/register
router.post("/register", async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({error: "Email e senha são obrigatórios."});
    }

    try{
        const hashedPassword = await bcrypt.hash(password, 10);

        // db.run(sql, params, callback) é o padrão do sqlite3 pra INSERT/UPDATE/DELETE
        // ? é um placeholder no SQL que é preenchido por params, em ordem
        // IMPORTANTE: nunca inserir email/senha diretamente na string SQL via template literals,
        // pois abre vulnerabilidade de SQL injection
        // queries parametrizadas com ? e params é o jeito certo, pois o driver trata o valor como
        // dado puro, não como SQL executável

        db.run(
            "INSERT INTO users (email, hashedPassword) VALUES (?, ?)",
            [email, hashedPassword],
            function(err){

                // não é uma arrow function de propósito
                // o driver do sqlite3 depende do this dentro da callback se referir ao
                // statement que acabou de rodar, então this.lastID retorna o id auto-
                // incrementado da linha  que acabamos de inserir

                if(err){
                    if(err.message.includes("UNIQUE")){
                        return res.status(409).json({error: "Email já registrado."}); // 409 Conflict
                    }

                    return res.status(500).json({error: "Erro da base de dados."});
                }

                res.status(201).json({id: this.lastID, email});
            }
        );
    } catch(err){
        res.status(500).json({error: "Falha ao fazer hash da senha."});
    }
});

// POST /auth/login
router.post("/login", (req, res) => {
    const {email, password} = req.body;

    // db.get(sql, params, callback) é que nem o db.run, mmas pra queries SELECT
    // que esperam uma única linha de volta (db.all pra múltiplas linhas)

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, user) => {
            if(err) return res.status(500).json({error: "Erro da base de dados."});
            if(!user) return res.status(401).json({error: "Credenciais inválidas."});

            const isMatch = await bcrypt.compare(password, user.hashedPassword);
            if(!isMatch) return res.status(401).json({error: "Credenciais inválidas."});

            const token = jwt.sign(
                {userId: user.id, email: user.email},
                process.env.JWT_SECRET,
                {expiresIn: "1h"}  
            );

            res.json({token});
        }
    );
});

module.exports = router;