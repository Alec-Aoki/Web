# Fundamentos de Desenvolvimento Web

**Objetivo**: entender conceitos fundamentais de JavaScript, TypeScript, React, APIs e bases de dados.

---

## Módulo 1 - Fundamentos de JavaScript
1. Valores e tipos primitivos (`string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`)
2. Variáveis (`var` vs `let` vs `const`) e escopo (global, de função, bloco)
3. Funções (declarações, expressões e arrowfunctions), sintaxe e `this`
4. Objetos e arrays, literals, property access, métodos de arrays (`map`, `filter`, `reduce`, `find`)
5. Controle de fluxo e igualdade (`==` vs `===`, verdadeiro/falso, condicionais, loops)

### Valores e Tipos Primitivos

**Definição**: *valor* é um pedaço de dado sobre o qual JS consegue operar. Todo valor tem um *tipo*, e JS reconhece 7 tipos primitivos:
1. `string`
2. `number`
3. `boolean`
4. `nulll`
5. `undedfined`
6. `symbol`
7. `bigint`

Qualquer tipo que não é um primitivo (como objetos, arrays e funções) são *reference types*, ou seja, suas variáveis apontam para um local na memória, não ao valor em si.

### Variáveis

**Definição**: uma *variável* é um nome se atrelando a um valor. JS tem 3 palavras-chave de claração:

| Palavra-chave | Escopo | Reatribuível*        | Redeclarável |
| ------------- | ------ | -------------------- | ------------ |
| `var`         | Função | Sim                  | Sim          |
| `let`         | Bloco  | Sim                  | Não          |
| `const`       | Bloco  | Não (*binding-only*) | Não          |

\*O termo refere-se à capacidade de alterar o valor ou a referência de uma variável, ponteiro ou recurso depois que ele já foi inicializado. Essa regra se aplica ao *binding*, à *atribuição*, não aos *conteúdos*.

```js
const arr = [1,2];
arr.push(3);
```

É possível pois `push` muta o objeto que a atribuição aponta para, sem reatribuir `arr` em si.

```js
const arr = [4];
```

Após o primeiro código não é possível, dá errado, pois está reatribuindo `arr`.

### Funções

**Definição**: uma *função* é um bloco de código reutilizável atrelado a um nome, invocado com `()`. Em JS, há 3 formas de produzir uma função:

```js
// 1: declaração de função
// pode ser usada antes de linha em que é declarada
function add(a, b){
    return a + b;
}

// 2: expressão de função
// a variável existe, mas fica indefinida (undefined) até que a linha seja executada
const subtract = function(a, b){
    return a - b;
};

// 3: arrow function
// o padrão para funções curtas ou inline (executadas diretamente no local onde são
// referenciadas, ao invés de desviar o fluxo)
const multiply = (a, b) => {
    return a * b;
};

// OBS: retorno implícito
// é possível ocultar as chaves e o return
const divide = (a, b) => a / b;
```

Arrow functions *não possuem seu prório `this`*, elas herdam o `this` do escopo no qual foram *definidas* (*lexical `this`*). 

**Definição**: `this` é uma palavra-chave especial dentro de uma função que se refere ao *objeto do qual a função foi chamada* (não o objeto em que foi definida). O `this` é definido por onde/como a função é chamada, não de onde ela é definida/escrita. Uma mesma função pode ter um `this` diferente toda vez que é chamada.

```js
const person = {
    name: 'Alec',
    greet: function(){
        console.log(this.name);
    }
};

person.greet(); // Alec
```

No exemplo acima, `this` se refere a `person`, não por causa da declaração de `person` e da função, mas pela chamada `person.greet();`. Em JS, a regra é: tudo que está à esquerda do ponto quando a função é invocada se torna o `this`. Não é o objeto onde o `greet` é definido, é o objeto do qual foi chamado! O `this` é decidido dinamicamente, em tempo de chamada (*call time*, o momento em que a função é *executada*).

```js
const person = {
    name: 'Alec',
    delayedGreet: function(){
        setTimeout(function(){
            console.log(this.name);
        }, 1000);
    }
}

person.delayedGreet(); // undefined
```

No código acima, é incorreto assumir que `this.name` se refere a `Alec` pois está dentro de `delayedGreet`. O que realmente chama a função interna (o `console.log()`) é `setTimeout()`, e nela não há nada antes de um ponto para ser o `this`.

Repetindo a definição de arrow function: elas não possuem seu prório `this`, elas herdam o `this` do escopo no qual foram *definidas* (*lexical `this`*).

```js
const person = {
    name: 'Alec',
    delayedGreet: function(){
        setTimetout(() => {
            console.log(this.name);
        }, 1000);
    }
}

person.delayedGreet(); // Alec
```

Nesse exemplo, como a arrow function não define seu próprio `this`, ela olha pro nível acima em sua declaração, ou seja, pro `this` do delayedGreet, que é `person`. A arrow function herda esse `this` para sempre, ele nunca muda.

### Objetos e Arrays

**Definição**: um *objeto* é uma coleção não-ordenada de pares chave-valor (chamados *propriedades*), onde chaves são strings ou símbolos e valores podem ser qualquer coisa, incluindo outros objetos ou funções.

```js
const student = {
    name: 'Alec',
    age: 20,
    isEnrolled: true,
    greet: function(){
        return `Hi, I'm ${this.name}`;
    }
};

// Dois jeitos diferentes de acessar uma propriedade:
student.name; // dot notation, a chave deve ser um identificador válido, conhecido
student['name']; // bracket notation, a chave pode ser uma variável ou computada em tempo de execução

const key = 'age';
stdeunt[key]; // bracket notation
```

**Definição**: um *array* é uma lista de valores com ordem e indexados. Na verdade é um objeto especializado onde as chaves são inteiros sequenciais (`0, 1, ...`).

```js
const scores = [85, 92, 78];
scores[0]; // 85
scores.length; // 3
scores.push(100); // muta no próprio local: [85, 92, 78, 100]
```

**OBS**: lista não é um tipo nativo de JS, mas signifca, em termos gerais, uma sequência de itens com ordem.

Há 4 métodos de arrays mais importantes, e React é construído inteiramente sobre o método `.map()`

`.map()`: transforma cada elemento, retornando *um array **novo** do mesmo tamanho*. **Nunca muta o original!**

```js
const doubled = scores.map(score => score * 2); // [170, 184, 156, 200] e scores original continua o mesmo!
```

`.filter()`: mantém apenas os elementos que atenderem a condição, returnando um arra *novo*

```js
const passing = scores.filter(score => score >= 80); // [85, 92, 100]
```

`.reduce()`: colapsa um array para um valor único, aplicando repetidamente uma função que combina um acumulador com cada elemento

```js
const total = scores.reduce((accumulator, current) => accumulator + current, 0); // 0 + 85 + 92 + 78 + 100 = 355
// 0 é o valor inicial de accumulator
```

`.find()`: retorna o *primeiro* elemento do array a satisfazer a condição, ou `undefined` se não houver nenhum

```js
const first90plus = scores.filter(score => score >= 90); // 92
```

Exercício: dado `const nums = [1, 2, 3, 4, 5, 6];`, escreva uma linha usando `.filter()` e `.reduce()` juntos para conseguir a soma dos números pares da lista.

```js
const ans = nums.filter(num => num % 2 === 0).reduce((accumulator, current) => accumulator + current, 0);
```

### Callbacks (Prévia)

**Definição**: um *callback* é uma função passada como argumento de outra função, com a intenção de que a função que a recebe a execute em algum ponto de sua própria execução. Isso é possível em JS pois *funções são valores*; elas podem ser armazenadas em variáveis, colocadas em arrays, passsadas como argumentos e retornada de outras funções. É isso que possibilita *funções de alta ordem* (funções que recebem ou retornam outras funções).

Há dois tipos de callback:

**Callback Síncrono**: chamado imediatamente, na mesma execução. É o caso de `.map()`, `.filter()` e `.reduce()`.

```js
[1, 2, 3].forEach(function logIt(num){ // logIt() é o callback
    console.log(num);
});

