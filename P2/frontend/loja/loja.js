const API_URL = 'http://localhost:3000/pocoes';

async function carregarProdutos(){
    try{
        const res = await fetch(API_URL);

        if(res.ok){
            const data = await res.json();

            const container = document.getElementById('lista-produtos');
            container.innerHTML = '';

            data.forEach(function(pocao){
                const card = document.createElement('div');
                card.className = 'produto-card';
                card.innerHTML = `
                    <img src="${pocao.imagem}" alt="${pocao.nome}">
                    <h3>${pocao.nome}</h3>
                    <p>${pocao.descricao}</p>
                    <strong>${pocao.preco} moedas</strong>
                    <button>Comprar</button>
                `;
                container.appendChild(card);
            });
        }
    } catch(err){
        console.log(err);
    }
};

carregarProdutos();