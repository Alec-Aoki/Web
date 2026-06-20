# Poções e Soluções
## Tecnologias utilizadas

**Back-end**
- Node.js
- Express
- Sequelize (ORM)
- SQLite (em memória)
- cors

**Front-end**
- HTML, CSS e JavaScript puro (Fetch API / AJAX)

## Estrutura do projeto
```
poções-e-soluções/
├── backend/
│   ├── models/
│   │   ├── pocao.model.js
│   │   └── dbconfig.js
│   ├── controllers/
│   │   └── pocao.controller.js
│   ├── routes/
│   │   └── pocao.routes.js
│   ├── seed.js
│   ├── server.js
│   └── package.json
└── frontend/
    ├── css/
    │   └── style.css
    ├── admin/
    │   ├── admin.html
    │   └── admin.js
    └── loja/
        ├── index.html
        └── loja.js
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (versão 18+ recomendada).

## Como rodar

### 1. Back-end (Web Service)

Dentro da pasta `backend/`:

```bash
npm install
npm start
```

O servidor sobe em `http://localhost:3000`. Como o banco é SQLite **em memória**, ele é recriado e populado com 6 poções de exemplo a cada vez que o servidor é iniciado. Qualquer poção criada/removida manualmente é perdida ao reiniciar.

**Endpoints disponíveis:**

| Método | Rota | Descrição |
|---|---|---|
| GET | `/pocoes` | Lista todas as poções |
| POST | `/pocoes` | Cadastra uma nova poção |
| DELETE | `/pocoes/:slugNome` | Remove uma poção pelo seu slug |

### 2. Front-end

Não precisa de instalação — são páginas HTML estáticas que consomem a API via `fetch`. Com o back-end já rodando, basta abrir no navegador (ou servir com uma extensão como Live Server):

- **Loja (cliente)**: `frontend/loja/index.html`
- **Administração (Annabelle)**: `frontend/admin/admin.html`

> O back-end precisa estar rodando (`npm start`) **antes** de abrir as páginas, senão as requisições à API vão falhar.

## Modelo de dados — Poção

| Campo | Tipo | Descrição |
|---|---|---|
| `slugNome` | STRING (PK) | Identificador único, sem espaços/acentos, usado nas URLs |
| `nome` | STRING | Nome de exibição da poção |
| `descricao` | TEXT | Descrição da poção |
| `imagem` | TEXT | URL ou caminho da imagem |
| `preco` | INTEGER | Preço em moedas |

## Uso de IA

O projeto foi desenvolvido com apoio do Claude, usado das seguintes formas:

- **Explicação de conceitos**: dúvidas sobre Sequelize, ES Modules, CORS, fetch/AJAX e boas práticas de modelagem de dados (ex: chave natural vs. artificial) foram esclarecidas antes da implementação.
- **Revisão e debug de código**: trechos escritos manualmente foram revisados pela IA, que apontou erros (digitação, escopo de variáveis, uso incorreto de `async`/`await`, inconsistência de nomes) sem fornecer a correção direta, a correção foi feita manualmente por mim.
- **Geração de boilerplate**: partes específicas (seed do banco, estrutura inicial dos HTMLs, arquivo de estilos CSS e este README) foram geradas diretamente pela IA, e revisadas/testadas antes da entrega.
- **Planejamento de arquitetura**: a divisão back-end/front-end e a organização de pastas (padrão MVC no back-end) foram discutidas em conjunto com a IA.

Todo o código gerado foi compreendido e testado por mim antes da entrega.