// roda imediatamente, em ordem, antes do forEach() em si retornar
```

**Callback Assíncrono**: guardado e chamado *depois*, assim que um evento ou operação acabar

```js
setTimeout(function(){ // esse calback não é executado imediatamente
    console.log('This runs after 1 second');
}, 1000);

console.log('This runs first');
```

### Igualdade

JS tem 2 operadores de igualdade:

`==` (igualdade frouxa/loose equality): compara valores após convertê-los para um tipo comum se eles diferirem (*type coercion*).

```js
5 == '5' // verdadeiro ('5' vira 5)
0 == 'false' // verdadeiro ('false' vira 0)
null == undefined // verdadeiro (caso especial)
```

`===` (igualdade estrita/strict equality): compara ambos valor *e* tipo, sem coerção. Se os tipos forem diferentes, é `false`.

```js
5 == '5' // falso
0 == 'false' // falso
null == undefined // falso
```

Sempre usar `===`, pois seu comportamento é previsível. O `==` obedece umas regras estranhas.

**Definição**: *truthy*/*falsy*. Em contextos onde o JS expera um booleano, qualquer valor pode ser coagido para `true` ou `false`. Há exatamente 8 values falsy em JS, todo o resto é truthy: `false, 0, -0, 0n, (BigInt zero), '', null, undefined, NaN`. Tudo fora dessa lista, incluindo `'0'`, `[]` e `{}` são truthy.

```js
if([]){
    console.log('this runs'); // this runs!
}
```

### Controle de Fluxo

```js
// if/else padrão
if (score >= 90) {
  grade = "A";
} else if (score >= 80) {
  grade = "B";
} else {
  grade = "F";
}

// loop for, clássico, baseado em índices
for (let i = 0; i < scores.length; i++) {
  console.log(scores[i]);
}

// for...of, itera sobre valores diretamente
for (const score of scores) {
  console.log(score);
}

// for...in, intera sobre as chaves de um objeto (NÃO é pra arrays, apesar de funcionar)
for (const key in student) {
  console.log(key, student[key]);
}
```

**OBS**: `for...of` retorna valores, `for...in` retorna *chaves* (nomes de propriedades).

---

## Módulo 2 - JS Assíncrono
1. Pilha de chamada (*call stack*) e loop de eventos (*event loops*)
2. Callbacks
3. Promises (states, `.then()`, `.catch()`, encadeamento)
4. `async`/`await`
5. `fetch()` e requisições de rede, `Promise.all`

### Call Stack e Event Loop

JS é *single-threaded*. Ele só pode fazer uma coisa por vez. Tudo que parece computação paralela é uma ilusão criada pelo mecanismo a seguir.

**Definição**: *call stack* é uma estrutura que o JS usa pra rastrear qual função está rodando atualmente. Quando uma função é chamada, ela é colocada (*push*) no topo da stack. Quando ela retorna, ela é removida (*pop*). JS só executa a função que está no topo. É puramente sequencial e síncrono: uma função por vez, estritamente aninhadas. *Stack overflow* é uma recursão infinita que estoura essa pilha!

A grande pergunta é: e com algo lento? Se JS só tivesse a call stack, uma operação lenta (uma requisição demorando 2 segundos, um timer) congelaria o programa inteiro por esse período de tempo. A solução vem de diversas formas:
- **Web/Node APIS**: `setTimeout`, `fetch`, leituras de arquivos etc. não são parte da linguagem JS em si. São fornecidos pelo *ambiente* (browser ou Node). Ao chamar `setTimeout(fn, 1000)`, JS dá `fn` para o ambiente externo e imediatamente continua seu fluxo de conexão, sem esperar.
- **Callback/Task Queue** (fila de callback/tarefas): quando o ambiente externo terminar de executar a tarefa (a requisição chega ou o timer acaba), ele não roda o callback imediatamente. Ele coloca o callback numa fila de espera (callback queue).
- **Event Loop**: uma checagem constante pra ver se a call stack está vazia. Se estiver, pega a primeira coisa que estiver esperando na fila da espera (callback queue) e coloca na call stack pra rodar. Ele nunca interrompe algo no meio da execução, apenas executa quando a call stack estiver completamente vazia.

```js
console.log('1');
setTimetout(() => console.log('2'), 0); // 0 milisegundos
console.log('3');
```

A ordem de saída será `1, 3, 2`, mesmo que o timeout seja 0 milisegundos, pois precisa esperar a call stack estar vazia.

### Callbacks (Assíncronas)

Surge um problema ao usar muitas callbacks assíncronas aninhadas, onde uma depende da anterior terminar, chamado callback hell/the pyramid of doom, com indentação complicada, erros aninhados e que não podem se propagar facilmente etc. Para evitar esses problemas, as Promises foram criadas, achatando as indentações via encadeamento, unificando o tratamento de erros por meio de um caminho único de erro, e providenciando combinadores já construídos (`Promise.all`, que será visto mais adiante) para esperar por várias coisas ao mesmo tempo.

Retomando os 2 tipos de callbacks:

**Callback Síncrono**: invocado na mesma execução de call stack que a função para a qual foi passada, ou seja, entra no topo da pilha e é executada imediatamente.

**Callback Assíncrono**: não é invocado imediatamente. A função é passada pro ambiente browser/Node, e só volta pra call stack a partir da fila de espera (callback queue) e do event loop, quando a call stack estiver vazia.

### Promises

**Definição**: uma *Promise* é um objeto representando uma eventual completação (ou falha) de uma operação assíncrona, junto com seu valor resultante. É a resposta nativa do JS pro callback hell.

A Promise está sempre em 1 de 3 estados e, uma vez que sai do estado `pending`, **nunca mais pode mudar de estado**. Essa imutabilidade depois estabilizar é o que torna o encadeamento previsível.
- `pending`: estado inicial, a operação ainda não terminou.
- `fulfilled`: a operação foi bem-sucedida, a Promise agora guarda o valor resultante.
- `rejected`: a operação falhou, a Promise agora gaurda o motivo (tipicamente um `Error`).

`fulfilled` e `rejected` são coletivamente chamados de `settled`, ou seja, uma Promise que permanetemente terminou de mudar de estados.

Geralmente, não é preciso construir uma Promise na mão, pois bibliotecas de função como `fetch` retornam elas já feitam, mas vale a pena entender o que acontece debaixo dos panos.

```js
const promise = new Promise((resolve, reject) => {
    const success = checkSomeCondition();
    if(success){
        resolve('It worked'); // a Promise vira fulfilled, com o valor 'It worked'
    } else {
        reject(new Error('It failed')); // a Promise vira rejected, com o motivo 'It failed'
    }
});
```

`resolve` e `reject` são duas funções que o construtor da Promise fornece.

Agora, como consumir uma Promise?

```js
promise
    .then(result => console.log(result)); // só roda quando/se fulfilled
    .catch(errro => console.log(error)); // só roda quando/se rejected
