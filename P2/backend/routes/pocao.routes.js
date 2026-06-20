import express from 'express';
import controllerPocoes from '../controllers/pocao.controller.js';

const routes = express.Router();

// GET /pocoes
routes.get('/pocoes', controllerPocoes.getAll);

// POST /pocoes
routes.post('/pocoes', controllerPocoes.create);

// DELETE /pocoes/:slugNome
routes.delete('/pocoes/:slugNome/', controllerPocoes.remove);

export default routes;