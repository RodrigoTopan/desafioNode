#!/usr/bin/env node
//Executável

//Nossas funções para manipular chamadas via terminal
//via terminal
//>node cli.js --nome Rodrigo
// ./cli.js --nome Rodrigo

const Commander = require('commander');
const Funcionario = require('./funcionario');
const Database = require('./database');
const database = new Database();

Commander
    // informamos a versão da nossa ferrmamenta
    .version('v1.0.1')
    //opções funcionário
    .option('-n, --nome [value]', 'Recebe o nome do Funcionário')
    .option('-i, --idade [value]', 'Recebe a idade do Funcionário')
    .option('-d, --data [value]', 'Recebe a data de nascimento do Funcionário')
    .option('--usuario [value]', 'Recebe o id de usuario do Funcionário')
    .option('--empresa [value]', 'Recebe a empresa do Funcionário')
    .option('-r, --remover', 'Remove um funcionário pelo id')
    .option('-l, --listar', 'Lista todos os funcionários')
    .option('-a, --adicionar', 'Adiciona um funcionário')
    .option('-u, --atualizar [value]', 'Atualiza um funcionário pelo id')
    .option('--relatorioempresa', 'Quantidade de funcionários da mesma empresa')
    .parse(process.argv);

async function execucao(commander) {
    try {
        const employee = new Funcionario(commander);
        await database.conectar();

        if (commander.remover) {
            await database.remover(employee.id);
            return;
        }
        if (commander.adicionar) {
            await database.cadastrar(employee);
            process.exit(0);
            return;
        }
        if (commander.listar) {
            const result = await database.listarFuncionarios();
            console.log(result);
            process.exit(0);
            return;
        }
        if (commander.atualizar) {
            const idAntigo = commander.atualizar;
            await database.atualizar(idAntigo, employee);
            const listar = await databaseSQL.listarFuncionarios();
            console.log(listar);
            process.exit(0);
            return;
        }
        if (commander.relatorioempresa) {
            const result = await database.relatorioempresa();
            console.log("RELATÓRIO DA EMPRESA", result);
            process.exit(0);
            return;
        }

    }
    catch (e) {
        console.error(e);
        process.exit(0);
    }
}

execucao(Commander);
