let form1 = document.querySelector('#form1');
let resultado = document.querySelector('#resultados');

form1.addEventListener('submit', function (event) {
    event.preventDefault();

    const dadosForm = new FormData(form1);
    const parametros = new URLSearchParams(dadosForm).toString();
    resultado.innerHTML = '';

    buscarFilmes(parametros);
});

function buscarFilmes(parametros) {
    console.log('Parametros enviados:', parametros);
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjN2U1ZjRkMjYwZDM2Y2VjYWJhODU4ZTg3M2UxNTQ3YSIsInN1YiI6IjY1M2U5YjQ5NTE5YmJiMDBmZTVkMGI5YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KMBr7BvoTAiljylflKQWXF3NQgz7_r0nORXXmPQaIyI'
        }
    };

    fetch('https://api.themoviedb.org/3/search/movie?include_adult=false&language=pt-BR&page=1&'+parametros, options)
        .then(response => {
            if (response.ok) {
                console.log('Deu bom!', response.status);
                return response.json();
            } else {
                console.log('Deu ruim!');
                throw new Error('Erro na primeira busca');
            }
        })
        .then(data=>{
            console.log(data);
            let filmes = data.results;
            if (filmes && filmes.length > 0) {
                const primeiroFilme = filmes[0];
                const tituloOriginal = primeiroFilme.original_title;
                console.log('Título original:', tituloOriginal);
                filme(tituloOriginal);
            } else {
                console.log('Nenhum filme encontrado.');
            }
        })
        .catch(error => {
            console.error('Erro na busca de filmes:', error);
        });
}


function filme(tituloOriginal) {
    console.log('Título original enviado:', tituloOriginal);
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: new Headers({
           "ngrok-skip-browser-warning": true,
        }),
    };
    console.log('URL da solicitação fetch:', `https://3635-104-196-129-7.ngrok-free.app/?query=${encodeURIComponent(tituloOriginal)}`);

    fetch(`https://3635-104-196-129-7.ngrok-free.app/?query=${encodeURIComponent(tituloOriginal)}`, options)
        .then(response => {
            if (response.ok) {
                console.log("Iiiihhhaaa");
                return response.json();
            } else {
                console.log("Rapaaaiiizzzz. Status:", response.status);
                throw new Error('Erro na segunda busca');
            }
        })
        .then(data => {
            console.log('Dados recebidos da segunda busca:', data);
            if (Array.isArray(data) && data.length > 0) {
                let filmes = data;
        
                filmes.forEach((filme) => {
                    let card = document.createElement('div');
                    card.className = 'col-md-4 card'; // Adicione a classe 'card'
                    card.innerHTML = `
                        <div class="frente">
                            <img src="${filme.poster}" alt="">
                        </div>
                        <div class="costas">
                            <h2 class="titulo">${filme.title}</h2>
                            <p class="nota">${filme.vote_average.toFixed(1)}</p>
                            <p class="generos">${filme.genres.slice(0, 3).join(', ')}</p>
                            <p class="elenco">${filme.elenco.slice(0, 3).join(', ')}</p>
                            <p class="data">${new Date(filme.data).getFullYear()}</p>
                        </div>
                    `

                    resultado.appendChild(card)

                    card.addEventListener('click', function () {
                        card.classList.toggle('flip');
                    });
                });
            } else {
                console.log('Nenhum dado válido recebido da segunda busca.');
            }
        })
}