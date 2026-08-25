import tabelafilmes from "./tabela.js";
import express from "express";

//PORTA DA APLICAÇÃO
const PORTA = 3000;
//INICIALIZAR A APLICAÇÃO EXPRESS
const app = express();

function carregar_filmes() {
  //delete require.cache[require.resolve("./tabela")];
  return tabelafilmes;
}
//app.use(express.json());

//ROTA RAIZ (GET /) RETORNAR MENSAGEM DE BOAS VINDAS
app.get("/", (req, res) => {
  res.json({
    mensagem: "API FUNCIONANDO",
    rotas: {
      listar: "GET /filmes",
      buscarPorId: "GET /filmes/:id",
      buscaPorDiretor: "GET /filmes/diretor/:diretor",
    },
  });
});

//MOSTRA OS FILMES da tabela.js
app.get("/filmes", (req, res) => {
  res.json(tabelafilmes);
});

app.get("/filmes/id/:id", (req, res) => {
  const filmes = carregar_filmes();

  const id = Number(req.params.id);

  const filme = filmes.find((filme) => filme.id === id);

  if (!filme) {
    return res.status(404).json({
      erro: "filme não encontrado",
    });
  }

  res.json(filme);
});

//MOSTRA OS FILMES COM BASE NA SIGLA
app.get("/filmes/:sigla", (req, res) => {
  //PEGA A SIGLA DIGITA NA URL E TRANSFORMA EM LETRAS MAIUSCULAS
  const sigla_buscar = req.params.sigla.toUpperCase();

  //COMPARA A SIGLA DA URL COM A SIGLA DA TABELA
  const sigla = tabelafilmes.find(
    (filme) => filme.sigla.toUpperCase() === sigla_buscar,
  );

  if (!sigla) {
    return res.status(404).json({ erro: "filme não encontrado" });
  }

  res.json(sigla);
});

app.get("/filmes/genero/:genero", (req, res) => {
  const genero_buscar = req.params.genero.toUpperCase();

  const genero = tabelafilmes.find(
    (filme) => filme.genero.toUpperCase() === genero_buscar,
  );

  if (!genero.length === 0) {
    return res.status(404).json({ erro: "filme não encontrado" });
  }
  res.json(genero);
});

// MOSTRA OS FILMES COM BASE NO DIRETOR

app.get("/filmes/diretor/:diretor", (req, res) => {
  // PEGA O DIRETOR DIGITADO NA URL E TRANSFORMA EM LETRAS MAIÚSCULAS
  const diretor_buscar = req.params.diretor.toUpperCase();

  // PROCURA TODOS OS FILMES QUE POSSUEM O DIRETOR INFORMADO
  const diretor = tabelafilmes.filter(
    (filme) => filme.diretor.toUpperCase() === diretor_buscar,
  );

  // SE NÃO ENCONTRAR NENHUM FILME
  if (diretor.length === 0) {
    return res.status(404).json({
      erro: "filme não encontrado",
    });
  }

  // RETORNA TODOS OS FILMES ENCONTRADOS
  res.json(diretor);
});

//INICIALIZA O SERVIDOR HTTP ESCUTANDO NA PORTA CONFIGURADA
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
