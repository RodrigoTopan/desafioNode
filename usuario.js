class Usuario {
    constructor({ ID, username, password }) {
        this.ID = ID;
        this.username = username;
        this.password = password;
    }
}
//Deixamos a classe publica
module.exports = Usuario;

