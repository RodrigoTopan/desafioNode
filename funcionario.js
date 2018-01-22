//Duvida em relação a colocar o usuario_id como atributo desse objeto
class Funcionario {
    constructor({ ID, nome, idade, dataNascimento, usuario_id }) {
        this.ID = ID;
        this.nome = nome;
        this.idade = idade;
        this.dataNascimento = dataNascimento;
        this.usuario_id = usuario_id;
    }
}
//Deixamos a classe publica
module.exports = Funcionario;

