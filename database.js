#!/usr/bin/env node
//heroku addons:create heroku-postgresql:desafioCertificado
const Sequelize = require('sequelize');
const Usuario = require('./usuario');
const Funcionario = require('./funcionario');
const Empresa = require('./empresa');
const Empresa = require('./funcionario_empresa.js');

class Database {
    constructor() {
        this.desafioCertificado = {};
        this.FuncionarioModel = {};
        this.UsuarioModel = {};
        this.EmpresaModel = {};
        this.FuncionarioEmpresaModel = {};
    }
    async conectar() {
        const herokuPostgres = process.env.DATABASE_URL;
        //definindo as configurações da base de dados
        this.desafioCertificado = new Sequelize(
            herokuPostgres,
            {
                dialect: 'postgres',
                dialectOptions: {
                    ssl: true,
                    requestTimeout: 30000, // timeout = 30 seconds
                },
            },
        );
        const retorno = await this.definirModelo();
        console.log(retorno);
    }
    async definirModelo() {
        //Tabela Usuario
        this.UsuarioModel = this.desafioCertificado.define('User', {
            ID: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            USERNAME: Sequelize.STRING,
            PASSWORD: Sequelize.STRING,
        });
        //Tabela Funcionário
        this.FuncionarioModel = this.desafioCertificado.define('Employees', {
            ID: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            NOME: Sequelize.STRING,
            IDADE: Sequelize.STRING,
            DATA_NASCIMENTO: Sequelize.DATE,
            USUARIO_ID: Sequelize.INTEGER,
        });
        //Tabela empresa
        this.EmpresaModel = this.desafioCertificado.define('Company', {
            ID: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            NOME: Sequelize.STRING,
            CNPJ: Sequelize.STRING,
        });

        //Tabela funcionario_empresa
        this.FuncionarioEmpresaModel = this.desafioCertificado.define('Employee_Company', {
            FUNCIONARIO_ID: Sequelize.INTEGER,
            EMPRESA_ID: Sequelize.INTEGER,
        });

        //fazemos o relacionamento entre as tabelas
        //Exemplo erick
        //adicionando o Classe do Heroi
        //this.HeroModel.hasMany(this.ClasseModel);

        //Um usuario é um funcionario
        this.FuncionarioModel.hasOne(this.UsuarioModel);
        //Um funcionario pertence a uma empresa
        this.FuncionarioEmpresaModel.hasMany(this.FuncionarioModel);
        //Uma empresa possui muitos funcionários
        this.FuncionarioEmpresaModel.hasMany(this.EmpresaModel);

        //com o sync mapeamos e criamos as tabelas caso elas não existam
        await this.FuncionarioModel.sync({ force: true })
        await this.EmpresaModel.sync({ force: true })
        await this.UsuarioModel.sync({ force: true })
        await this.FuncionarioEmpresaModel.sync({ force: true })


        //criação de registros default

        await this.UsuarioModel.create({
            USERNAME: 'Rodrigo',
            PASSWORD: 'admin'
        });

        await this.FuncionarioModel.create({
            NOME: 'Rodrigo G.T.M',
            IDADE: '19',
            USUARIO: 1,
            DATA_NASCIMENTO: '1998-03-11'
        });

        await this.EmpresaModel.create({
            NOME: 'EMPRESA GRAFIA',
            CNPJ: '00000001/0001-36'
        });
        await this.EmpresaModel.create({
            NOME: 'EMPRESA FORNECEDORES',
            CNPJ: '00000004/0001-70'
        });
        await this.EmpresaModel.create({
            NOME: 'EMPRESA MARKETING',
            CNPJ: '00000002/0001-80'
        });

        await this.FuncionarioEmpresaModel.create({
            FUNCIONARIO_ID: 1,
            EMPRESA_ID: 1
        });

    }

    //cadastro usuario
    async cadastrarUsuario(usuario) {
        const result = await this.UsuarioModel.create
            ({
                USERNAME: user.username,
                PASSWORD: user.password,
            });
        return result;
    }
    //cadastro usuario
    async cadastrarFuncionario(funcionario) {
        //Usamos a tecnica do desconstrutor para recuperar o id do usuario
        const { ID } = await this.pesquisarUsuario(usuario.id);
        const result = await this.FuncionarioModel.create
            ({
                NOME: employee.nome,
                IDADE: employee.poder,
                DATA_NASCIMENTO: employee.dataNascimento,
                USUARIO_ID: ID,
            });

        return result;
    }

    /*
        const { FUNCIONARIO_ID } = await this.pesquisarFuncionario(funcionario.id);
        const { EMPRESA_ID } = await this.pesquisarEmpresa(empresa.id);
        const result2 = await this.FuncionarioEmpresaModel.create
            ({
                
            });
    */

    //Pesquisa de usuario por id
    async pesquisarUsuario(id) {
        //Pesquisamos o usuario pelo id, para pesquisar e obter os dados do funcionário do banco
        const result = await this.UsuarioModel.findOne({
            where: { ID: id },
        });
        return result.get({ plain: true });
    }
    //Pesquisa de funcionario por id
    async pesquisarFuncionario(id) {
        //Pesquisamos o funcionário pelo id, para pesquisar e obter os dados do funcionário do banco
        const result = await this.FuncionarioModel.findOne({
            where: { ID: id },
        });
        return result.get({ plain: true });
    }
    //Pesquisa de empresa por id
    async pesquisarEmpresa(id) {
        //Pesquisamos a empresa pelo id, para pesquisar e obter os dados da empresa do banco
        const result = await this.UsuarioModel.findOne({
            where: { ID: id },
        });
        return result.get({ plain: true });
    }




    async listarFuncionarios() {
        const result = await this.FuncionarioModel.findAll().map(item => {
            //extraimos os objetos que precisamos
            const { ID, NOME, IDADE, USUARIO_ID, DATA_NASCIMENTO } = item;
            //se o nome da chave for igual a do valor
            //const heroi = { ID, NOME, PODER, CLASSE_ID, DATA_NASCIMENTO };
            const employee = {
                id: ID,
                nome: NOME,
                idade: IDADE,
                usuario: USUARIO_ID,
                data: DATA_NASCIMENTO
            };
            const funcionarioMapeado = new Funcionario(funcionario);
            return funcionarioMapeado;
        });

        return result;
    }

    //Fiz a remoção por id também
    async remover(id) {
        const result = await this.FuncionarioModel.destroy({ where: { ID: id } });
        return result;
    }

    async atualizar(id, employee) {
        const result = await this.FuncionarioModel.update(
            {
                NOME: employee.nome,
                IDADE: employee.poder,
                DATA_NASCIMENTO: employee.dataNascimento,
            },
            {
                where: { ID: id },
                returning: true,
                plain: true
            });
        return result;
    }
}

module.exports = Database;