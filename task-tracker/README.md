# Task Tracker

Um usuário se registra/faz login, e pode criar, ver, atualizar e deletar suas próprias tarefas.

Estrutura:

```
task-tracker/
|-- backend/    <- Express, bd, auth
|-- frontend/   <- React + TS
```

A ordem de desenvolvimento vai ser o backend primeiro, e depois o frontend, pra ele poder consuir uma API que já funciona.

Sequência do backend:
1. Setup do projeto (`npm init`, instalar Express)
   1. `mkdir backend`, `cd backend`, `npm init -y`
      1. `npm init -y` cria `package.json`, um arquivo que rastreia os metadados do projeto e suas dependências. O `-y` é pra aceitar os valores padrões em vez de perguntar um por um
   2. `npm install express sqlite3 bcrypt jsonwebtoken cors dotenv`
      1. Vão aparecer em `dependencies` no `package.json`
   3. Criar `server.js`, ponto de entrada que eventualmente vai achamar `app.listen()`
   4. Criar `.env`, que vai guardar `JWT_SECRET` e `PORT` (manter fora do git com um `.gitignore` contendo `node_modules/` e `.env`)
2. Conexão com a base de dados e modelo/schemas
   1. Criar `db.js` (abre/cria o arquivo SQLite `tasks.db`) e exporta a conexão
   2. Definir a tabela `users` com `id, email, hashedPassword`
   3. Definir a tabela `tasks` com `id, title, completed, userId`, sendo userId uma FK para `users`
   4. Rodar o SQL de criar a tabela uma vez, na inicialização do servidor, se as tabelas já não existirem
3. Rotas de autenticação (`routes/auth.js`)
   1. Registrar: `POST /auth/register`, aceita `{email, password}` e faz o hash da senha com bcrypt, insere em `users`
   2. Login: `POST /auth/login`, aceita `{email, password}`, busca o `user`, `bcypt.compare` e se bem-sucedido assina e retorna um token JWT
   3. Testar ambas as rotass com `curl` ou Postman
4. Middleware de autenticação (`middleware/requireAuth.js`)
   1. Lê `Authorization: Bearer <token>` do header
   2. Verifica com `jwt.verify`, adiciona `req.userId` e chama `next()` ou retorna `401`
5. Rotas de tasks (`routes/tasks.js`)
   1. Deve estar protegida por `requireAuth`
   2. `GET /tasks`: retorna somente as tasks onde `userId === req.userId`
   3. `POST /tasks`: cria uma tarefa pertencente ao `req.userId`
   4. `PUT /tasks/:id`: atualiza uma task (verificar se pertence a `req.userId` antes de atualizar)
   5. `DELETE /tasks/:id`: deleta uma task (mesm aveificação)
   6. Testar cada rota com `curl`/Postman
6. Juntar tudo no `server.js`
   1. `app.use(cors(...))`, `app.use(express.json())`
   2. Montar `authRotes` em `/auth` e `taskRoutes` em `/tasks`
   3. `app.listen(PORT)`

Sequência do frontend:
1. Setup do projeto (Vite + React + TS)
   1. `npm create vite@latest frontend -- --template react-ts`
      1. `vite` é uma ferramenta de build que lida com compilar o JSX/TSX em JS puro que o browser consegue rodar, e fornece um servidor local dev rápido
      2. O template `react-ts` estrutura o React com uma pré-configuração pra TypeScript
      3. Em `frontend/src/`
         1. `App.tsx` é o componente raíz e é onde a UI em si será construída
         2. `main.tsx` é o ponto de entrada, renderizando `<App />` na página
   2. `cd frontend`, `npm install`
   3. Confirmar `npm run dev` mostra página padrão do Vite
2. Tipos
   1. Criar `types.ts` com `interface Task {id: number; title: string; completed: boolean}`, igual à resposta do back
3. Forms de registro/login (UI de autenticação)
   1. `LoginForm.tsx` com inputs controlados pra email/senha, `fetch("/auth/login", {method: "POST", ...})` na submissão
   2. Caso bem-sucedido, guardar o JWT retornado (estado React ou `localStorage`, mais simples)
   3. `RegisterForm.tsx` com o mesmo formato, chama `/auth/register`
4. Lista de tarefas
   1. `TaskList.tsx`: `useEffect` faz o fetch de `GET /tasks`, mandando o JWT guardado no `Authorization` do header
   2. `.map()` sobre as tasks em uma lista, com `key={task.id}`
5. UI de criar/atualizar/ðeletar, conectado à API (CRUD)
   1. Form pra `POST /tasks` (nova task), colocando o resultado num estado caso bem-sucedido
   2. Checkbox/botão por tarefa pra `PUT /tasks/:id` (muda `completed`)
   3. Botão de deletar por tarefa (`DELETE /tasks/:id`), removendo do estado caso bem-sucedido
6. Checagem final
   1. Confirmar se o CORS tá configurado certo
   2. Teste manual completo