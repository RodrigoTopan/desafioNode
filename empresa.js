class Empresa {
    constructor({ ID, nome, cnpj }) {
        this.ID = ID;
        this.nome = nome;
        this.cnpj = cnpj;
    }
}
//Deixamos a classe publica
module.exports = Empresa;

