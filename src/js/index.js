// ==============================
// FUNÇÕES DE CARROSEL DE IMAGENS
// ==============================

const swiper = new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
        delay: 5000,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    spaceBetween: 20,
    slidesPerView: 1,
});

// ==============
// FUNÇÕES DA API
// ==============

async function requisicao() {
    const url = 'https://kitsu.io/api/edge/anime?sort=popularityRank&page[limit]=20';

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Erro na requisição: " + response.status);
        }

        const data = await response.json();

        return data.data;

    } catch (error) {
        console.error('Erro na requisição:', error);
        alert("Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.");
    }
};

async function requisicaoAçãoAventura() {
    const url = 'https://kitsu.io/api/edge/anime?filter[genres]=action,adventure&sort=popularityRank&page[limit]=20';

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Erro na requisição: " + response.status);
        }

        const data = await response.json();

        return data.data;

    } catch (error) {
        console.error('Erro na requisição:', error);
        alert("Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.");
    }
};

// ================================================
// FUNÇÕES DE CRIAR E EXIBIR AS INFORMAÇÕES NA TELA
// ================================================

function criarAnimeElement(anime) {
    const animeDiv = document.createElement('div');
    animeDiv.classList.add('anime');

    const animeImageWrapper = document.createElement('div');
    animeImageWrapper.classList.add('anime-image-wrapper');

    const animeTitle = document.createElement('h2');
    animeTitle.textContent = anime.attributes.canonicalTitle;

    const animeImage = document.createElement('img');
    animeImage.src = anime.attributes.posterImage.small;
    animeImage.alt = anime.attributes.canonicalTitle;

    const animeSynopsis = document.createElement('p');
    animeSynopsis.textContent = anime.attributes.synopsis || "Sem descrição";

    const animeEpisodes = document.createElement('p');
    animeEpisodes.textContent = `Episodes: ${anime.attributes.episodeCount}`;

    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    overlay.appendChild(animeTitle);
    overlay.appendChild(animeSynopsis);
    overlay.appendChild(animeEpisodes);

    animeImageWrapper.appendChild(animeImage);
    animeImageWrapper.appendChild(overlay);
    animeDiv.appendChild(animeImageWrapper);

    return animeDiv;
};

async function exibirAnimes() {
    try {
        const animeListContainer = document.getElementById('anime-list');

        const animesPopulares = await requisicao();
        const animesAcaoAventura = await requisicaoAçãoAventura();
        const todosAnimes = [...animesPopulares, ...animesAcaoAventura];

        const fragment = document.createDocumentFragment();

        todosAnimes.forEach(anime => {
            const animeElement = criarAnimeElement(anime);
            fragment.appendChild(animeElement);
        });

        animeListContainer.innerHTML = '';
        animeListContainer.appendChild(fragment);

    } catch (error) {
        console.error('Erro ao exibir animes:', error);
        alert("Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.");
    }
};

exibirAnimes();

// =============================================================================================
// FUNÇÕES QUE EXIBE E ESCONDE O CAMPO DE PESQUISA E ALTERA A VISIBILIDADE DOS ÍCONES DE PESQUISA
// =============================================================================================

const campoDePesquisa = document.getElementById('campo-de-pesquisa');
const iconeDePesquisa = document.getElementById('icone-de-pesquisa');
const iconeDePesquisaCampo = document.getElementById('icone-de-pesquisa-campo');

function alterarExibicaoElementos(visible) {
    const displayValue = visible ? 'block' : 'none';

    campoDePesquisa.style.display = displayValue;
    iconeDePesquisaCampo.style.display = displayValue;
    iconeDePesquisa.style.display = visible ? 'none' : 'block';
}

iconeDePesquisa.addEventListener('click', () => {
    alterarExibicaoElementos(true);
});

iconeDePesquisaCampo.addEventListener('click', () => {
    alterarExibicaoElementos(false);
});

// ===================================================================================================
// FUNÇÕES QUE LIDAM COM A PESQUISA DE ANIMES E MANIPULAM A INTERFACE CONFORME OS RESULTADOS

// FUNÇÕES QUE REALIZAM A PESQUISA DE ANIMES NA API E ATUALIZAM A INTERFACE COM OS RESULTADOS

