// Exercício 2: classe Aluno
class Aluno {
  constructor(nome, idade, curso, notaFinal) {
    this.nome = nome;
    this.idade = idade;
    this.curso = curso;
    this.notaFinal = notaFinal;
  }

  isAprovado() {
    return this.notaFinal >= 7;
  }

  toString() {
    const situacao = this.isAprovado() ? "Aprovado" : "Reprovado";
    return `${this.nome} (${this.idade} anos) - ${this.curso} - Nota: ${this.notaFinal.toFixed(1)} - ${situacao}`;
  }
}
