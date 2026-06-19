# API Rest e Integração com o Banco
https://blog.logrocket.com/crud-rest-api-node-js-express-postgresql/

## Mapeamento Objeto-Relacional (ORM)
Técnica de programação que permite relacionar objetos com dados em um banco de dados, sem precisar se preocupar com a escrita de código SQL. A forma que o mapeamento é configurado depende da ferramenta, sendo a mais comum a **Sequelize** para bancos relacionais. Para não-relacionais (MongoDB), temos o Mongoose.

### Ambiente
Para usar o Sequelize, precisamos baixar o seu módulo e o módulo do banco utilizado. 

```bash
npm install express
npm install sequelize
npm install pg # Driver p/ o Node falar c/ o Postgre
npm install cors # Permite que a API seja acessada por diferentes domínios
```

### Configuração da Conexão (PostgreSQL)
Para que o Sequelize se comunique com o banco de dados, precisamos criar um arquivo central de configuração, geralmente `models/dbconfig.js`. Essa config. varia dependendo de onde o banco está hospedado.

Antes de conectar via código, o BD e o usuário devem existir. No caso de um banco local, fazemos os seguintes comandos SQL no terminal:

```bash
# Usuário devweb com senha 123456
CREATE ROLE devweb WITH LOGIN PASSWORD '123456';
ALTER ROLE devweb CREATEDB;

# Cria o banco devapi sndo o dono o usuário criado
CREATE DATABASE devapi;
```

### Segurança com Variáveis de Ambiente `.env`
Utilizar o módulo `dotenv` para ler um arquivo `.env` na raíz do projeto.

Exemplo de um arquivo .env:

```
DB_NAME = devapi
DB_USER = devweb
DB_PASSWORD = 123456
DB_HOST = localhost
```

### Implementação da Conexão `dbconfig.js`
#### Conexão com Banco Local (Sequelize)
```js
// models/dbconfig.js
import Sequelize from 'sequelize';
import dotenv from 'dotenv';

// Lê o arquivo .env e popula process.env com as variáveis definidas lá
// DEVE ser chamado antes de acessar qualquer process.env
dotenv.config();

// Lê cada variável de ambiente
// Se o .env não existir ou a variável não estiver definida, o valor será undefined
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;

// Cria a instância de conexão com o banco
// Sequelize(banco, usuário, senha, opções)
const sequelize = new Sequelize(
    dbName,
    dbUser,
    dbPassword,
    {
        dialect: 'postgres', // Qual banco estamos usando
        host: dbHost // Endereço do servidor (localhost p/ banco local)
    }
);

// Exporta a conexão pra ser reutilizada em todos os models
export default sequelize;
```

#### Conexão com Banco Serverless
Bancos na nuvem exigem configurações extras de segurança (SSL) para permitir a conexão.

- `ssl:require`: obriga que a conexão seja criptografada;
- `rejectUnauthorized`: definido como `false` para aceitar certificados de provedores serverless comuns.

```js
// models/dbconfig.js
import {Sequelize, Model, DataTypes} from 'sequelize';

// Variáveis de ambiente injetadas automaticamente pelo provedor cloud
const PGHOST = process.env['PGHOST'];
const PGUSER = process.env['PGUSER'];
const PGDATABASE = process.env['PGDATABASE'];
const PGPASSWORD = process.env['PGPASSWORD'];

// Variáveis vindas do ambiente cloud
const sequelize = new Sequelize(
    process.env.PGDATABASE,
    process.env.PGUSER,
    process.env.PGPASSWORD,
    {
        dialect: 'postgres',
        host: process.env.PGHOST,
        port: 5432, // Porta padrão do postgre
        dialectOptions: { // Config. específicas do driver do banco
            ssl: {
                require: true, // Exige conexão criptografada (obrigatório em cloud)
                rejectUnauthorized: false // Aceita certificados autoassinados de provedores cloud
            }
        }
    }
);

export default sequelize;
```

