// Armazenamento em memória (array de objetos Aluno)
let alunos = [];
let indiceEdicao = null; // null = cadastrando; número = editando

const campos = {
  nome: document.getElementById("nome"),
  idade: document.getElementById("idade"),
  curso: document.getElementById("curso"),
  notaFinal: document.getElementById("notaFinal"),
};
const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");
const tabela = document.getElementById("tabelaAlunos");
const relatorio = document.getElementById("relatorio");

// ---------- Funções com arrow (Exercício 3) ----------
const limparFormulario = () => {
  campos.nome.value = "";
  campos.idade.value = "";
  campos.curso.value = "JavaScript";
  campos.notaFinal.value = "";
  indiceEdicao = null;
  btnSalvar.textContent = "Cadastrar";
  btnCancelar.hidden = true;
};

const lerFormulario = () =>
  new Aluno(
    campos.nome.value.trim(),
    Number(campos.idade.value),
    campos.curso.value,
    Number(campos.notaFinal.value)
  );

const formularioValido = () =>
  campos.nome.value.trim() !== "" &&
  campos.idade.value !== "" &&
  campos.notaFinal.value !== "" &&
  Number(campos.notaFinal.value) >= 0 &&
  Number(campos.notaFinal.value) <= 10;

const adicionarAluno = (aluno) => alunos.push(aluno);
const atualizarAluno = (i, aluno) => (alunos[i] = aluno);
const removerAluno = (i) => (alunos = alunos.filter((_, idx) => idx !== i));

// ---------- Renderização ----------
const renderizarTabela = () => {
  tabela.innerHTML = "";

  alunos.forEach((aluno, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.idade}</td>
      <td>${aluno.curso}</td>
      <td>${aluno.notaFinal.toFixed(1)}</td>
      <td>${aluno.isAprovado() ? "Aprovado" : "Reprovado"}</td>
      <td></td>`;

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", function () {
      campos.nome.value = aluno.nome;
      campos.idade.value = aluno.idade;
      campos.curso.value = aluno.curso;
      campos.notaFinal.value = aluno.notaFinal;
      indiceEdicao = i;
      btnSalvar.textContent = "Salvar alterações";
      btnCancelar.hidden = false;
      console.log("Editando aluno:", aluno.toString());
    });

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.addEventListener("click", function () {
      if (confirm(`Excluir ${aluno.nome}?`)) {
        removerAluno(i);
        if (indiceEdicao === i) limparFormulario();
        renderizarTabela();
        alert("Aluno excluído com sucesso!");
      }
    });

    const tdAcoes = tr.lastElementChild;
    tdAcoes.append(btnEditar, " ", btnExcluir);
    tabela.appendChild(tr);
  });
};

// ---------- Eventos do formulário ----------
btnSalvar.addEventListener("click", function () {
  if (!formularioValido()) {
    alert("Preencha todos os campos corretamente (nota entre 0 e 10).");
    return;
  }

  const aluno = lerFormulario();

  if (indiceEdicao === null) {
    adicionarAluno(aluno);
    alert("Aluno cadastrado com sucesso!");
  } else {
    atualizarAluno(indiceEdicao, aluno);
    alert("Aluno editado com sucesso!");
  }

  console.log(aluno.toString());
  limparFormulario();
  renderizarTabela();
});

btnCancelar.addEventListener("click", () => limparFormulario());

// ---------- Exercício 4: relatórios ----------
const mostrar = (texto) => (relatorio.textContent = texto);
const semAlunos = () => alunos.length === 0;

document.getElementById("btnAprovados").addEventListener("click", () => {
  const aprovados = alunos.filter((a) => a.isAprovado());
  mostrar(
    aprovados.length
      ? "Alunos aprovados:\n" + aprovados.map((a) => "- " + a.toString()).join("\n")
      : "Nenhum aluno aprovado."
  );
});

document.getElementById("btnMediaNotas").addEventListener("click", () => {
  if (semAlunos()) return mostrar("Sem alunos cadastrados.");
  const media = alunos.reduce((soma, a) => soma + a.notaFinal, 0) / alunos.length;
  mostrar(`Média das notas finais: ${media.toFixed(2)}`);
});

document.getElementById("btnMediaIdades").addEventListener("click", () => {
  if (semAlunos()) return mostrar("Sem alunos cadastrados.");
  const media = alunos.reduce((soma, a) => soma + a.idade, 0) / alunos.length;
  mostrar(`Média das idades: ${media.toFixed(1)} anos`);
});

document.getElementById("btnAlfabetica").addEventListener("click", () => {
  const nomes = alunos.map((a) => a.nome).sort((x, y) => x.localeCompare(y, "pt-BR"));
  mostrar(nomes.length ? "Nomes em ordem alfabética:\n" + nomes.join("\n") : "Sem alunos cadastrados.");
});

document.getElementById("btnPorCurso").addEventListener("click", () => {
  if (semAlunos()) return mostrar("Sem alunos cadastrados.");
  const contagem = alunos.reduce((acc, a) => {
    acc[a.curso] = (acc[a.curso] || 0) + 1;
    return acc;
  }, {});
  let texto = "Quantidade de alunos por curso:\n";
  Object.entries(contagem).forEach(([curso, qtd]) => {
    texto += `${curso}: ${qtd}\n`;
  });
  mostrar(texto);
});

renderizarTabela();
