// Armazenamento em memória: array de objetos simples
let alunos = [];
let indiceEdicao = null; // null = cadastrando; número = editando

function limparFormulario() {
  document.getElementById("nome").value = "";
  document.getElementById("idade").value = "";
  document.getElementById("curso").value = "JavaScript";
  document.getElementById("notaFinal").value = "";
  indiceEdicao = null;
  document.getElementById("btnSalvar").textContent = "Cadastrar";
  document.getElementById("btnCancelar").hidden = true;
}

function salvarAluno() {
  const nome = document.getElementById("nome").value.trim();
  const idade = document.getElementById("idade").value;
  const curso = document.getElementById("curso").value;
  const notaFinal = document.getElementById("notaFinal").value;

  if (nome === "" || idade === "" || notaFinal === "" || notaFinal < 0 || notaFinal > 10) {
    alert("Preencha todos os campos corretamente (nota entre 0 e 10).");
    return;
  }

  const aluno = {
    nome: nome,
    idade: Number(idade),
    curso: curso,
    notaFinal: Number(notaFinal),
  };

  if (indiceEdicao === null) {
    alunos.push(aluno);
  } else {
    alunos[indiceEdicao] = aluno;
  }

  limparFormulario();
  renderizarTabela();
}

function editarAluno(indice) {
  const aluno = alunos[indice];
  document.getElementById("nome").value = aluno.nome;
  document.getElementById("idade").value = aluno.idade;
  document.getElementById("curso").value = aluno.curso;
  document.getElementById("notaFinal").value = aluno.notaFinal;
  indiceEdicao = indice;
  document.getElementById("btnSalvar").textContent = "Salvar alterações";
  document.getElementById("btnCancelar").hidden = false;
}

function excluirAluno(indice) {
  if (confirm("Excluir " + alunos[indice].nome + "?")) {
    alunos.splice(indice, 1);
    if (indiceEdicao === indice) limparFormulario();
    renderizarTabela();
  }
}

function renderizarTabela() {
  const tbody = document.getElementById("tabelaAlunos");
  tbody.innerHTML = "";

  for (let i = 0; i < alunos.length; i++) {
    const a = alunos[i];
    tbody.innerHTML +=
      "<tr>" +
      "<td>" + a.nome + "</td>" +
      "<td>" + a.idade + "</td>" +
      "<td>" + a.curso + "</td>" +
      "<td>" + a.notaFinal.toFixed(1) + "</td>" +
      "<td>" +
      '<button onclick="editarAluno(' + i + ')">Editar</button> ' +
      '<button onclick="excluirAluno(' + i + ')">Excluir</button>' +
      "</td>" +
      "</tr>";
  }
}

renderizarTabela();
