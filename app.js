// Armazenamento em memória (array de instâncias de Aluno)
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
const tituloForm = document.getElementById("tituloForm");
const tabela = document.getElementById("tabelaAlunos");
const relatorio = document.getElementById("relatorio");

// ---------- Avisos com alert do Bootstrap ----------
const mostrarAviso = (mensagem, tipo = "success") => {
  const aviso = document.createElement("div");
  aviso.className = `alert alert-${tipo} alert-dismissible fade show`;
  aviso.setAttribute("role", "alert");
  aviso.textContent = mensagem;

  const fechar = document.createElement("button");
  fechar.type = "button";
  fechar.className = "btn-close";
  fechar.setAttribute("data-bs-dismiss", "alert");
  fechar.setAttribute("aria-label", "Fechar");
  aviso.appendChild(fechar);

  document.getElementById("avisos").appendChild(aviso);
  setTimeout(() => aviso.remove(), 3500);
};

// ---------- Formulário ----------
const limparFormulario = () => {
  campos.nome.value = "";
  campos.idade.value = "";
  campos.curso.value = "JavaScript";
  campos.notaFinal.value = "";
  indiceEdicao = null;
  btnSalvar.textContent = "Cadastrar";
  btnCancelar.hidden = true;
  tituloForm.textContent = "Cadastrar aluno";
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

// ---------- Operações no array ----------
const adicionarAluno = (aluno) => alunos.push(aluno);
const atualizarAluno = (i, aluno) => (alunos[i] = aluno);
const removerAluno = (i) => (alunos = alunos.filter((_, idx) => idx !== i));

// ---------- Resumo (cards do topo) ----------
const atualizarResumo = () => {
  const total = alunos.length;
  const media = total ? alunos.reduce((s, a) => s + a.notaFinal, 0) / total : null;
  document.getElementById("resumoTotal").textContent = total;
  document.getElementById("resumoMedia").textContent = media === null ? "–" : media.toFixed(2);
  document.getElementById("resumoAprovados").textContent = alunos.filter((a) => a.isAprovado()).length;
};

// ---------- Tabela ----------
const criarBotao = (texto, classe, aoClicar) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `btn btn-sm ${classe}`;
  btn.textContent = texto;
  btn.addEventListener("click", aoClicar);
  return btn;
};

const renderizarTabela = () => {
  tabela.innerHTML = "";

  if (alunos.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = '<td colspan="6" class="text-center text-muted py-4">Nenhum aluno cadastrado.</td>';
    tabela.appendChild(tr);
  }

  alunos.forEach((aluno, i) => {
    const tr = document.createElement("tr");

    [aluno.nome, aluno.idade, aluno.curso, aluno.notaFinal.toFixed(1)].forEach((valor) => {
      const td = document.createElement("td");
      td.textContent = valor;
      tr.appendChild(td);
    });

    const tdSituacao = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = `badge ${aluno.isAprovado() ? "text-bg-success" : "text-bg-danger"}`;
    badge.textContent = aluno.isAprovado() ? "Aprovado" : "Reprovado";
    tdSituacao.appendChild(badge);
    tr.appendChild(tdSituacao);

    const tdAcoes = document.createElement("td");
    tdAcoes.className = "text-end text-nowrap";
    tdAcoes.append(
      criarBotao("Editar", "btn-outline-warning", function () {
        campos.nome.value = aluno.nome;
        campos.idade.value = aluno.idade;
        campos.curso.value = aluno.curso;
        campos.notaFinal.value = aluno.notaFinal;
        indiceEdicao = i;
        btnSalvar.textContent = "Salvar alterações";
        btnCancelar.hidden = false;
        tituloForm.textContent = "Editar aluno";
        console.log("Editando aluno:", aluno.toString());
      }),
      " ",
      criarBotao("Excluir", "btn-outline-danger", function () {
        if (confirm(`Excluir ${aluno.nome}?`)) {
          removerAluno(i);
          if (indiceEdicao === i) limparFormulario();
          renderizarTabela();
          mostrarAviso("Aluno excluído com sucesso!", "danger");
        }
      })
    );
    tr.appendChild(tdAcoes);

    tabela.appendChild(tr);
  });

  atualizarResumo();
};

// ---------- Eventos do formulário ----------
btnSalvar.addEventListener("click", function () {
  if (!formularioValido()) {
    mostrarAviso("Preencha todos os campos corretamente (nota entre 0 e 10).", "warning");
    return;
  }

  const aluno = lerFormulario();

  if (indiceEdicao === null) {
    adicionarAluno(aluno);
    mostrarAviso("Aluno cadastrado com sucesso!");
  } else {
    atualizarAluno(indiceEdicao, aluno);
    mostrarAviso("Aluno editado com sucesso!", "info");
  }

  console.log(aluno.toString());
  limparFormulario();
  renderizarTabela();
});

btnCancelar.addEventListener("click", () => limparFormulario());

// ---------- Relatórios ----------
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
