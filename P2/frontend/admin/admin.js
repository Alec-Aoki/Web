const API_URL = 'http://localhost:3000/pocoes';

async function carregarPocoes(){
    try{
        const res = await fetch(API_URL);

        if(res.ok){
            const data = await res.json();

            const lista = document.getElementById('lista-pocoes');
            lista.innerHTML = '';

            data.forEach(function(pocao){
                const li = document.createElement('li');
                li.innerHTML = `
                    <span><strong>${pocao.nome}</strong> — ${pocao.preco} moedas</span>
                    <button onclick="removerPocao('${pocao.slugNome}')">Remover</button>
                `;
                lista.appendChild(li);
            });
        }
    } catch(err){
        console.log(err);
    }
}

async function removerPocao(slug){
    try{
        const res = await fetch(`${API_URL}/${slug}`, {method:"DELETE"});

        if(res.ok){
            carregarPocoes();
        }
    } catch(err){
        console.log(err);
    }
}

const form = document.getElementById('form-pocao');

// Função p/ transformar o nome da poção em slug
// pra ser PK
function gerarSlug(nome){
    return nome
        .normalize('NFD') // Separa letra de seus acentos
        .replace(/[\u0300-\u036f]/g, '') // Remove os acentos isolados
        .replace(/\s+/g, ''); // Remove espaços
}

form.addEventListener('submit', async function(event){
    event.preventDefault(); // Impede o form de recarregar a página

    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const imagem = document.getElementById('imagem').value;
    const preco = document.getElementById('preco').value;

    const novaPocao = {
        slugNome: gerarSlug(nome),
        nome: nome,
        descricao: descricao,
        imagem: imagem,
        preco: Number(preco) // input.value sempre vem como string, precisamos converter
    };

    try{
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(novaPocao)
        });

        if(res.ok){
            form.reset();
            carregarPocoes();
        }
    } catch(err){
        console.log(err);
    }
});

carregarPocoes();