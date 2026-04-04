# Javascript
## Arrow Functions
```js
const writeMyName = name => console.log(`Hello, my name is ${name}`);
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
const paragrafo = document.createElement('p'); /* Criando elemento*/
paragrafo.innerText = 'Novo texto';
document.getElementById('div-mensagem').appendChild(paragrafo); /* Adicionando o elemento ao documento */
```

## JSON
JSON são objetos transformados em strings em um formato específico, muito útil para trocar dados com um Web Service REST.
```js
let objeto = {
    nome: 'Roberto Carlos',
    idade: 999,
    cidade: 'Sao Carlos'
}

let meuJSON = JSON.stringify(objeto); /* Transformando objeto em JSON */

let objeto2 = JSON.parse('{ "nome": "Roberto Carlos", "idade":999, "cidade":"Sao Carlos"}'); /* Transformando JSON em objeto */
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
var xhtpp = new XMLHttpRequest();
xhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
        let obj = JSON.parse(this.responseText);
        console.log(obj);
    }
}

xhttp.open('GET', 'minha_url', true);
xhttp.send();
```

Exemplo com API Fetch:
```js
fetch(
    'minha_url',
    {method: 'GET', }
)
.then(function(response){
    // Verificação  de erros
    return response.json();
})
.then(function(obj){
    console.log(obj);
})
.catch(err => console.error(err));
```

ou

```js
async function getDados(){
    try{
        const res = await fetch('minha_url');
        if(!res.ok){
            throw new Error('Erro na requisição');
        }
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
        const res = await fetch('https://pokeapi.co/api/v2/type/');
        if(res.ok){
            const data = await res.json();
            const pkms = data.pokemon;
            for(let pkm of pkms){
                console.log(pkm.pokemon.name);
            }
        } else{
            throw new Error('Erro na requisição');
        }
    } catch(err){
        console.error(err);
    }
}

getPokemon('ice');
```

Exemplo de API Fetch com POST:
```js
const response = await fetch('/api/usuarios', {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        nome: "Jurema",
        email:  "jurema747@escmail.com"
    })
})
```

Exemplo de carregamento de página:
```js
async function load(caminho){
    try{
        const pagina = await fetch(caminho);
        if(!pagina.ok){
            throw new Error(`Erro HTTP: ${pagina.status}`);
        }
        const textoHTML = await pagina.text();
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
fetch(url, {method: 'GET', })
.then(function(resposta){
    if(resposta.status == 200){
        return resposta.json();
    } else {
        console.log('erro');
        return [];
    }
}).then(function(objetos){
    for(let objeto of objetos){
        // Listar objetos
    }
})
```

**POST**:
```js
fetch(url, {
    method: 'POST',
    body: jsonobj,
}).then(function(resposta){
    if(resposta.status == 201){
        return resposta.json();
    } else {
        console.log('erro');
        return [];
    }
}).then(function(objeto){
    listar(objeto);
    document.getEelementsByTagName('form')[0].reset();
})
```