```

`.then()` registra a callback pro caso fulfilled, `.catch()` registra pro caso rejected. Nenhum roda imediatamente/onde escrito, eles são registrados, e então o JS chama aquele que se aplica só quando a Promise estabiliza (via o event loop).

**Encadeamento**: `.then()` em si retorna uma *nova* Promise, ou seja, é possível encadear outro `.then()` diretamente nele (em vez de indentar).

```js
getUser(userId)
    .then(user => getOrders(user.id))
    .then(orders => getOrderDetails(orders[0].id))
    .then(details => getShippingStatus(details.shipmentId))
    .then(status => console.log(status))
    .catch(error => console.log('Something in the chain failed:', erro));
```

O `.catch()` único é possível pois, caso qualquer `.then()` na cadeia retorne um erro ou uma Promise rejected, todo `.then()` subsequente é pulado e vai direto pro `.catch()`. É similar a um `try`/`catch` de código síncrono.

### Async/Await

`async`/`await` nada mais é que uma sintaxe que permite a escrita the códigos baseados em Promises pra que eles sejam lidos de começo a fim como código síncrono, enquanto os mecanismos de event loop, call stack e Promises funcionam debaixo dos panos como vistos. Eles não fazem o código rodar síncrono ou adiciona threads! Ele apenas cria a ilusão.

`await`: colocado antes de qualquer expressão que produz uma Promise, ele *pausa a execução da **função** `async` que o engloba* até que a Promise estabilize, e então desembrulha o valor fulfilled (para que o `await` avalie o valor diretamente, em vez da Promise em si) ou joga uma rejection como um catchable error. OBS: o `await` só pausa a função da qual está dentro, **ele não pausa a call stack, o resto do programa, ou o browser**.  O resto do programa depois da função `async` continua rodando normalmente.

```js
console.log('A');

async function foo(){
    console.log('B');
    await null; // vai ser fulfilled
    console.log('C');
}

foo();
console.log('D');
```

O resultado será `A, B, D, C`.

**OBS**: JS na verdade tem duas filas separadas pra alimentar o event loop:
- **Macrotask Queue**: onde `SetTimeout` callbacks, DOM events etc. vão.
- **Microtask Queue**: onde os callbacks de Promises (`.then()`, `.catch()` e `await`) vão.

A regra que o event loop segue é, depois que cada bloco\* de código síncrono termina, ele consome *toda* a fila de *microtask* antes de sequer considerar a fila de macrotask.

```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
```

O resultado será `1, 4, 3, 2`.

\*Um bloco de código síncrono (formalmente chamado de **task** ou tick) é delimitado precisamente pelo estado da call stack: ele começa no momento em que algo é colocado na call stack vazia, e termina no momento que a call stack fica vazia novamente. É por isso que o JS garante *run-to-completion* (uma vez que uma task começa a rodar, ela roda ininterrupta, em cheio). Nada pode parar um bloco no meio exceto um `await` explícito revogando controle de dentro da call stack.

O código equivalente ao exemplo de `.then()` encadeado:

```js
async function trackShipment(userId){
    try {
        const user = await getUser(userId);
        const orders = await getOrders(user.id);
        const details = await getOrderDetails(orders[0].id);
        const status = await getShippingStatus(details.shipmentId);
        console.log(status);
    } catch(error){
        console.log('Something in the chain failed:', error);
    }
}
```

### Fetch

**Definição**: `fetch()` é uma API de browser (e Node) para fazer requisições HTTP. Ele retorna uma Promise.

```js
async function getUser(id){
    const response = await fetch(`https://api.example.com/users/{id}`);
    const data = await response.json();
    return data;
}
```

Por que dois `await`s? As Promises do `fetch()` são resolvidas assim que os *headers* da resposta do servidor chegam; ele não espera o corpo da resposta completo chegar. O valor resolvido é um objeto `Response`, não os dados. `response.json()` é em si uma operação assíncrona (lê e parsea o fluxo do body), então também retorna uma Promise, logo, requer seu próprio `await`.

**Erros**: a Promise do `fetch()` só rejeita numa falha de conexão. Um resposta HTTP `404` ou `500` ainda é um `fetch()` bem sucedido, e **não** cai num `.catch()`. É preciso checar `response.ok` ou `response.status` explicitamente:

```js
async function getUser(id){
    const response = await fetch(`https://api.example.com/users/${id}`);
    if(!response.ok){
        throw new Error(`Request failed with status ${response.status}`);
    }
    return await response.json();
}
```

### Coodernando Múltiplas Promises

**Definição**: `Promise.all(iterable)` pega uum array de Promises e retorna uma única Promise que: preenche um array com *todos* os resultados, na mesma ordem, um pra *cada* Promise no input que foi bem-sucedida/fulfilled; ou rejeita imediatamente com o *primeiro* motivo pra rejeição que encontrar, assim que qualquer um falhar.

```js
async function getDashboard(userId)[
    const [user, orders, notifications] = await Promse.all([
        fetch(`api/users/${userId}`).then(r => r.json()),
        fetch(`api/orders/${userId}`).then(r => r.json()),
        fetch(`api/notificaitons/${userId}`).then(r => r.json())
    ]);
    return {user, orders, notifications};
]
```

A diferença entre usar `Promise.all()` e usar `awaits` sequenciais é a performance. Como as requisições são independentes, escrever elas como três `await`s separados em sequência faria cada um rodar após o outro, cada um esperando o anterior terminar antes de começar. O tempo total seria a soma do tempo de cada requisição executar. `Promise.all()` começa todas as três requests essencialmente ao memso tempo, logo, o tempo total será o do mais lento.

### JSON

**Definição**: JSON (JavaScript Object Notation) é um formato de dado para representar dados estruturados em texto puro, para que possam ser transportados através de uma rede e reconstruídos na outra ponta. É um formato independente de linguagem.

```json
{
    "name": "Alec",
    "age": 20,
    "isStudent": true,
    "scores": [85, 92, 78],
    "address": null
}
```

As chaves **sempre** devem estar em aspas. Os tipos de valores em JSON estão limitados a:
- String
- Number
- Boolean
- Null
- Object
- Array

As funções de conversão em JS:

```js
const jsonString = JSON.stringify(studentObject); // converte objeto JS -> JSON (p/ enviar)
const studentObject = JSON.parse(jsonString); // texto JSON -> objeto JS (p/ receber)
```

`response.json()` é essencialmente ler o body da resposta e rodar `JSON.parse()` automaticamente.

## TypeScript

1. Tipos, compilador vs. tempo de execução
2. Tipos básicos, arrays e `interface` vs `type`
3. Tipagem de função, parâmetros opcionais/padrões, tipos de união
4. Genéricos (básico)
5. Tipando objetos/respostas de API

### Tempo de Execução vs Compilação

JS é dinamicamente tipado: o tipo da variável não é declarado ou fixo, o que deixa o JS fazer coisas como acessar uma propriedade inexistente sem retornar um erro, mas sim `undefined`.

**Tempo de execução**: quando o código está realmente executando, linha por linha, processando dados reais. JS puro roda puramente em tempo de execução, não há checagem nenhuma antes de começar a executar.

**Tempo de compilação**: para TypeScript mais especificamente, é tempo de checagem de tipo, já que TS não produz código de máquina. É uma fase separada que ocorre antes de execução, onde a ferramenta lê o código sem executá-lo, e checa se  o uso dos valores é internamente consistente com seus tipos declarados ou que o TS inferiu.

"TypeScript" é um superconjunto/superposição de JS que adiciona um sistema de tipagem estático opcional, checado inteiramente em tempo de compilação e removido antes do código rodar. Não é um engine que roda. Como os tipos são apagados antes da execução, TypeScript fornece zero proteção em tempo de execução.

```ts
function getFullName(user: {firstName: string, lastName: string}){
    retunr user.FirstName + ' ' + user.lastName;
}
```

Essa assinatura de função parece guarantida à primeira vista, mas não é, porque se o dado vier de uma origem externa, como uma resposta de uma API, um `JSON.parse()` ou input de usuário, o TypeScript não consegue verificar em tempo de execução se o objeto real bate com o formato declarado. Se a API silenciosamente mandar `firstname` em vez de `firstName`, o TS não vai pegar isso.


### Tipos Báscios, Arrays e `interface` vs `type`

Notação de tipos primitivos: a sintaxe é dois pontos (`:`) depois do nome da variável, seguido do tipo:

```ts
let name: string = 'Alec';
let age: number = 20;
let isStudent: boolean = true;
```

OBS: o tipo `number` do TS não diferencia entre int e float.

**Inferência de tipos**: o compilador consegue inferir o tipo de uma variável a partir de valores iniciais sempre que possível, e só precisa da notação explícita quando a inferência é ambígua ou impossível. Geralmente não é preciso escrever o tipo explicitamente.

```ts
let name = 'Alec'; // o TS automaticamente identifica como string
name = 42; // error: type 'number' is not assignable to type 'string'
```

**Arrays**

```ts
let scores: number[] = [85, 92, 78];
// equivalente a sintaxe alternativa:
let scores2: Array<number> = [85, 92, 78];

