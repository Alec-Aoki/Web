import model from '../models/pocao.model.js';

// GET /pocoes
// Retorna todas as poções
async function getAll(request, response){
    const pocoes = await model.findAll();
    response.send(pocoes);
}

// POST /pocoes
// Cria uma nova poção
async function create(request, response){
    const resultado = await model.create(request.body);
    response.status(201).send(resultado); // 201: criado
}

// DELETE /pocoes/:slugNome
// Deleta uma poção
async function remove(request, response){
    await model.destroy({where: {slugNome: request.params.slugNome}});
    response.status(204).send();
}

export default {getAll, create, remove};