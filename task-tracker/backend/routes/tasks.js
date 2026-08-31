const express = require("express");
const db = require("../db");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();
// app.use("/tasks", taskRoutes); em server.js, ou seja,
// as rotas abaixo na real vão ter o "/tasks" antes

router.use(requireAuth);
// toda rota abaixo dessa vai precisar de um token válido
// equivalente a colocar requireAuth como um argumento em cada roda
// individual

// GET /tasks/ -> pega todas as tasks pertencentes àquele usuário
router.get("/", (req, res) => {
    db.all(
        "SELECT * FROM tasks WHERE userId = ?",
        [req.userId],
        (err, tasks) => {
            if(err) return res.status(500).json({error: "Erro da base de dados."});

            // No frontend, ao definir o tipo em TS, faz mais sentido definir
            // o campo completed como booleano. No entanto, o SQLite não tem
            // o tipo booleano, logo:
            // vamos receber do cliente e guardar no back como um número, 0 ou 1
            // mas toda vez que respondermos o cliente, vamos converter pra booleano
            res.json(tasks.map(t => ({...t, completed: Boolean(t.completed)})));
        }
    );
});

// POST /tasks/ -> cria uma nova task pertencente àquele usuário
router.post("/", (req, res) => {
    const {title} = req.body;
    if(!title) return res.status(400).json({error: "Título é obrigatório"});

    db.run(
        "INSERT INTO tasks (title, completed, userId) VALUES (?, 0, ?)",
        [title, req.userId],
        function(err){
            if(err) return res.status(500).json({error: "Erro da base de dados."});

            res.status(201).json({id: this.lastID, title, completed: 0, userId: req.userId});
        }  
    );
});

// PUT /tasks/:id -> atualiza uma task pertencente ao usuário
router.put("/:id", (req, res) => {
    const {title, completed} = req.body;

    db.get(
        "SELECT * FROM tasks WHERE id = ? AND userId = ?",
        [req.params.id, req.userId],
        (err, task) => {
            if(err) return res.status(500).json({error: "Erro da base de dados."});
            if(!task) return res.status(404).json({error: "Task não encontrada."});

            db.run(
                "UPDATE tasks SET TITLE = ?, completed = ? WHERE  id = ?",
                [title ?? task.title, completed ?? task.completed, req.params.id],
                (err) => {
                    if(err) return res.status(500).json({error: "Erro da base de dados."});

                    res.json({
                        id: Number(req.params.id),
                        title: title ?? task.title,
                        completed: completed ?? task.completed,
                        userId: req.userId
                    });
                }
            );
        }
    );
});

// DELETE /tasks/:id
router.delete("/:id", (req, res) => {
    db.get(
        "SELECT * FROM tasks WHERE id = ? AND userId = ?",
        [req.params.id, req.userId],
        (err, task) => {
            if(err) return res.status(500).json({error: "Erro de base de dados."});
            if(!task) return res.status(404).json({error: "Task não encontrada."});

            db.run(
                "DELETE FROM tasks WHERE id = ?",
                [req.params.id],
                (err) => {
                    if(err) return res.status(500).json({error: "Erro da base de dados."});

                    res.status(204).send();
                }
            );
        }
    );
});

module.exports = router;