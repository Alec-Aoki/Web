require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./db"); // Já roda a conexão e setup das tabelas

const authRoutes = require("./routes/auth");
const taskRoutes= require("./routes/tasks");

const app  = express();

app.use(cors());
app.use(express.json()); // Pra parsear automaticamente o JSON do req.body

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
});