scores.push(100); // ok
scores.push('A'); // error: argument of type 'string' is not assignable to parameter
```

**Tipagem de Função**

```ts
function add(a: number, b: number): number {
    return a + b;
}
```

Parãmetros são notados individualmente. A tipagem de função, depois dos parênteses, se refere ao *valor de retorno*.

**Descrevendo o Formato de Objetos**

Ambos `interface` e `type` permitem descreve o formato uma vez e o reutilziar:

```ts
interface User {
    firstName: string;
    lastName: string;
    age: number;
}

function getFullName(user: User): string {
    return user.firstName + ' ' + user.lastName;
}

getFullName({firstname: 'Alec', lastname: 'Aoki', age: 20}); // error: object literal may only specify known properties, and 'firstname' does not exist in type 'User'
```

```ts
type User = {
    firstName: string;
    lastName: string;
    age: number;
}
```

Qual a diferença entre `interface` e `type`?

`interface` pode ser re-aberto e extendido após a primeira declaração (*declaration merging*). Duasd declarações `interface User {}` com o mesmo nome automaticamente se juntam em um formato combinado. Só pode ser usado pra formatos de objetos/classes, e dá uma mensagem de erro mais clara.

`type` é mais estrito, mas pode nomear *qualquer coisa* (formato de objetos e uniões, como `type Status = 'pending' | 'fulfilled' | 'rejected'`). Não pode ser re-aberto ou fazer merge, o que pode ser um benefício de segurança.

A convenção atual é usar `interface` pra formato de objetos que representam "coisas" no domínio (um user, um produto, o formato de uma resposta de API). `type` deve ser usado pra uniões, primitivas com nome, e qualquer coisa que não é um simples formato de objeto.

```ts
interface ApiUserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

async function getUser(id: number): Promise<ApiUserResponse> {
    const response = await fetch(`/api/users/${id}`);
    return await response.json();
}
```

### Tipagem de Funções

**Parâmetros Opcionais**: por padrão, TS trata todo parâmetro declarado como obrigatório. Chamar uma função com argumentos de menos é um erro de compilação.

```ts
function greet(name: string, greeting: string){
    return `${greeting}, ${name}$`;
}

greet('Alec'); // error: expected 2 arguments, but got 1
```

Um parâmetro é opcional quando houver uma interrogação (`?`) após o seu nome, o que implicitamente adiciona `undefined` como seu tipo:

```ts
function greet(name: string, greeting?: string){
    return `${greeting ?? 'Hello'}, ${name}$`;
}

greet('Alec'); // Hello, Alec
greet('Alec', 'Hey'); // Hey, Alec
```

Algumas regras:
- Parâmetros opcionais devem vir depois dos obrigatórios: `function greet(greeting?: string, name: string)` retorna erro de compilação.
- Dentro do corpo da função, o tipo de um parâmetro opcional é `string | undefined` (união, ver abaixo), não só uma `string`. O TS inclusive força a tratar o caso `undefined` antes de tratar como `string` (por exemplo, tentar fazer `greeting.toUpperCase()` diretamente também vai dar erro de compilação).

**Parâmetros Padrão**: em vez de permitir que o argumento não esteja presente, é fornecido um valor padrão diretamente na assinatura da função:

```ts
function greet(name: string, greeting: string = 'Hello'){
    return `${greeting}, ${name}`;
}

greet('Alec'); // Hello, Alec
```

Com o parâmetro padrão, o tipo do parâmtro dentro do corpo da função continua sendo `string`, nunca `undefined`; por isso é melhor usar parâmetros padrão. Parâmetros opcionais só devem ser usados quando *nenhum* valor é considerado um estado válido.

### União

**Definição**: tipos de união (escritos com `|`) descrevem um valor que pode ser um de vários tipos específicos:

```ts
function formatId(id: number | string){
    return `ID-${id}`;
}

formatId(42); // ok
formatId('42'); // ok
formatId(true); // error: argument of type 'boolean' is not assignable to parameter of type 'string | number'
```

**União literal de strings**: padrão particular de fazer união de strings literais específicas em vez do tipo geral `string`, sem precisar do construtor `enum`:

```ts
type PromiseState = 'pending' | 'fulfilled' | 'rejected';

function logState(state: PromiseState){
    console.log(state);
}

logState('fulfilled'); // ok
logState('done'); // errror: argument of type 'done' is not assignable to parameter of type 'PromiseState'
```

**Narrowing**: dado uma união, TS não permite que um método seja chamado que só exista em uma das possibilidades até você provar em que "branch" você está no código:

```ts
function formatId(id: number | string){
    if(typeof id === 'string'){
        return id.toUpperCase(); // TS sabe que aqui é uma string, então pode usar a func.
    } else {
        return id.toFixed(2); // mesa coisa aqui, sabe que é um number
    }
}
```

### Generics

**Definição**: um generic é um tipo que pega outro tipo como parâmetro, criando uma estrutura reutilizável ao invés de varias muito parecidas.

Sem generics, fazer um tipo "caixa" reutilizável pra diferentes tipos de dados signficaria escrever uma versão por tipo:

```ts
interface NumberBox {
  value: number;
}

interface StringBox {
  value: string;
}
```

É a mesma estrutura, diferindo somente em tipo. Com generics:

```ts
interface Box<T> {
    value: <T>;
}

const numberBox: Box<number> = {value: 42};
const stringBox: Box<string> = {value: 'hello'};
```

`T` é uma *variável de tipo*.

Funções genéricas:

```ts
function identity<T>(value: <T>): T {
    return value;
}

