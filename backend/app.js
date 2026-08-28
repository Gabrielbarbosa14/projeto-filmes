import tabelafilmes from "./tabela.js";
import express from "express";

// PORTA DA APLICAÇÃO
const PORTA = 3000;

// INICIALIZAR A APLICAÇÃO EXPRESS
const app = express();

// PERMITE RECEBER JSON NO BODY DAS REQUISIÇÕES
app.use(express.json());

// FUNÇÃO PARA CARREGAR OS FILMES
function carregar_filmes() {
  return tabelafilmes;
}

// ======================================================
// ROTA RAIZ
// GET /
// ======================================================

app.get("/", (req, res) => {
  res.json({
    mensagem: "API FUNCIONANDO",
    rotas: {
      listar: "GET /filmes",
      estatisticas: "GET /filmes/estatisticas",
      buscarPorId: "GET /filmes/id/:id",
      buscarPorSigla: "GET /filmes/:sigla",
      buscarPorGenero: "GET /filmes/genero/:genero",
      adicionar: "POST /filmes",
      deletar: "DELETE /filmes/:id",
    },
  });
});

// ======================================================
// LISTAR TODOS OS FILMES
// GET /filmes
// ======================================================

app.get("/filmes", (req, res) => {
  res.json(tabelafilmes);
});

// ======================================================
// ESTATÍSTICAS DOS FILMES
// GET /filmes/estatisticas
// ======================================================

app.get("/filmes/estatisticas", (req, res) => {
  const filmes = carregar_filmes();

  if (filmes.length === 0) {
    return res.status(404).json({
      erro: "Nenhum filme cadastrado",
    });
  }

  const totalBilheteria = filmes.reduce(
    (total, filme) => total + Number(filme.bilheteria || 0),
    0,
  );

  const totalOscars = filmes.reduce(
    (total, filme) => total + Number(filme.oscars || 0),
    0,
  );

  const mediaAvaliacao =
    filmes.reduce((total, filme) => total + Number(filme.avaliacao || 0), 0) /
    filmes.length;

  const mediaDuracao =
    filmes.reduce((total, filme) => total + Number(filme.duracao || 0), 0) /
    filmes.length;

  const filmeMaiorAvaliacao = filmes.reduce((melhor, filme) =>
    Number(filme.avaliacao || 0) > Number(melhor.avaliacao || 0)
      ? filme
      : melhor,
  );

  const filmeMaisLongo = filmes.reduce((maisLongo, filme) =>
    Number(filme.duracao || 0) > Number(maisLongo.duracao || 0)
      ? filme
      : maisLongo,
  );

  res.json({
    quantidadeFilmes: filmes.length,
    mediaAvaliacao: Number(mediaAvaliacao.toFixed(2)),
    mediaDuracao: Number(mediaDuracao.toFixed(2)),
    totalOscars: totalOscars,
    bilheteriaTotal: totalBilheteria,
    filmeMaiorAvaliacao: filmeMaiorAvaliacao.nome,
    avaliacaoMaior: Number(filmeMaiorAvaliacao.avaliacao),
    filmeMaisLongo: filmeMaisLongo.nome,
    duracaoMaisLonga: filmeMaisLongo.duracao,
  });
});

// ======================================================
// BUSCAR FILME PELO ID
// GET /filmes/id/:id
// ======================================================

app.get("/filmes/id/:id", (req, res) => {
  const filmes = carregar_filmes();

  const id = Number(req.params.id);

  const filme = filmes.find((filme) => filme.id === id);

  if (!filme) {
    return res.status(404).json({
      erro: "Filme não encontrado",
    });
  }

  res.json(filme);
});

// ======================================================
// BUSCAR FILME PELA SIGLA
// GET /filmes/:sigla
// ======================================================

app.get("/filmes/:sigla", (req, res) => {
  // Pega a sigla digitada na URL
  // e transforma em letras maiúsculas
  const sigla_buscar = req.params.sigla.toUpperCase();

  // Procura a sigla na tabela
  const filme = tabelafilmes.find(
    (filme) => filme.sigla.toUpperCase() === sigla_buscar,
  );

  if (!filme) {
    return res.status(404).json({
      erro: "Filme não encontrado",
    });
  }

  res.json(filme);
});

// ======================================================
// BUSCAR FILMES PELO GÊNERO
// GET /filmes/genero/:genero
// ======================================================

app.get("/filmes/genero/:genero", (req, res) => {
  // Pega o gênero digitado na URL
  // e transforma em letras maiúsculas
  const genero_buscar = req.params.genero.toUpperCase();

  // FILTER é utilizado porque podemos ter
  // vários filmes do mesmo gênero
  const filmes = tabelafilmes.filter(
    (filme) => filme.genero.toUpperCase() === genero_buscar,
  );

  if (filmes.length === 0) {
    return res.status(404).json({
      erro: "Nenhum filme encontrado para esse gênero",
    });
  }

  res.json(filmes);
});

// ======================================================
// ADICIONAR NOVO FILME
// POST /filmes
// ======================================================

app.post("/filmes", (req, res) => {
  const novoFilme = req.body;

  // Verifica se o ID foi informado
  if (novoFilme.id === undefined) {
    return res.status(400).json({
      erro: "O ID do filme é obrigatório",
    });
  }

  // Verifica se o ID já existe
  const filmeExistente = tabelafilmes.find(
    (filme) => filme.id === Number(novoFilme.id),
  );

  if (filmeExistente) {
    return res.status(400).json({
      erro: "Já existe um filme com esse ID",
    });
  }

  // Adiciona o filme na tabela
  tabelafilmes.push(novoFilme);

  res.status(201).json({
    mensagem: "Filme adicionado com sucesso",
    filme: novoFilme,
  });
});

// ======================================================
// DELETAR FILME PELO ID
// DELETE /filmes/:id
// ======================================================

app.delete("/filmes/:id", (req, res) => {
  const id = Number(req.params.id);

  // Procura a posição do filme no array
  const indice = tabelafilmes.findIndex((filme) => filme.id === id);

  // Se não encontrar
  if (indice === -1) {
    return res.status(404).json({
      erro: "Filme não encontrado",
    });
  }

  // Remove o filme do array
  const filmeRemovido = tabelafilmes.splice(indice, 1);

  res.json({
    mensagem: "Filme deletado com sucesso",
    filme: filmeRemovido[0],
  });
});

// ======================================================
// INICIALIZAÇÃO DO SERVIDOR
// ======================================================

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