### Criação de Modelos (Models)
O Model é a peça do MVC responsável por conversar com o banco de dados. No Sequelize, ele mapeia o código para as tabelas automaticamente por meio de configurações específicas.
- **Definição**: Podemos definir um modelo estendendo a classe `Model` e usando o método `init`, ou através do método `sequelize.define`;
- **Tipos de Dados**: Utilizamos `DataTypes` para especificar o tipo de cada coluna;
- **Atributos Importantes**:
  - `primaryKey: true`: Define a chave primária da tabela;
  - `autoIncrement: true`: Garante que o ID cresça automaticamente;
  - `allowNull: false`: Torna o campo obrigatório;
  - `timestamps: false`: Desativa a criação automática das colunas `createdAt` e `updatedAt`.

Existem muitas formas de definir o modelo.

```js
// models/client.model.js
import {Model, DataTypes} from 'sequelize';
import sequelize from './dbconfig.js'; // Reutilizando conexão configurada

// Estende a classe Model do Sequelize, dando acesso a findAll, create etc.
// O corpo fica vazio, a configuração real vem do .init()
class Client extends Model {};

// .init() define as colunas da tabela e suas regras
Client.init({
    // Primeiro argumento: definição das colunas
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    document: {
        type: DataTypes.STRING,
        allowNull: false
    }},
    { // Opções do modelo
        sequelize: sequelize, // Qual conexão usar (importada acima)
        timestamps: false // Desativa createdAt e updatedAt
    }
);

export default Client;
```

Alternativa:

```js
// models/client.model.js
import {Model, DataTypes} from 'sequelize';
import sequelize from './dbconfig.js';

const Client = sequelize.define(
    // Nome do modelo
    'Client', // Sequelize vai criar/usar a tabela Clients (pluraliza automaticamente)
    {
        id: {
           type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true, 
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false            
        },
        document: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: sequelize,
        timestamps: false
    }
);
```

### Testando o Modelo
```js
// dbsync.js
// Script de teste, não faz parte da estrutura MVC
import Client from './models/client.model.js'

// .sync() cria a tabela no banco se ela não existir
// OBS: usar {force: true} só em dev, pois apaga e recria a tabela
await Client.sync();

// .create() insere um novo registro no banco
// Recebe um objeto com os campos definidos no model
await Client.create({
    name: 'Endeavor',
    document: '2002.002.002-2'
});

// .findAll() busca todos os registros
// Retorna uma promise com um array de instâncias do model
await Client.findAll().then(
    function(res){
        for(let r of res){
            // .dataValues contém os valores brutos do banco
            // O sequelize adiciona métodos e metadados ao objeto, então
            // acessar diretamente .dataValues dá só os dados
            console.log(r.dataValues);
        }
    }
);
```

**OBS**: as chamadas ao banco são assíncronas!!!

#### Revisão Operações Assíncronas (Promises e Await)
Todas as chamadas de banco são assíncronas. Isso significa que o JavaScript não espera a resposta do banco para seguir para a próxima linha, a menos que ferramentas específicas sejam utilizadas:
- **Promises**: Objetos que representam o sucesso ou falha da operação, permitindo o uso de `.then()` para o resultado positivo e `.catch` para erros;
- **Await**: Um operador usado dentro de funções `async` para pausar a execução até que a promessa seja cumprida, tornando o código mais legível;
- **Sincronização**: O comando `Model.sync()` é o que efetivamente cria a tabela no banco de dados com base na definição no código.

### Controller
O Controller faz a ponte entre as rotas (HTTP) e o Model. Ele recebe os objetos `request` (o que o usuário mandou) e `response` (o que será devolvido ao usuário).

| Operação | Método Sequelize | Descrição no Controller |
| - | - | - |
| Listar tudo | `findAll()` | Busca todos os registros e retorna via `response.json()` |
| Buscar por ID | `findByPk(id)` | Localiza um registro específico usando a chave primária vinda de `request.params.id` |
| Criar | `create(dados)` | Insere novos dados baseados no corpo da requisição (`request.body`) |
| Atualizar | `update(dados, {where})` | Modifica registros existentes que atendam o critério do ID |
| Deletar | `destroy({where})` | Remove o registro e permite validar se a exclusão ocorreu (retorna 1 caso sucesso) |

