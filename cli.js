#!/usr/bin/env node
//Executável

//Nossas funções para manipular chamadas via terminal
//via terminal
//>node cli.js --nome Rodrigo
// ./cli.js --nome Rodrigo

// git clone git://github.com/RodrigoTopan/desafioNode
// git-remote -v origin https://github.com/RodrigoTopan/desafioNode
// 4O git add . && git commit -m "primeiro commit" && git push origin master
// git add . && git commit -m "primeiro commit" && git push heroku master

const Commander = require('commander');
const Funcionario = require('./funcionario');

//importamos a database
const Database = require('./database');
const database = new Database();

Commander
    // informamos a versão da nossa ferramenta
    .version('v1.0.1')
    //informamos uma opção, e que essa opção receberá um valor
    .option('-n, --nome [value]', 'Recebe o nome do Funcionário')
    .option('-i, --idade [value]', 'Recebe a idade do Funcionário')
    .option('-d, --data [value]', 'Recebe a data de nascimento do herói')
    .option('--usuario [value]', 'Recebe o id do usuario do funcionario')
    //.option('-e, --empresa [value]', 'Recebe a empresa do funcionário')
    .option('-r, --remover', 'Remove um funcionário pelo ID')
    .option('-l, --listar', 'Lista todos os funcionários')
    .option('-a, --adicionar', 'Adiciona um funcionário pelo id')
    .option('-u, --atualizar [value]', 'Atualiza um funcionario pelo id')
    .option('--relatorioempresa', 'Quantidade de funcionários da mesma empresa')
    //informamos que os parametros virão relatoriopoder
    //dos argumentos de quem chamar essa função
    .parse(process.argv);

/*
node cli.js \
-n 'Rodrigo' \
-i '19' \
-d '1997-03-11' \
-e 'resolv' -a
*/

async function execucao(commander) {
    try {
        const Funcionario = new Funcionario(commander);
        //inicializamos a conexão com a base de dados
        //se a base de dados estiver indisponivel 
        //cai no catch e não quebra a aplicação
        await database.conectar();
        if (commander.remover) {
            await database.remover(employee.id);
            return;
        }
        if (commander.adicionar) {
            //adicionamos a classe para manipulação a partir do banco de dados
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
            const id = commander.atualizar;
            await database.atualizar(id, employee);
            const listar = await database.listarFuncionarios();
            console.log(listar);
            process.exit(0);
            return;
        }
        if (commander.relatorioEmpresa) {
            const result = await database.relatorioempresa();
            console.log("RELATÓRIO DE EMPRESAS", result);
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
