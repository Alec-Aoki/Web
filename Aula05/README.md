# Javascript
## Declaração de variáveis
- ```var```: global, evitar
- ```let```: local (escopo de bloco)
- ```const```: constante (escopo de bloco)

## Tipagem fraca
- ```string + int```: transforma o *int* em *string* e concatena
- ```string - int```: trasnforma a *string* em *int* e subtrai

Usar ```parseInt()```, ```parseFloat()``` e ```toString()```.

Tipos:
- *boolean*: verdadeiro/falso;
- *null*: atribuído;
- *undefined*: propriedade cujo valor não está definido;
- *number*: valor inteiro ou ponto flutuante;
- *bigInt*: número com precisão arbitrária;
- *string*: seq. de caracteres;
- *symbol*: tipos de dados cujas instâncias são únicas e imutáveis;
- *object*: objetos genéricos.

## Template strings
```js
let a = 5;
let b = 10;
console.log(`Quinze é ${a + b}`);
```

## Funções
```js
function soma_imprime(a, b){
    console.log(`${a + b}`);
}

function soma(a, b){
    return a + b;
}
```

**Funções anônimas**: funções sem um nome que são atribuídas a uma variável (EVITAR)
```js
const somaImprime = function(a,b){
    console.log(`${a + b}`);
}

somaImprime(3, 4);
```

## Objetos
Entidade independente, com propriedades e tipos. Em js, tudo é objeto, inclusive funções
```js
let myCar = new Object():
myCar.make = 'Ford';
myCar.model = 'Mustang';
myCar.year = 2015;
```

```js
let myCar = {make:'Ford', model:'Mustang', year: 2015};
```

```js
let myCar = new Object():
myCar['make'] = 'Ford';
myCar['model'] = 'Mustang';
myCar['year'] = 2015;
```

Objetos também podem ter funções
```js
let person = {
    firstName: 'Roger',
    lastName: 'Gracie',
    age: '40',
    fullName: function(){
        return this.firstName + ' ' + this.lastName;
    }
};
```

## Classes
Permitem instanciar objetos que compartilham as mesmas propriedades.
```js
class Hero{
    constructor(name, level){
        this.name = name;
        this.level = level;
    }
    hello(){
        return `${this.name} says Wassup.`
    }
}

let myHero = new Hero('Spiderman', 100)
```

Heranças são feitas com a declaração ```extends```:
```js
class Mage extends Hero{
    constructor(name, level, spell){
        super(name, level);
        this.spell = spell;
    }
}
```

## Arrays
**Heterogêneros**: fracamente tipado (pode misturar vários tipos em um array), mas evitar misturar

Métodos importantes:
- ```.sort()```: ordena, mas considera os elementos como string;
- ```.pop()```: extrai o último elemento do array;
- ```.shift()```: extrai o prfruits.imeiro elemento do array;
- ```.push(elemento)```: adiciona um item;
- ```.splice(pos, n)```: extrain *n* itens a partir da posição *pos*.

Funções importantes:
- forEach
    ```js
    let arr = [3, 5, 7, 11];

    for(let i of array){
        console.log(i);
    }
    ```

    ```js
    let fruits = ['Apple', 'Orange', 'Banana', 'Mango'];

    fruits.forEach(function(item, index, array){
        console.log(item, index);
    });
    ```
- filter
  - Filtra os itens de acordo com uma função
    ```js
    let heroes = [
        {name: 'Batman', franchise: 'DC'},
        {name: 'Ironman', franchise: 'Marvel'},
        {name: 'Thor', franchise: 'Marvel'},
        {name: 'Superman', franchise: 'DC'}
    ];

    let marvelHeroes = heroes.filter(function(hero){
        return hero.franchise == 'Marvel';
    })
    ```

## Funções Callback
Funções passadas como parâmetros de outras funções.

```js
let nums = [4, 62, 11, 90, 21, 30, 1, 89];

let escrever = function(valor, index, nums){
    console.log(`O valor do índice ${index} do array é ${valor}`);
};

nums.forEach(escrever);
```

```js
let nums = [4, 62, 11, 90, 21, 30, 1, 89];

nums.forEach(function(valor, index)){
    console.log(`O valor do índice ${index} do array é ${valor}`);
};
```

```js
let nums = [4, 62, 11, 90, 21, 30, 1, 89];
 
// Ordenando como int e não como string
nums.sort(function(a, b)){
    return a - b;
};
```

```js
function somar(a, b){
    return a + b;
}

function imprimeCalculo(meuCalculo, a, b){
    const result = meuCalculo(a, b);
    console.log('Resultado: ' + result);
}

imprimeCalculo(soma, 34, 12);
```

## DOM (Document Object Model)
Interface multiplataforma que trata um documento HTML como uma estrutura de árvore em que cada nó é um objeto que representa uma parte do documento.

Encontrar elementos (retornam um HTMLCollection):
- Pelo id: ```document.getElementById(id)```
- Pela tag HTML: ```document.getElementByTagName(name)```
- Pela classe CSS: ```document.getElementByClassName(name)```

Acessando itens do elemento:
- Conteúdo do elemento: ```element.innerHTML```
- Atributo específico: ```element.[attribute]```
- Propriedade específica do estilo: ```element.style.[property]```

```js
document.getElementById('meuId').style.display = 'none';

document.getElementById('outroId').classList.add('minhaClasse');

document.getElementByTagName('main')[0].innerHTML = 'Olá mundo!';

document.getElementsByClassName('link')[0].target = '_blank'
```

Há ainda dois outros métodos seletores:
- ```document.querySelector```: retorna o primeiro elemento que corresponde a um ou mais seletores CSS especificados no documento
- ```document.querySelectorAll```: retorna todos os elementos que possuem os seletores especificados (NodeList)

```js
document.querySelectorAll('div .item'); // Retorna todas as divs que possuem a classe .item

document.querySelectorAll('[wm-box] .item'); // Retorna todos os elementos que possuem a classe .item e o atributo wm-box
```

## Eventos
Um acontecimento envolvendo alguma atitude:
- **Do usuário**: movimentar o mouse, pressionar uma tecla, enviar um forms etc.;
- **Do funcionamento do navegador**: carregamento de uma página para a exibição, não conseguir carregar uma imagem, pop-up, etc.

**On click** (duas formas pra qndo. o usuário clicar no elemento):
```html
<button id='botaoSoma' onclick='soma()'> Somar </button>
```
```js
document.getElementById('botaoSoma').onclick = somar;
```

**On focus out** (quando o usuário tira o foco do elemento, mto usado p/ validação de forms.):

```html
<input onfocusout='validar()' type='text' name='nome'>
```

**On mouse over**/**on mouse out** (dispara uma função qndo. o usuário passa o mouse sobre/fora do elem. HTML):
```html
<div onmouseover='mOver(this)' onmouseout='mOut(this)'>
    Passe o mouse
</div>

<script>
    function mOver(obj){
        obj.innerHTML = 'Obrigado';
    }
    function mOut(obj){
        obj.innerHTML = 'Passe o mouse';
    }
</script>
```