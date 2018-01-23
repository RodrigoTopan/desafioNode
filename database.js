#!/usr/bin/env node
const Sequelize = require('sequelize');
const Funcionario = require('./funcionario');

class Database {
    constructor() {
        this.desafioCertificado = {};
        this.FuncionarioModel = {};
    }
    async conectar() {
        const herokuPostgres = process.env.DATABASE_URL;
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
        await this.definirModelo();
    }
    async definirModelo() {
        this.FuncionarioModel = this.desafioCertificado.define('Employees', {
            ID: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            NOME: Sequelize.STRING,
            IDADE: Sequelize.INTEGER,
            DATA_NASCIMENTO: Sequelize.DATE,
            USUARIO_ID: Sequelize.INTEGER,
        });
        //com o sync mapeamos e criamos as tabelas caso elas não existam
        await this.FuncionarioModel.sync({ force: true })
    }

    async cadastrar(employee) {
        const result = await this.FuncionarioModel.create
            ({
                NOME: employee.nome,
                PODER: employee.poder,
                USUARIO_ID: employee.usuario_id,
                DATA_NASCIMENTO: employee.dataNascimento,
            });
        return result;
    }
    async pesquisarFuncionario(id) {
        const result = await this.FuncionarioModel.findOne({
            where: { ID: id },
        });
        return result.get({ plain: true });
    }
    async listarFuncionarios() {
        const result = await this.FuncionarioModel.findAll().map(item => {
            const { ID, NOME, IDADE, DATA_NASCIMENTO, USUARIO_ID } = item;
            const funcionario = {
                id: ID,
                nome: NOME,
                idade: IDADE,
                data: DATA_NASCIMENTO,
                usuario: USUARIO_ID
            };

            const funcionarioMapeado = new Funcionario(funcionario);
            return funcionarioMapeado;
        });

        return result;
    }

    async remover(id) {
        const result = await this.FuncionarioModel.destroy({ where: { ID: id } });
        return result;
    }

    async atualizar(idAntigo, employee) {
        const result = await this.FuncionarioModel.update(
            {
                NOME: employee.nome,
                IDADE: employee.nome,
                DATA_NASCIMENTO: employee.data
            },
            {
                where: { ID: idAntigo },
                returning: true,
                plain: true
            });
        return result;
    }
}

module.exports = Database;