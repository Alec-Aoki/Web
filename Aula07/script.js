let refri = {};
let totalAtual = 0;

/* Lista de refrigerantes */
// Função para pegar a lista de refris
async function getRefris(){
    try{
        const res = await fetch('https://api.jsonbin.io/v3/b/69d64173aaba882197d7779a');
        if(res.ok){
            const data = await res.json();
            const bebidas = data.record.bebidas;
            let refris = [];
            for(let beb of bebidas){
                refris.push({
                    sabor: beb.sabor,
                    preco: beb.preco,
                    img: beb.imagem
                });
            }
            return refris;
        }
    } catch(err){
        console.log(err);
    }
}

// Função para add. os refris no DOM
async function addRefris(){
    try{
        const refs = await getRefris();
        for(let ref of refs){
            const divRef = document.createElement('div');
            divRef.id = ref.sabor;
            document.getElementById('refris').appendChild(divRef);

            const botao = document.createElement('button');
            botao.innerText = `${ref.sabor} (R\$${ref.preco})`;
            document.getElementById(ref.sabor).appendChild(botao);

            botao.addEventListener('click', function(e){
                refri = ref;
                document.getElementById('mensagem').innerHTML = '';
                const mensagem = document.createElement('h2');
                document.getElementById('mensagem').append(mensagem);
                document.getElementById('mensagem').querySelector('h2').innerText = `Selecionado: ${ref.sabor}`;

                const imagem = document.createElement('img');
                imagem.src = ref.img;
                document.getElementById('mensagem').appendChild(imagem);
                checkLiberarRefri();
            });

            const imagem = document.createElement('img');
            imagem.src = ref.img;
            document.getElementById(ref.sabor).appendChild(imagem);
        }
    } catch(err){
        console.log(err);
    }
}

addRefris();

function checkLiberarRefri(){
    if(totalAtual >= refri.preco && refri.sabor != ''){
        document.getElementById('mensagem').innerHTML = '';
        const mensagem = document.createElement('h2');
        document.getElementById('mensagem').append(mensagem);
        document.getElementById('mensagem').querySelector('h2').innerText = `${refri.sabor} liberado!`;
        document.getElementById('visor').querySelector('h2').innerText = `Total inserido: 0 \n Troco: ${totalAtual - refri.preco}`;
        totalAtual = 0;
        refri.sabor = '';
        refri.preco = 0;
    }
}

/* Dropzone */
const valores = {'c25': 0.25, 'c50': 0.5, 'r1': 1.0};

const items = document.getElementsByClassName('item');
const dropzones = document.getElementsByClassName('dropzone');

for(let item of items) {
    item.draggable = true;
    item.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('item.id', e.currentTarget.id);
    });
}
for(let zone of dropzones) {
    zone.addEventListener('drop', function (e) {
        const id = e.dataTransfer.getData('item.id');

        if(zone.classList.contains(id)){
            totalAtual += valores[id];
            document.getElementById('visor').querySelector('h2').innerText = `Total inserido: ${totalAtual}`;
        }

        checkLiberarRefri();
    })
    zone.addEventListener('dragover', function (e) {
        e.preventDefault();
    });
}