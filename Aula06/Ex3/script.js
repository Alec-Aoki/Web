async function getSubpage(subpg){
    try{
        const pag = await fetch(subpg);
        let pagtxt = await pag.text();
        document.getElementById('content').innerHTML = pagtxt;
    } catch(err){
        console.log(err);
    }
}

getSubpage('./subpages/huntrx.html');

const links = document.querySelectorAll('nav a');
for(let link of links){
    link.addEventListener('click', function(e){
        e.preventDefault();
        let subpg = e.target.getAttribute('href').replace('#', '');
        subpg = `./subpages/${subpg}.html`;
        getSubpage(subpg);
    });
}