```js
// controllers/client.controler.js
import model from '../models/client.model.js'

// GET /clients
// Retorna todos os clientes
function findAll(request, response){
    // model.findAll() retorna uma promise
    // .then() recebe o array de resultados quando oo banco responder
    model.findAll().then(
        function(results){
            // response.json() converte o array para json e envia com Content-Type correto,
            // melhor que response.send() para dados estruturados
            response.json(results).status(200);
        }
    ).catch(
        function(e){
            // Qualquer erro de banco cai aqui
            console.log(e);
        }
    );
}

// GET /clients/:id
// Retorna um cliente pelo ID
function findByPk(request, response){
    // findByPk é + semântico q findById
    model.findByPk(request.params.id).then(
        function(result){
            // Result será null se não encontrar
            response.json(result).status(200);
        }
    ).catch(
        function(e){
            console.log(e);
        }
    );
}

// POST /clients
// Cria um novo cliente
function create(request, response){
    model.create({
        // Pega os valores do corpo da requisição e passa para o sequelize
        // O sequelize cuida do INSERT INTO automaticamente
        name: request.body.name,
        document: request.body.document
    }).then(
        function(result){
            // 201: created
            // result contém o objeto criado, já com o id gerado pelo banco
            response.status(201).json(result);
        }
    ).catch(
        function(e){
            console.log(e);
        }
    );
}

// PUT /clients/:id
// Atualiza um cliente existente
function update(request, response){
    model.update(
        // Novos valores (apenas os campos a serem atualizados)
        {
            name: request.body.name,
            document: request.body.document
        },
        // Condição WHERE (qual registro utilizar)
        {
            where: {
                id: request.params.id // Atualiza só o cliente com esse id
            }
        }
    ).then(
        function(result){
            // .update() retorna um array [numeroDeLinhasAfetadas]
            // Se result == 1, um registro foi alterado (sucesso)
            // Se result == 0, nenhum registro com esse id existia (404)
            if(result == 1){
                response.status(200).send(); // 200 ok sem body
            } else {
                response.status(404).send(); // 404 not found
            }
        }
    ).catch(
        function(e){
            console.log(e);
        }
    );
}

// DELETE /clients/:id
// Remove um cliente
function deleteByPk(request, response){
    model.destroy(
        {
            where: {
                id: request.params.id // Deleta só o registro com esse id
            }
        }
    ).then(
        function(result){
            // .destroy() retorna o número de linhas deletadas
            // 1 = deletado com sucesso
            // 0 = não encontrado
            if(result == 1){
                response.status(200).send();
            } else {
                response.status(404).send();
            }
        }
    ).catch(
        function(e){
            console.log(e);
        }
    );
}

export default {findAll, findByPk, create, update, deleteByPk};
```

### Associações (Relacionamentos)
O Sequelize suporta as relações clássicas de banco de dados relacionais, ou seja, **Um-Para-Um**, **Um-Para-Muitos** e **Muitos-Para-Muitos**. Isso é feito com 4 comandos:
- `HasOne()`;
- `BelongsTo()`: muitos-para-um;
- `HasMany()`: um-para-muitos;
- `BelongsToMany()`.

O Sequelize cria automaticamente campos como ClientId, mas é possível personalizar o nome usando a opção `foreignKey`.

**Eager Loading (Include)**: ao fazer uma busca, podemos usar `{include: client}` para trazer dados do dono da mesma consulta.

```js
// models/pet.model.js
import {Model, DataTypes} from 'sequelize';
import sequelize from './dbconfig.js';
import Client from './client.model.js'; // Importa o Model de Client pra definir a relação

class Pet extends Model {}
Pet.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    breed: {
        type: DataTypes.STRING
        // allowNull implicitamente true
    },
    birth: {
        type: DataTypes.STRING
    }},
    {
        sequelize: sequelize,
        timestamps: false
    }
);

// Define o relacionamento (pet pertence a client, N:1)
// Também adiciona a coluna ClientId na tabela Pets automaticamente
Pet.belongsTo(Client);

// Define o outro lado (cliente tem muitos pets, 1:N)
Client.hasMany(Pet);
export default Pet;
```