// FUNÇÕES QUE GERAM A PESQUISA DE ANIMES, EXIBINDO RESULTADOS OU MENSAGEM DE ERRO NA INTERFACE

// FUNÇÕES QUE MANIPULAM O CAMPO DE PESQUISA E EXIBEM ANIMES OU MENSAGEM DE ERRO COM BASE NO RESULTADO

// FUNÇÕES QUE REALIZAM A BUSCA POR ANIMES E ATUALIZAM A TELA COM OS RESULTADOS OU MENSAGEM DE ERRO
// ===================================================================================================

const telaInicial = document.querySelector('.swiper-container');
const animeList = document.getElementById('anime-list');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');
let requisicaoEmAndamento = false;
let campoDePesquisaAnterior = '';

async function requisicaoCampoDePesquisa() {
    let campoDePesquisa = document.getElementById('campo-de-pesquisa').value;

    if (requisicaoEmAndamento || campoDePesquisa === campoDePesquisaAnterior) return;

    campoDePesquisaAnterior = campoDePesquisa;
    requisicaoEmAndamento = true;

    document.getElementById('campo-de-pesquisa').disabled = true;

    const url = `https://kitsu.io/api/edge/anime?filter[text]=${campoDePesquisa}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const animeList2 = document.querySelector('.anime-list-2');
        animeList2.innerHTML = '';

        const errorMessage = document.querySelector('.anime-not-found');
        if (errorMessage) {
            errorMessage.remove();
        }

        if (data.data.length > 0) {
            data.data.forEach(anime => {
                const animeDiv = document.createElement('div');
                animeDiv.classList.add('anime');

                const animeImageWrapper = document.createElement('div');
                animeImageWrapper.classList.add('anime-image-wrapper');

                const animeTitle = document.createElement('h2');
                animeTitle.textContent = anime.attributes.canonicalTitle;

                const animeImage = document.createElement('img');
                animeImage.src = anime.attributes.posterImage.small;
                animeImage.alt = anime.attributes.canonicalTitle;

                const animeSynopsis = document.createElement('p');
                animeSynopsis.textContent = anime.attributes.synopsis || "Sem descrição";

                const animeEpisodes = document.createElement('p');
                animeEpisodes.textContent = `Episodes: ${anime.attributes.episodeCount}`;

                const overlay = document.createElement('div');
                overlay.classList.add('overlay');
                overlay.appendChild(animeTitle);
                overlay.appendChild(animeSynopsis);
                overlay.appendChild(animeEpisodes);

                animeImageWrapper.appendChild(animeImage);
                animeImageWrapper.appendChild(overlay);

                animeDiv.appendChild(animeImageWrapper);
                animeList2.appendChild(animeDiv);
            });

            animeList2.style.display = 'flex';
            telaInicial.style.display = 'none';
            animeList.style.display = 'none';
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        } else {
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('anime-not-found');
            errorMessage.innerHTML = '<p>Anime não encontrado.</p>';

            document.body.appendChild(errorMessage);

            telaInicial.style.display = 'none';
            animeList.style.display = 'none';
            animeList2.style.display = 'none';
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    } finally {
        requisicaoEmAndamento = false;
        document.getElementById('campo-de-pesquisa').disabled = false;
    };
};

document.getElementById('campo-de-pesquisa').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        requisicaoCampoDePesquisa();
    }
});

// ================================================================
// FUNÇÃO DO CARROSEL DA LISTA DOS ANIMES QUE SÃO EXIBIDOS PELA API
// ================================================================

document.addEventListener('DOMContentLoaded', function () {
    const nextButton = document.getElementById('next');
    const prevButton = document.getElementById('prev');
    const animeList = document.getElementById('anime-list');

    const containerWidth = animeList.offsetWidth;

    nextButton.addEventListener('click', function () {
        animeList.scrollBy({
            left: containerWidth,
            behavior: 'smooth'
        });
    });

    prevButton.addEventListener('click', function () {
        animeList.scrollBy({
            left: -containerWidth,
            behavior: 'smooth'
        });
    });
});

// =======================================
// FUNÇÃO DE BLOQUEIO DO SCROLL HORIZONTAL
// =======================================

window.addEventListener('touchmove', function (e) {
    if (window.scrollX !== 0) {
        window.scrollTo(0, 0);
    }
}, { passive: false });