let series = [];
let seriesExibidas = [];
let ordemCrescente = false;

const listaSeries = document.getElementById("listaSeries");
const status = document.getElementById("status");

const btnBuscar = document.getElementById("btnBuscar");
const btnOrdenar = document.getElementById("btnOrdenar");

const pesquisa = document.getElementById("pesquisa");
const filtroGenero = document.getElementById("filtroGenero");
const filtroAno = document.getElementById("filtroAno");

const totalSeries = document.getElementById("totalSeries");
const serieAntiga = document.getElementById("serieAntiga");
const serieRecente = document.getElementById("serieRecente");


// 1. Carregar as séries do arquivo JSON

async function carregarSeries() {

    try {

        status.textContent = "Carregando séries...";

        const resposta = await fetch("series.json");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar o arquivo JSON.");
        }

        const dados = await resposta.json();

        series = dados.series;

        seriesExibidas = [...series];

        preencherFiltros();

        mostrarSeries(seriesExibidas);

        atualizarEstatisticas();

        status.textContent = `${series.length} séries carregadas com sucesso.`;

    } catch (erro) {

        status.textContent = `Erro ao carregar as séries: ${erro.message}`;

    }

}


// 2. Exibir as séries em cards

function mostrarSeries(lista) {

    listaSeries.innerHTML = "";

    if (lista.length === 0) {

        listaSeries.innerHTML = `
            <p class="mensagem-vazia">
                Nenhuma série encontrada.
            </p>
        `;

        return;

    }

    lista.forEach((serie) => {

        const card = document.createElement("div");

        card.classList.add("card");

        const imagem = document.createElement("img");

        imagem.src = serie.imagem;
        imagem.alt = `Imagem da série ${serie.titulo}`;
        imagem.classList.add("imagem-serie");

        imagem.onerror = function () {
            this.style.display = "none";
        };

        const conteudo = document.createElement("div");

        conteudo.classList.add("conteudo-card");

        const titulo = document.createElement("h2");

        titulo.textContent = serie.titulo;

        const ano = document.createElement("p");

        ano.innerHTML = `<strong>Ano:</strong> ${serie.ano}`;

        const genero = document.createElement("p");

        genero.innerHTML = `<strong>Gênero:</strong> ${serie.genero}`;

        const temporadas = document.createElement("p");

        temporadas.innerHTML =
            `<strong>Temporadas:</strong> ${serie.temporadas}`;

        conteudo.appendChild(titulo);
        conteudo.appendChild(ano);
        conteudo.appendChild(genero);
        conteudo.appendChild(temporadas);

        card.appendChild(imagem);
        card.appendChild(conteudo);

        listaSeries.appendChild(card);

    });

}


// 3. Preencher os filtros de gênero e ano

function preencherFiltros() {

    const generos = [...new Set(
        series.map((serie) => serie.genero)
    )].sort();

    const anos = [...new Set(
        series.map((serie) => serie.ano)
    )].sort((a, b) => a - b);

    filtroGenero.innerHTML = `
        <option value="">Todos os gêneros</option>
    `;

    filtroAno.innerHTML = `
        <option value="">Todos os anos</option>
    `;

    generos.forEach((genero) => {

        const opcao = document.createElement("option");

        opcao.value = genero;
        opcao.textContent = genero;

        filtroGenero.appendChild(opcao);

    });

    anos.forEach((ano) => {

        const opcao = document.createElement("option");

        opcao.value = ano;
        opcao.textContent = ano;

        filtroAno.appendChild(opcao);

    });

}


// 4. Pesquisar e aplicar os filtros

function filtrarSeries() {

    const texto = pesquisa.value.toLowerCase().trim();

    const generoSelecionado = filtroGenero.value;

    const anoSelecionado = filtroAno.value;

    seriesExibidas = series.filter((serie) => {

        const correspondeTitulo = serie.titulo
            .toLowerCase()
            .includes(texto);

        const correspondeGenero =
            generoSelecionado === "" ||
            serie.genero === generoSelecionado;

        const correspondeAno =
            anoSelecionado === "" ||
            String(serie.ano) === anoSelecionado;

        return correspondeTitulo &&
            correspondeGenero &&
            correspondeAno;

    });

    if (ordemCrescente) {

        seriesExibidas.sort((a, b) => a.ano - b.ano);

    }

    mostrarSeries(seriesExibidas);

    status.textContent =
        `${seriesExibidas.length} série(s) encontrada(s).`;

}


// 5. Ordenar por ano

function ordenarPorAno() {

    ordemCrescente = true;

    seriesExibidas.sort((a, b) => a.ano - b.ano);

    mostrarSeries(seriesExibidas);

    status.textContent = "Séries ordenadas da mais antiga para a mais recente.";

}


// 6. Calcular as estatísticas

function atualizarEstatisticas() {

    if (series.length === 0) {

        totalSeries.textContent = "Total de séries: 0";

        serieAntiga.textContent = "Série mais antiga: -";

        serieRecente.textContent = "Série mais recente: -";

        return;

    }

    const seriesOrdenadas = [...series].sort(
        (a, b) => a.ano - b.ano
    );

    const maisAntiga = seriesOrdenadas[0];

    const maisRecente = seriesOrdenadas[seriesOrdenadas.length - 1];

    totalSeries.textContent =
        `Total de séries: ${series.length}`;

    serieAntiga.textContent =
        `Série mais antiga: ${maisAntiga.titulo} (${maisAntiga.ano})`;

    serieRecente.textContent =
        `Série mais recente: ${maisRecente.titulo} (${maisRecente.ano})`;

}


// 7. Configurar os eventos

btnBuscar.addEventListener("click", carregarSeries);

pesquisa.addEventListener("input", filtrarSeries);

filtroGenero.addEventListener("change", filtrarSeries);

filtroAno.addEventListener("change", filtrarSeries);

btnOrdenar.addEventListener("click", ordenarPorAno);