# Javascript
## Arrow Functions
```js
const writeMyName = name => console.log(`Hello, my name is ${name}`);
// O parâmetro "name" recebe o que foi passado na chamada writeMyName(name)
```
Equivalente a:
```js
function writeMyName(name){
    console.log(`Hello, my name is ${name}`);
}
```

Pode ser usada como callback:
```js
let nums = [4, 62, 11, 90, 21, 30, 1, 89];

nums.sort((a,b) => a - b);
```

Pode estar em mais de uma linha:
```js
const divide = (a, b) => {
    if(b != 0){
        return a / b;
    } else {
        return 0;
    }
}
```

## Immediately-Invoked Function Expression (IIFE/Funções Imediatas)
Se vários arquivos diferentes usarem o mesmo nome de função, ocorrerá um problema de colisão de nomes.

A solução é uma função que é executada assim que é declarada e que utiliza variáveis globais, não poluindo o escopo global:
```js
(function(){

})()
```

## DOM
É possível criar elementos:
```js
const paragrafo = document.createElement('p'); // Cria um novo elemento <p> na memória (ainda não aparece na página)

paragrafo.innerText = 'Novo texto'; // Define o texto visível dentro de <p>

// Busca a div com id='div-mensagem' e coloca o <p> dentro dela
// Faz o elemento aparecer na página
document.getElementById('div-mensagem').appendChild(paragrafo);
```

## JSON
JSON são objetos transformados em strings em um formato específico, muito útil para trocar dados com um Web Service REST.
```js
let objeto = {
    nome: 'Roberto Carlos',
    idade: 999,
    cidade: 'Sao Carlos'
}

// Converte o objeto JS pra string JSON
/*
Resultado:
{
    'nome': 'Roberto Carlos',
    'idade': 999,
    'cidade': 'Sao Carlos'
}
*/
let meuJSON = JSON.stringify(objeto);

// Transforma uma sring JSON em objeto JS
let objeto2 = JSON.parse('{ "nome": "Roberto Carlos", "idade":999, "cidade":"Sao Carlos"}');
```

## Promises
Objeto que representa o resultado futuro de uma operação assíncrona.

Pode estar em 3 estados:
- **Pending**: ainda em execução;
- **Fulfilled**: concluída com sucesso;
- **Rejected**: ocorreu um erro.

Permitem tratar resultados futuros usando ```.then()``` para sucesso e ```.catch``` para erro.

Também podemos usar ```async``` (define uma função assíncrona) e ```wait``` (espera a Promise ser resolvida) para tornar o código mais simples/legítimo e fazer parecer síncrono.

## AJAX (Asynchronous JavaScript And XML)
Permite que as páginas da web seja atualizadas de forma assíncrona, trocando dados (requisições HTTP) com o servidos Web nos "bastidores", de forma que não seja preciso aguardar a resposta do servidor chegar.

Não é uma linguagem de programação nem uma biblioteca, é uma **técnica** que usa uma combinação de:
- Um objeto ```XMLHttpRequest``` interno do navegador (p/ solicitar dados de um servidor)
- JavaScript e DOM (p/ exibir ou ler os dados)

Pode ser feita *manualmente*, usando o objeto ```XMLHttpRequest```, ou usando *API Fetch* e *Promises*.

Exemplo de AJAX manual:
```js
// Criando o objeto responsável por fazer a requisição HTTP
var xhtpp = new XMLHttpRequest();

// Função que será chamada automaticamente toda vez que o estado da
// requisição mudar
// Há 5 estados, de 0 a 4
xhttp.onreadystatechange = function(){
    // readyState == 4 -> requisição concluída (resposta chegou)
    // status == 200 -> servidor respondeu com sucesso
    if(this.readyState == 4 && this.status == 200){
        // Convertendo a resposta em objeto
        let obj = JSON.parse(this.responseText);
        
        console.log(obj);
    }
}

// Configura a requisição
// Método GET, URL alvo, assíncrono true
xhttp.open('GET', 'minha_url', true);

// Dispara a requisição
xhttp.send();
```

