// ====================
// FUNÇÕES DO CARROSSEL
// ====================

const prevButton = document.querySelector('.seta-voltar');
const nextButton = document.querySelector('.seta-proximo');
const marcadores = document.querySelectorAll('.marcador');
const slide = document.getElementById('slide');
const slideMobile = document.getElementById('slide-mobile');
const images = slide.querySelectorAll('img');
const mobileImages = slideMobile.querySelectorAll('img');

let currentIndex = 0;
let mobileIndex = 0;

function getContainerWidth(slideElement) {
    return slideElement.clientWidth;
}

function updateActiveMarker(index) {
    marcadores.forEach((marcador, i) => {
        if (i === index) {
            marcador.classList.add('ativo');
        } else {
            marcador.classList.remove('ativo');
        }
    });
}

function scrollToSlide(index, slideElement) {
    const containerWidth = getContainerWidth(slideElement);
    slideElement.scrollTo({
        left: containerWidth * index,
        behavior: 'smooth'
    });

    updateActiveMarker(index);
}

nextButton.addEventListener('click', function () {
    const nextIndex = currentIndex + 1 < images.length ? currentIndex + 1 : 0;
    currentIndex = nextIndex;
    scrollToSlide(currentIndex, slide);

    const mobileNextIndex = mobileIndex + 1 < mobileImages.length ? mobileIndex + 1 : 0;
    mobileIndex = mobileNextIndex;
    scrollToSlide(mobileIndex, slideMobile);
});

prevButton.addEventListener('click', function () {
    const prevIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : images.length - 1;
    currentIndex = prevIndex;
    scrollToSlide(currentIndex, slide);

    const mobilePrevIndex = mobileIndex - 1 >= 0 ? mobileIndex - 1 : mobileImages.length - 1;
    mobileIndex = mobilePrevIndex;
    scrollToSlide(mobileIndex, slideMobile);
});

marcadores.forEach((marcador, index) => {
    marcador.addEventListener('click', function () {
        currentIndex = index;
        scrollToSlide(index, slide);
        mobileIndex = index;
        scrollToSlide(index, slideMobile);
    });
});

function autoSlide() {
    const nextIndex = currentIndex + 1 < images.length ? currentIndex + 1 : 0;
    currentIndex = nextIndex;
    scrollToSlide(currentIndex, slide);

    const mobileNextIndex = mobileIndex + 1 < mobileImages.length ? mobileIndex + 1 : 0;
    mobileIndex = mobileNextIndex;
    scrollToSlide(mobileIndex, slideMobile);
}

let autoSlideInterval = setInterval(autoSlide, 4000);

document.addEventListener('DOMContentLoaded', function () {
    updateActiveMarker(0);
});

// ================================
// FUNÇÃO DE TROCAR COR DO HEADER
// ================================

const header = document.querySelector('header');
const mediaQuery = window.matchMedia('(max-width: 500px)');

function handleScroll() {
    let scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > 2) {
        header.style.backgroundColor = '#23252b';
    } else {
        header.style.backgroundColor = 'rgba(35, 37, 43, 0.1)';
    }
}

if (mediaQuery.matches) {
    window.addEventListener('scroll', handleScroll);
} else {
    window.removeEventListener('scroll', handleScroll);
}

mediaQuery.addEventListener('change', function () {
    if (mediaQuery.matches) {
        window.addEventListener('scroll', handleScroll);
    } else {
        window.removeEventListener('scroll', handleScroll);
    }
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
        const telaDeCarregamento = document.getElementById('loading-screen');
        telaDeCarregamento.style.display = 'flex';

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

        telaDeCarregamento.style.display = 'none';

    } catch (error) {
        console.error('Erro ao exibir animes:', error);
        alert("Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.");

        document.getElementById('loading-screen').style.display = 'none';
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

const animeList = document.getElementById('anime-list');
const containerCarrossel = document.querySelector('.container-carrossel');
const containerAnimeList = document.querySelector('.container-anime-list');
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
        const telaDeCarregamento = document.getElementById('loading-screen');
        telaDeCarregamento.style.display = 'flex';

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

            telaDeCarregamento.style.display = 'none';
            containerAnimeList.style.display = 'none';
            containerCarrossel.style.display = 'none';
            animeList2.style.display = 'flex';
            animeList.style.display = 'none';
        } else {
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('anime-not-found');
            errorMessage.innerHTML = '<p>Anime não encontrado.</p>';

            document.body.appendChild(errorMessage);

            telaDeCarregamento.style.display = 'none';
            containerAnimeList.style.display = 'none';
            containerCarrossel.style.display = 'none';
            animeList.style.display = 'none';
            animeList2.style.display = 'none';
        }
    } catch (error) {
        console.error('Erro na requisição:', error);

        document.getElementById('loading-screen').style.display = 'none';
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

const prevButtonList = document.querySelector('.seta-voltar-lista');
const nextButtonList = document.querySelector('.seta-proximo-lista');

document.addEventListener('DOMContentLoaded', function () {
    const animeList = document.getElementById('anime-list');

    function getContainerWidth() {
        return slide.clientWidth;
    }

    prevButtonList.addEventListener('click', function () {
        const containerWidth = getContainerWidth();

        animeList.scrollBy({
            left: -containerWidth,
            behavior: 'smooth'
        });
    });

    nextButtonList.addEventListener('click', function () {
        const containerWidth = getContainerWidth();

        animeList.scrollBy({
            left: containerWidth,
            behavior: 'smooth'
        });
    });
});