identity<number>(5); // T = number
identity<string>('hello'); // T = string
identity(true); // T é inferido = boolean, não precisa explicitar
```

`Promise`s em si são genéricas. `Promise<T>` significa uma Promise que, uma vez definida, guarda um valor de tipo `T`.

```ts
async function getUserId(id: number): Promise<ApiUserResponse> {
    const response = await fetch(`/api/users/${id}`);
    return await response.json();
}
```

Isso declara: qualquer que seja o que essa função retornar, vai ser um `ApiUserResponse`. Não que o TS consiga verificar o conteúdo e formato do JSON, mas pra ele entender que, daqui pra frente, assumimos que o JSON que for retornado dessa função terá esse formato pra ser usado em outros lugares do código.

### APIs

Respostas de API geralmente são aninhadas, então é preciso definir uma `interface` separada pra cada formato aninhado, e referenciar esse tipo. Para um campo que não está sempre presente na resposta, ele também deve ser marcado como opcional. Por exemplo:

```ts
interface Review {
  author: string;
  rating: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  discountPercent?: number;
  reviews: Review[];
}

async function getProduct(id: number): Promise<Product> {
  const response = await fetch(`/api/products/${id}`);
  return await response.json();
}
```

## React

1. Componentes e JSX
2. Props (read-only, one-way data flow)
3. Estados (`useState`) e re-renders
4. Side effects (`useEffect`), data fetching e cleanup
5. Listas, chaves, renderização condicional
6. Lifting state up, composição básica de componentes

### Componentes e JSX

**Definição**: uma interface de usuário é, basicamente, uma função de dados. Dado alguns dados atuais, há alguma saída visual correspondente. O problema é que JS/HTML puros se mantém em sincronização manualmente, de forma que quando um dado muda, é preciso encontrar exatamente os elementos DOM afetados e atualizar eles por si só, por mão, toda vez (como abaixo).

```js
let count = 0;
function increment(){
    count++;
    document.getElementById('count').textContent = count; // Update manual
}
```

A ideia central do React é descrever como a UI deveria se comportar dado alguma informação, e deixar o React lidar com atualizar o DOM quando os dados mudarem.

#### Componente

**Definição**: um *componente* é uma função JS que retorna a descrição de uma UI. Ela recebe inputs (props) e retorna o que deveria ser mostrado.

```jsx
function Greeting(){
    return <h1> Hello, Alec </1>;
}
```

O código acima é um componente React completo e válido: uma função (capitalizada por convenção) returnando a UI.

#### JSX

**Definição**: JSX é uma extensão de sintaxe que permite escrever HTML diretamente dentro de JS, como acima. Não é JS válido por si só, é compilado (via ferramenta de build) em uma chamada de função JS pura antes de rodar!

Em JSX:

```jsx
const element = <h1> Hello, Alec </h1>;
```

Equivalente compilado em JS puro:

```js
const element = React.createElement("h1", null, "Hello, Alec");
```

Duas regras:
- Um componente deve retornar apenas **um** componente raíz. Devido a isso, múltiplos irmãos de alto nível devem ser embrulhados numa `div` ou `<>...</>` (fragmento)
- Expresões JS devem ser embutidas com `{}`. Uma expressão JS é válida somente dentro de chaves:

```jsx
function Greeting(){
    const name = 'Alec';
    return <h1> Hello, {name} </h1>;
}
```

#### Renderizando um Componente

A definição de um componente sozinha não faz nada até ser renderizado, como um elemento:

```jsx
function App(){
    return(
        <div>
            <Greeting />
        </div>
    );
}
```

`<Greeting />` invoca o componente `Greeting` e insere o JSX retornado em seu lugar.

### Props

**Definição**: props (propriedades) são inputs passados para um componente, similar a argumentos de uma função. Eles são **read-only**, um componente nunca deve modificar seus próprios props.

#### Passagem de Props

```jsx
function Greeting(props){
    return <h1> Hello, {props.name} </h1>;
}

function App(){
    return <Greeting name="Alec" />;
}
```

`props` chegam como um único objeto: `{name: "Alec"}`. Qualquer atributo escrito numa tag JSX automaticamente se torna a chave daquele objeto. **OBS**: precisa ser aspas duplas.

#### Destruturando Props

Uma convenção comum é desestruturar props dentro da assinatura da função, em vez de escrever `prop.x` repetidamente:

```jsx
function Greeting({name}){
    return <h1> Hello, {name} </h1>;
}
```

**Múltiplos Props**

```jsx
function UserCard({name, age}){
    return (
        <div>
            <h2> {name} </h2>
            <p> {age} years old </p>
        </div>
    );
}

function App(){
    return <UserCard name="Alec" age={20} />;
}
```

**OBS**: aspas duplas passam strings, para ser outro tipo (como number) precisa estar entre chaves.

#### Regra: One-Way Data Flow

**Definição**: props fluem estritamente de pai para filho, nunca o oposto. Um componente filho não pode passar dados de volta para o pai através da modificação de props, só pode ler o que foi dado.

```jsx
function UserCard({name}){
    name = "Changed"; // não fazer isso!
    return <h2> {name} </h2>;
}
```

Se um filho precisa alterar dados pertencentes ao pai, o mecanismo correto é o pai passar uma *função* como um prop, que o filho chama.

### Estados e `useState`

**Definição**: estados (*state*) são dados que um componente possui e controla internamente, o que pode mudar com o tempo e fazer com que o componente re-renderize. Sua diferença pra props é que props são externos e read-only, enquanto estados são internos e mutáveis (através dos mecanismos mostrados abaixo, não por atribuição direta).

```jsx
function Counter(){
    let count = 0;

    function increment(){
        count++;
        console.log(count); // funciona
    }

    return (
        <div>
            <p> {count} </p>
            <button onClick={increment}> +1 </button>
        </div>
    );
}
```

Clicar no botão incrementa `count` na memória, mas o número em display nunca vai mudar, porque o React só re-renderiza um componente quando é pedido, e atribuir algo a uma variável não é gatilho de nada. A função roda de novo do zero no *próximo* render por outros motivos, ponto no qual `count` volta pra `0` de qualquer modo, já que é re-declarado a cada chamada.


#### useState

**Definição**: `useState` é um **hook**, uma função especial fornecida pelo React, chamável apenas dentro de um componente, que deixa uma função componente pura segurar um estado entre renders e aciona a re-renderização quando aquele estado muda.

```jsx
immport {useState} from "react";

function Counter(){
    const [count, setCount] = useState(0);

    function increment(){
        setCount(count + 1);
    }

    return (
        <div>
            <p> {count} </p>
            <button onClick={increment}> +1 </button>
        </div>
    );
}
```

`useState(0)` inicializa o estado com `0`, *mas só na primeira renderização do componente*; em toda renderização subsequente, o React retorna o valor atualmente guardado, ignorando o argumento. Ele retorna um array de exatamente dois itens: o valor atual (`count`) e a função pra atualizar ele (`setCount`). A sintaxe `[count, setCount]` é **desestruturação de array**, nomeando esses dois itens. Chamar `setCount(newValue)` faz duas coisas: atualiza o valor guardado, *e* agenda a re-renderização do componente, pra que o valor novo apareça na tela.

**Resumindo**: nunca atribuir estados diretamente, como em `count = count + 1`. Sempre usar a função setter retornada pelo `useState`.Atribuir estados diretamente muda o valor na memória mas não fala pro React re-renderizar, e a tela simplesmente não vai atualizar.

### Side Effects e `useEffect`

**Definição**: um efeito colateral (*side effect*) é qualquer operação que um componente realiza que ultrapassa o modelo puro de "dado entra, UI sai". Efeitos colaterais precisam de manipulação especial porque a função componente pode rodar várias vezes (uma vez por renderização), mas a maioria dos efeitos colaterais não deveria se repetir desnecessariamente a cada renderização.

```jsx
import {useState, useEffect} from "react";