Exemplo com API Fetch:
```js
// fetch() retorna uma promise
// Esse código NÃO TRAVA esperando a resposta
fetch(
    'minha_url',
    {method: 'GET', }
).then(function(response){ // Recebe o objeto response assim que o servidor responder
    // Verificação  de erros
    // ....

    // Converte o body da resposta json em objeto js
    // Também é assíncrono, então estamos retornando uma promise
    return response.json();
}).then(function(obj){ // Recebe o objeto js já convertido
    console.log(obj);
}).catch(err => console.error(err)); // Captura qualquer erro de rede ou das promises anteriores
```

ou

```js
// async transforma a função em assíncrona, permitindo usar await dentro dela
async function getDados(){
    // try/catch fazem o mesmo papel do .catch() (capturar error)
    try{
        // Await pausa a função até o fetch terminar
        // O resto do código fora dessa função continua rodando normalmente
        const res = await fetch('minha_url');

        if(!res.ok){ // ok é true para status 200-299
            throw new Error('Erro na requisição'); // Joga mensagem de erro pro catch
        }

        // Aguarda a conversão do JSON antes de continuar
        const data = await res.json();
        console.log(data);
    } catch (err){
        console.log(err);
    }
}
```

Exemplo real de API Fetch:
```js
async function getPokemon(type){
    try{
        // Faz um GET em pokeapi
        // Await espera a resposta chegar
        const res = await fetch('https://pokeapi.co/api/v2/type/');

        if(res.ok){ // Só processa se não tiver erro HTTP
            // Convertendo o body JSON em objeto JS
            const data = await res.json();
            const pkms = data.pokemon; // Acessa o array de pokemons dentro do objeto

            // Iterando sobre cada pokemon da lista
            for(let pkm of pkms){
                // Cada item tem a estrutura:
                /*
                {
                    pokemon: {
                        name,
                        url
                    }
                }
                */
                console.log(pkm.pokemon.name);
            }
        } else{
            throw new Error('Erro na requisição');
        }
    } catch(err){
        console.error(err);
    }
}

getPokemon('ice'); // Chama a função (não precisa de await, só dispara)
```

Exemplo de API Fetch com POST:
```js
// POST envia dados ao servidor
const response = await fetch('/api/usuarios', {
    method: 'POST',
    headers: {"Content-Type": "application/json"}, // Avisa ao servidor que o body é JSON
    body: JSON.stringify({ // Converte o objeto js em string JSON pra enviar
        nome: "Jurema",
        email:  "jurema747@escmail.com"
    })
})
```

Exemplo de carregamento de página:
```js
// Carrega o conteúdo HTML de outro arquivo e injeta na página atual
// Útil para Single Page Aplications (SPA) sem precisar de frameworks
async function load(caminho){
    try{
        const pagina = await fetch(caminho); // Baixa o arquivo HTML
        if(!pagina.ok){
            throw new Error(`Erro HTTP: ${pagina.status}`);
        }
        // .text() em vez de .json() porque queremos o HTML bruto como string
        const textoHTML = await pagina.text();

        // innerHTML injeta a string HTML dentro da div #conteudo
        // Renderiza os elemetnos na página
        document.getElementById('conteudo').innerHTML = textoHTML;
    } catch(erro){
        console.error(`Erro ao carregar conteúdo: ${erro}`);
    }
}
```

## HTTP
**Códigos de status das respostass HTTP**:
1. Respostas de informação (100-199);
2. Respostas de sucesso (200-299);
3. Redirecionamentos (300-399);
4. Erros do cliente (400-499);
5. Erros do servidor (500-599).

**GET**:
```js
fetch(
    url, {method: 'GET', }
).then(function(resposta){ // Verifica o status e converte o boddy
    if(resposta.status == 200){ // 200 = ok
        return resposta.json(); // Devolve a promise da conversão pro próximo .then()
    } else {
        console.log('erro');
        return []; // Retorna array vazio pro próximo .then() não quebrar
    }
}).then(function(objetos){ // Recebe o array de objetos já convertido
    for(let objeto of objetos){
        // Listar objetos
    }
})
```

**POST**:
```js
fetch(
    url, {
        method: 'POST',
        body: jsonobj, // Dados a serem criados no servidor (já em formato json)
    }
).then(function(resposta){
    if(resposta.status == 201){ // 201 = created
        return resposta.json(); // Retorna o objeto recém criado
    } else {
        console.log('erro');
        return [];
    }
}).then(function(objeto){
    listar(objeto); // Atualia a lista na tela c/ o novo item
    document.getEelementsByTagName('form')[0].reset(); // Limpa o formulário
})
```