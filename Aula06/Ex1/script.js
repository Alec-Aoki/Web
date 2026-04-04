async function getHeroi(){
    try{
        const res = await fetch('https://api.jsonbin.io/v3/b/69c30947aa77b81da9170645');
        if(res.ok){
            const data = await res.json();
            const herois = data.record.heroisdc;
            let hrs = [];
            for(let hr of herois){
                hrs.push({
                    heroi: hr.heroi,
                    nome: hr.nome,
                    data: hr.criacao,
                    img: hr.img
                });
            }
            return hrs;
        }
    } catch(err){
        console.log(err);
    }
}

async function addHerois(herois){
    try{
        const hrs = await getHeroi();
        for(let hr of hrs){
            const divHeroi = document.createElement('div');
            divHeroi.id = hr.heroi;
            document.body.appendChild(divHeroi);

            const titulo = document.createElement('h2');
            titulo.innerText = `${hr.heroi}: ${hr.nome} (${hr.data})`;
            document.getElementById(hr.heroi).appendChild(titulo);

            const imagem = document.createElement('img');
            imagem.src = hr.img;
            document.getElementById(hr.heroi).appendChild(imagem);
        }
    } catch(err){
        console.log(err);
    }
}

addHerois();