function UserProfile({userId}){
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchUser(){
            const response = await fetch(`/api/users/${userId}`);
            const data = await response.json();
            setUser(data);
        }

        fetchUser();
    }, [userId]);

    if (!user) return <p> Loading... </p>;
    else return <h2> {user.name} </h2>;
}
```

`useEffect` recebe 2 argumentos: uma função contendo o efeito colateral, e um **array de dependência**.

#### Array de Dependência

O conteúdo do array de dependência define *a quantidade de vezes que o efeito colateral vai rodar*:
- `[userId]`: o efeito roda apenas na primeira renderização, e de novo em qualquer renderização posterior onde `userId` mudou desde a chamada anterior. É o caso comum.
- `[]` (array vazio): o efeito roda exatamente uma vez, e nunca mais depois do primeiro render. Comumm para setups.
- Sem array: o efeito roda a cada renderização, sem exceção. Raramente é usado, pois pode causar loops infinitos.

Por que `fetchUser` é uma função interna separada? O callback do `useEffect` em si não pode ser uma função `async` diretamente. `useEffect` espera que sua função callback retorne nada ou uma função de cleanup (limpeza), e uma função `async` sempre retorna uma `Promise`. A solução é a acima, com a função `async` dentro do efeito e sendo chamada imediatamente.

**Funções de limpeza**: se o função de efeito retornar uma função, o React trata como limpeza e roda ela antes de o efeito re-rodar ou quando o componente é removido da tela.

```jsx
userEffect(() => {
    const timer = setInterval(() => console.log('tick'), 1000);

    return () => clearInterval(timer); // limpeza/cleanup, para o timer velho antes de começar um novo, ou ao desmontar
}, []);
```

Sem isso, cada re-rodada do efeito iniciaria um novo timer sem parar o antigo (vazamento).

### Renderizando Listas

É o principal uso de `.map()` em React: transformar um array de dados em um array de elementos JSX.

```jsx
function ProductList({products}){
    return(
        <ul>
            {products.map(product => {
                <li key={product.id}> {product.name} </li>
            })}
        </ul>
    );
}
```

### Chaves

**Definição**: a `key` é um prop especial, obrigatório pra cada elemento produzido dentro de um `.map()`, que dá ao React uma identidade estável pra cada item entre re-renderizações. Sem isso, o React deveria adivinhar qual item mudou, foi adicionado, ou removido, por posição sozinho, o que pode causar bugs visuais. A regra é usar um identificador estável e único do dado em si (como `product.id`,) nunca o índice do array (`key = {index}`), a não ser que a lista seja estática e nunca reordenada/filtrada. Índice como chave quebra quando itens são adicionaodos, removidos ou reordenados, já que a posição fica associada à chave e não o item em si.

### Renderização Condicional

Há 3 padrões comuns, cada um pra um formato de condição:

```jsx
// 1: ternário
// para uma escolha "ou"
function Status({isOnline}){
    return <p> {isOnline ? "Online" : "Offline"} </p>;
}

// 2: e lógico (&&)
// para uma escolha "renderiza isso, ou nada"
function Notification({count}){
    return (
        <div>
            {count > 0 && <span> {count} new </span>}
        </div>
    );
}

// 3: return cedo
// para "renderiza algo completamente diferente"
function UserProfile({user}){
    if (!user) return <p> Loading... </p>;
    else return <h2> {user.name} </h2>;
}
```

**OBS**: no caso 2, se `count` é `0`, `count > 0 && <span>...</span>` será `false`, e o React corretamente renderiza nada. Mas `count && <span>...</span>` (sem o `> 0` explícito) dá `0`, e o React renderiza `0` mesmo. Logo, sempre usar uma comparação booleana explícita e nunca o valor em si.

### Forms

**Definição**: um input controlado é um elemento `form` cujo valor em display é controlado inteiramente por um estado do React, ao invés do estado de input interno do DOM.

```jsx
function NameForm(){
    const [name, setName] = useState("");

    function handleSubmit(e){
        e.preventDefault();
        console.log("Submitted:", name);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <button type="submit"> Submit </button>
        </form>
    );
}
```

`value={name}` faz o input mostrar o estado atual que ele está guardando. `onChange` dispara a cada tecla e atualiza o mesmo estado via `setName`. Isso fecha o loop: o estado dispara o display, o input dispara o estado. O valor do input nunca pode divergir do registro do estado do React.

`e.preventDefault()` impeded o comportamento padrão do browser que poderia descartar o estado controlado pelo JS caso a página recarregue etc.

### Lifting State Up

Dois componentes irmãos as vezes precisam compartilhar o mesmo pedaço de estado. Nenhum pode segurar o estado individualmente, já que o fluxo de dados do React só vai em uma direção (pai pra filho), sem um canal irmão para irmão.

```jsx
function TemperatureInput(){ /* estado prório */ }
function TemperatureDisplay(){ /* precisa saber o valor do input */ }
```

Na forma acima, não há como `TemperatureDisplay` acessar o estado interno de `TemperatureInput`, é algo privado àquele componente. A solução é o lifting state up.

**Definição**: lifting state up signifca mover um pedaço de um estado fora do(s) componente(s) que precisam dele para um parente comum, que vai adquirir o estado e passá-lo para ambos os filhos como prop (*data down*), passando também como função para permitir que o filho faça uma requisição de mudança (*actions up*).

```jsx
function TemperatureInput({value, onChange}){
    return <input value={value} onChange={e => onChange(e.target.value)} />;
}

function TemperatureDisplay({value}){
    return <p> Current temperature: {value}° </p>;
}