```js
// controllers/pet.controler.js
import model from '../models/pet.model.js';
import client from '../models/client.model.js';

// GET /pets
// Retorna todos os pets, sem dados do dono
function findAll(request, response){
    model.findAll().then(
        function(results){
            response.json(results).status(200);
        }
    ).catch(
        function(e){
            console.log(e);
        }
    );
}

// GET /pets/:id
// Retorna um pet com os dados do dono (eager loading)
function findByPk(request, response){
    model.findByPk(request.params.id, {
        // include faz um join com a tabela de client
        // O sequelize traz o pett e o cliente num único objeto
        // Sem included, só viria clientid
        include: client
    }).then(function (result){
        response.json(result).status(200);
    }).catch(function(e){
        console.log(e);
    });
}

// GET /clients/:id/pets
// Retorna todos os pets de um cliente específico
function findPetsOfClient(request, response){
    model.findAll({
        where: {
            // Filtra pelo campo de chave estrangeira criado automaticamente pelo
            // Pet.belongsTo(Client)
            ClientId: request.params.id
        }
    }).then(function(results){
        response.json(results).status(200);
    }).catch(function(e){
        console.log(e);
    });
}

// POST /pets
// Cria um novo pet vinculado a um cliente
function create(request, response){
    model.create({
        name: request.body.name,
        type: request.body.type,
        breed: request.body.breed,
        birth: request.body.birth,
        ClientId: request.body.ClientId // Chave estrangeira (dono)
    }).then(function(result){
        response.json(result).status(201);
    }).catch(function(e){
        console.log(e);
    });
}

// DELETE /pets/:id
// Remove um pet pelo id
function deleteByPk(request, response){
    model.destroy({
        where: {
            id: request.params.id
        }
    }).then(function(result){
        if(result == 1){
            response.status(200).send();
        } else {
            response.status(404).send();
        }
    }).catch(function(e){
        console.log(e);
    });
}

// PUT  /pets/:id
// Atualiza um pet existente
function update(request, response){
    model.update({
        name: request.body.name,
        type: request.body.type,
        breed: request.body.breed,
        birth: request.body.birth,
        ClientId: request.body.client // Permite trocar o dono do pet
    },
    {
        where: {
            id: request.params.id
        }
    }).then(function(result){
        response.json(result).send();
    }).catch(function(e){
        console.log(e);
    });
}

export default {findAll, findByPk, create, update, deleteByPk, findPetsOfClient}
```

### Rotas
O arquivo de rotas mapeia as URLs e métodos HTTP para as funções que criamos nos Controllers.

```js
// routes/api.routes.js

import express from 'express';
import breedController from '../controllers/breed.controler.js';
import clientController from '../controllers/client.controler.js';
import petController from '../controllers/pet.controler.js';

const router = express.Router();

// Rotas de raças
router.get('/breeds', breedController.getAll);
router.get('/breeds/:id', breedController.getById);
router.post('/breeds', breedController.create);

// CRUD completo de clientes
router.get('/clients', clientController.findAll);
router.get('/clients/:id', clientController.findByPk);
router.post('/clients', clientController.create);
router.put('/clients/:id', clientController.update);
router.delete('/clients/:id', clientController.deleteByPk);

// CRUD completo de pets
router.get('/pets', petController.findAll);
router.get('/pets/:id', petController.findByPk);
router.post('/pets', petController.create);
router.put('/pets/:id', petController.update);
router.delete('/pets/:id', petController.deleteByPk);

// Rota especial
// Busca os pets de um cliente específico
// Padrão REST de recursos aninhados (nested resources)
router.get('/clients/:id/pets', petController.findPetsOfClient);

export default router;
```