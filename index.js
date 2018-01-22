//NPM INIT -> CRIA O PACKAGE.JSON
//file system
const Fs = require('fs');

//instalar bluebird para trabalhar com promises
const Bluebird = require('bluebird');

//promisifyAll. Função do bluebird que 
//ao invés de callbacks normais do FS utiliza promises 
//para chamadas de funções assincronas

const FsAsync = Bluebird.promisifyAll(Fs);