function App(){
    const [temperature, setTemperature] = useState("");

    return (
        <div>
            <TemperatureInput value={temperature} onChange={setTemperature} />
            <TemperatureDisplay value={temperature} />
        </div>
    );
}
```

### Composição de Componentes

**Definição**: composição é contruir UIs complexas aninhando componentes menores dentro de componentes maiores, cada um com uma responsabilidade bem-definida e pequena (em vez de um componente grande lidando com tudo).

```jsx
function App(){
    return (
        <div>
            <Header />
            <TemperatureConverter />
            <Footer />
        </div>
    );
}
```

## Básico de Backend

1. HTTP, HTTPS, APIs
2. Convenções REST
3. Conectando frontend ao backend (servidor mínimo com Node/Express)
4. Bases de dadoS (SQL vs. NoSQL)
5. bcrypt
6. JWT

### HTTP

**Definição**: HTTP (HyperText Transfer Protocol) é um *protocolo* de como dois programas trocam mensagens por uma rede, estruturado estritamente como **requisição** (request) e **resposta** (response). Um cliente manda uma requisição, o servidor envia de volta exatamente uma única resposta.

Anatomia de uma requisição:
- **Método**: o *verbo*, declarando intenção (abaixo).
- **URL**: *qual* recurso está sendo usado.
- **Headers**: metadados sobre a requisição (tipo de conteúdo, tokens de autenticação etc.). Pares chave-valor, não é parte do conteúdo em si.
- **Body** (opcional): os dados em si sendo enviados, presente em alguns métodos, ausentes em outros.

A anatomia da resposta espelha isso, com **código de status** (abaixo), **headers** e um **body** (os dados requisitados ou uma descrição de erro).

**Métodos**: cada método mapeia uma intenção, por convenção.

| Método   | Intenção                           | Tem um body? |
| -------- | ---------------------------------- | ------------ |
| `GET`    | Recuperar um recurso               | Não          |
| `POST`   | Criar um novo recurso              | Sim          |
| `PUT`    | Substituir um recurso inteiramente | Sim          |
| `PATCH`  | Atualizar parcialmente um recurso  | Sim          |
| `DELETE` | Remove um recurso                  | Às vezes     |

**OBS**: `GET`, `PUT` e `DELETE` são supostamente **idempotentes**, ou seja, chamar eles múltiplas vezes com o mesmo input produz sempre o mesmo estado de saída que chamar eles uma vez. `POST`, por convenção, não é idempotente (chamá-lo duas vezes geralmente cria dois recursos).

**Códigos de status**: número de 3 dígitos, agrupado pelo primeiro dígito em cinco classes:
- **1xx (Informacional)**
- **2xx (Sucesso)**: `200 OK`, `201 Created`, `204 No Content`
- **3xx (Redirecionamento)**: `301 Moved Permanently`, `304 Not Modified`
- **4xx (Erro de Cliente)**: quem fez a requisição fez algo errado (`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`)
  - `401 Unathorized` o cliente não está autenticado
  - `403 Forbidden` o cliente está autenticado, mas não tem permissão
  - `404 Not Found` o servidor respondeu corretamente, falando que o recurso não existe
- **5xx (Erro de Servidor)**: o servidor falhou, apesar de a requisição estar correta (`500 Internal Server Error`, `503 Service Unavailable`)

### HTTPS

**Definição**: HTTPS é HTTP no topo de **TLS** (Transport Layer Security). É o mesmo protocolo com os mesmos métodos, mas toda a troca de mensagem é *encriptada* em trânsito. Seu propósito é impedir duas classes de ataque: **eavesdropping** (interceptação e leitura de dados em trânsito) e **tampering** (modificação de uma requisição/resposta em trânsito sem que nenhuma parte perceba). Também fornece autenticação para o servidor, via certificados.

### APIs

**Definição**: uma API (Application Programming Interface) é, especificamente no contexto web, um conjunto definido de URLs, métodos e formatos de requisições/respostas esperados que um programa expõe para que outro programa possa interagir com ele, sem que nenhum dos lados tenha que saber sobre a implementação interna do outro.

### Convenções REST

**Definição**: REST (Representational State Transfer) é um conjunto de convenções para fazer o design de APIs, onde cada URL identifica um **recurso** (um substantivo, uma coisa) e o método HTTP indica a **ação** sobre esse recurso (um verbo). Por exemplo

>
> GET /products -> lista todos os produtos
>
> GET /products/42 -> lista o produto 42 especificamente
>
> POST /products -> cria um produto novo
>
> PUT /products/42 -> substitui o produto 42 inteiramente
>
> PATCH /products/42 -> atualiza parcialmente o produto 42
>
> DELETE /products/42 -> deleta o produto 42

A regra é que a mesma URL pode ter significados diferentes dependendo do método usado nela. Um erro comum é colocar verbos nas URLs, como `/getProduct?id=42`, `/deleteProduct?id=42`.

**Recursos aninhados**: quando um recurso pertence a outro, a URL deve ser aninhada para refletir esse relacionamento.

>
> GET /users/7/orders -> todos os pedidos do usuário 7
>
> GET /users/7/orders/103 -> a ordem 103 do usuário 7
>

**Definição**: **query parameters** (parâmetros de busca, após o `?`) são para **filtragem**, ordenação ou para paginar uma coleção, não para identificação.

>
> GET /products?category=eletronics&inStock=true
> 

### Servidor Node/Express

**Definição**: Express é um framework minimalista de Node.js pra construir servidores HTTP. Ele lida com a conexão de baixo nível (escutar por conexões, parsear requisições) para que as rotas possam ser definidas diretamente, mapeando um método + URL para funções handler.

#### Setup

```js
const express = require("express");
const app = express();

app.use(express.json()); // middleware, parsea o corpo JSON da requisição em um req.body

app.listen(3000, () => {
    console.log("Server running on port 3000");
})
```

`app.listen(3000, ...)` começa o servidor, escutando por requisições HTTP na porta `3000`.


#### Definindo Rotas

Cada rota é `app.<method>(path, handler)`, um espelho direto da tabela REST:

```js
let products = [
    {id: 1, name: "Keyboard", price: 50},
    {id: 2, name: "Mouse", price: 25}
];

app.get("/products", (req, res) => {
    res.json(products);
});

app.get("/products/:id", (req, res) => {
    const product = products.find(p => p.id === Number(req.params.id));

    if(!product) return res.status(404).json({error: "Not found"});
    else res.json(product);
});

app.post("/products", (res, res) => {
    const newProduct = {id: products.length + 1, ...req.body};

    products.push(newProduct);

    res.status(201).json(newProduct);
});

app.delete("/products/:id", (req, res) => {
    products = products.filter(p => p.id !== Number(req.params.id));

    res.status(204).send();
});
```

`:id` é um parâmetro da rota. `/products/:id` bate com `products/42`, e `req.params.id` retorna a string `"42"`.

`req` é o objeto da requisição que chega: `req.params` (segmentos URL), `red.body` (corpo JSON parseado, via o middleware `express.json()`), `req.query` (parâmetros string da query).

`res` é o objeto de resposta, usado para enviar uma resposta: `res.json(data)` manda um JSON com `200` por padrão. `res.status(code)` define um código de status específico antes de mandar a resposta. `res.send()` envia uma resposta simples ou vazia.

O **middleware** (`app.use(express.json())`) é uma função que roda pra cada requisição que chega antes que ela alcance os handlers das rotas, tipicamente usado pra parsing, logging ou autenticação.

Esse servidor é exatamente o que está do outro lado da chamada `fetch("/api/products")`.

### Fetch

A assinatura completa do fetch é:

```js
fetch(url, options);
```

Onde `url` é o endpoint e `options` é um objeto controlando tudo sobre a requisição (método, headers, body). Ao omitir `options`, o padrão do `fetch` vira `GET`. Para fazer uma requisição `POST`:

```js
const response = await fetch("/api/products", {
    method: "POST",
    headers: {
        "Content-Type": "applications/json"
    },
    body: JSON.stringify({name: "Monitor", price: 200})
});

const created = await response.json();
```

As três partes de `options` são:
- `method`: a string verbo da tabela de métodos HTTP. Se omitido, o padrão é `GET`.
- `headers`: um objeto de metadados chave-valor. `"Content-Type": "applications/json"` fala pro servidor que o corpo sendo enviado é um JSON, e é isso que permite que o middleware `express.json()` parseie corretamente o `req.body` no servidor. Omitir esse header é um bug comum, pois o servidor não vai saber como interpretar o body.
- `body`: os dados reais sendo enviados, sendo um objeto convertido pra JSON pelo `JSON.stringify(...)` antes de ser enviado.

Um `delete` geralmente não tem body:

```js
await fetch("/api/products/42", {
    method: "DELETE"
});
```

### SQL vs NoSQL

#### Bases de Dados SQL

**Definição**: uma base dados relacional (SQL) guarda dados em **tabelas**, cada uma com um **schema** fixo, um conjunto pré-determinado de colunas com um tipo declarado ao qual cada linha na tabela deve obedecer.

```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL
);

INSERT INTO products (id, name, price) VALUES (1, "Keyboard", 50);

