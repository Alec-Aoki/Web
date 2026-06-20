import express from 'express';
import routes from './routes/pocao.routes.js';
import seedDatabase from './seed.js';
import sequelize from './models/dbconfig.js';
import cors from 'cors';

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(routes);

async function start(){
    await sequelize.sync();

    await seedDatabase();

    app.listen(3000, () => console.log('Servidor iniciado'));
}

start();