SELECT * FROM produts WHERE price < 100;
```

#### Relacionamentos em SQL

**Definição**: uma chave estrangeira (**foreign key**) é a coluna em uma tabela que referencia uma chave primária de outra tabela, expressando o relacionamento entre eles.

```sql
CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    product_id INTEGER,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

É isso que permite fazer `JOIN` em tabelas, combinando linhas de `orders` e `products` baseado em bater `product_id`/`id`, definindo a força do modelo relacional: relacionamentos estrutrados e impostos entre entidades distintas.

#### NoSQL (MongoDB)

**Definição**: MongoDB é uma base de dados NoSQL **orientada a documentos**. Dados são guardados como **documentos** (estruturas que parecem JSON) agrupados em **coleções**, sem nenhum schema imposto: documentos diferentes de uma mesma coleção podem ter campos diferentes.

```js
{
    _id: ObjectId("..."),
    name: "Keyboard",
    price: 50,
    tags: ["eletronics", "accessories"]
}

{
    _id: ObjectId("..."),
    name: "Mouse",
    price: 25
}
```

Um documento MongoDB é, estruturalmente, quase exatamente a mesma estrutura que objetos JSON, pois foi feito especificamente para guardar dados no mesmo formato que JS/JSON já usa, minimzando a tradução entre as respostas da API e os registros da base de dados.

SQL deve ser escolhido quando os dados tem relacionamentos claros e estáveis que precisam ser impostos, e que precisam de consistência garantida (são construídas ao redor de transações **ACID**, uma garantia que uma operação em vários passos ou é inteiramente completa ou nunca falha, nunca deixando dados meio alterados).

MongoDB/NoSQL deve ser escolhido quando o formato dos dados varia entre registros ou evolui frequentemente, e forçar um schema rígido causa mais atrito que benefícios, e quando dados naturalmente mapeam para documento aninhados em vez de várias tabelas menores relacionadas.

### Hashing de Senha com Bcrypt

**Definição**: uma função hash pega um input de qualquer tamanho e produz um output de tamanho fixo (o hash), com duas propriedades que importam: é **one-way** (computacionalmente inviável de reverter) e **determinístico** (o mesmo input sempre produz o mesmo output). A ideia é guardar o hash da senha em vez da senha em si em texto puro. Quando um usuário faz login, é feito o hash da senha e o hash resultante é comparado com o hash guardado. Se eles forem iguais, a senha está correta.

No entanto, uma função de hash genérica **não é suficiente**:
- Nesse caso, velocidade é uma vulnerabilidade, não uma feature. Funções de propósito geral de hash foram feitas pra serem rápidas, o que pode facilitar bruteforcing.
- bcrypt é deliberadamente lento, tornando bruteforces impráticos
- bcrypt automaticamente incorpora salt, que são dados aleatórios misturados em cada senha antes de fazer hashing, únicos por senha, para derrotar tabelas arco írics.

```js
const bcrypt = require("bcrypt");

// Registro: hash da senha antes de armazenar
async function registerUser(email, plainPassword){
    const hashedPassword = await bcrypt.hash(plainPassword, 10); // 10 = fator de custo
    // guardar {email, hashedPassword} na base de dados
}

// Login: comparar a senha digitada com o hash guardado
async function loginUser(email, plainPassword){
    const user = await findUserByEmail(email); // fetch {email, hashPassword} guardado

    const isMatch = await bcrypt.compare(plainPassword, user.hashedPassword);
    // senha correta -> gera uma sessão/token (JWT)
}
```

**OBS**: `bcrypt.compare` re-deriva o salt do hash guardado por si só.

## JWT (Json Web Token)

Como HTTP é stateless, cada requisição é independente e o servidor não tem memória de requisições passadas. Então como saber se um usuário está logado e quem ele é?

**Definição**: um JWT (JSON Web Token) é uma string compacta e auto-contida que codifica um conjunto de afirmações/reivindicações (dados sobre o usuário, como seu id), assinado criptograficamente pelo servidor, que um cliente guarda depois de logar e manda de volta com todas requisições futuras para provar sua identidade. Um JWT é constituído por três partes codificadas em base64, separada por pontos:

`header.payload.signature`

**Header** são metadados, como que algoritmo de assinatura foi usado. **Payload** são as afirmações/reivindicações em si, como `{userId: 42, email: "alec@example.com"}`. OBS: essa parte é só codificada, não encriptada, qualquer pessoa pode decodificar e ler. **O payload nunca deve conter senhas ou dados sensíveis**. **Signature** é uma chave secreta que só o servidor conhece.

**Definição**: assinar significa rodar o header + payload por uma função de criptografia junto com uma chave secreta. Verificar significa re-rodar a mesma computação e ver se os resultados batem. A propriedade crítica é que **qualquer pessoa pode ler o payload JWT, mas só quem tem a chave secreta pode produzir uma assinatura válida**.

**OBS**: perceba que é possível copiar o conjunto inteiro de header + payload + assinatura; por isso que HTTPS deve ser usado junto do JWT, além de coisas como limites de tempo de existência.

```js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Login: comparar a senha digitada com o hash guardado
async function loginUser(email, plainPassword){
    const user = await findUserByEmail(email); // fetch {email, hashPassword} guardado

    const isMatch = await bcrypt.compare(plainPassword, user.hashedPassword);
    
    const token = jwt.sign(
        {userId: user.id, email:user.email}, // payload
        process.env.JWT_SECRET, // chave secreta
        {expiresIn: "1h"} // reivindicação/afirmação
    );

    // enviar token de volta pro cliente, no corpo da resposta
}
```

O cliente guarda esse token (geralmente na memória, evitar colocar em `localStorage`) e envia ele em requisições seguintes, tipicamente como um header:

```js
fetch("api/orders", {
    headers: {
        Authorization: `Bearer ${token}`
    }
});
```

Verificando o token no servidor:

```js
function requireAuth(req, res, next){
    const authHeader = req.headers.authorization; // "Bearer token"

    const token = authHeader?.split(" ")[1];
    if(!token) return res.status(401).json({error: "No token provided"});

    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = payload.userId; // coloca a identidade na requisição pra handlers downstream

        next(); // passa controle pro próximo handler
    } catch{
        res.status(401).json({error: "Invalid or expired token"});
    }
}

app.get("/orders", requireAuth, (req, res) => {
    // req.userId está disponível aqui, e a requisição só chega aqui se o token era válido
});
```

### Conectando Frontend e Backend

Durante desenvolvimento, o app React e a API Express tipicamente rodam como dois processos separados, cada um escutando sua própria porta. Eles não são conectados automaticamente. O app React é só uma webpage, e para conseguir dados ele precisa fazer chamadas `fetch` pra URL do servidor Express, exatamente como se fosse uma API externa:

```js
const response = await fetch("https://localhost:3000/products");
```

#### CORS
**Definição**: CORS (Cross-Origin Resource Sharing) é uma política de segurança de browser que bloqueia a webpage de fazer requisições para uma origem diferente daquela da qual foi servida, a não ser que a outra origem explicitamente permita isso. `localhost:5173` e `localhost:3000` são origens diferentes (portas diferentes), então, por padrão, o browser bloqueia o `fetch` do app React ao Express.

A correção é fazer o servidor Express explicitamente declarar que aceita requisições do app React de origem:

```js
const cors = require("cors");

app.use(cors({origin: "https://localhost:5173"}));
```

Isso adiciona uma header de resposta (`Access-Control-Allow-Origin`) que fala pro browser que requisições daquela origem são permitidas. Nada muda do lado do app React.