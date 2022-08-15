const axios = require('axios');
const { join } = require('core-js/library/fn/array');
const isDataDesc = require('is-data-descriptor');
const { result } = require('lodash');
const { invalid } = require('moment');
const moment = require('moment');
const { async } = require('q');
const { isFunctionTypeNode } = require('typescript');

var date1 = "2022-02-05";
var date2 = "2022-02-06";


var dateInit = new Date(date1);
var dateEnd = new Date(date2);

const Init = moment(dateInit);
const End = moment(dateEnd);
const diff = End.diff(Init, 'days');


function validade(data) {
    const response = moment(data)
    if (typeof (response) != undefined) {
        return response;
    } else {
        return null;
    }
}
function TransformDate(data){
    if(data != null){
        return new Date(data);
    }else{
        return null;
    }
}



/*var dateVar = new Date(dateInitFormated);
var trans = moment(dateVar).format('YYYY-MM-DD');
console.log(trans);

/*var dataADD = moment(dateVar).add(2,'day');
console.log(dataADD);*/



async function get(dateInitFormated) {
    const { data } = await axios.get(`http://nadic.ifrn.edu.br/api/dou/${dateInitFormated}/?usuario=dev_nadic`)

    const dados = data.licitacoes;

    if(typeof(dados) !=  undefined){
        const size = (Object.keys(data.licitacoes).length);
        for(let i =0; i < size;i++){
            const datas = dados[i].datas['Outras Datas']
            if (typeof(datas) !=  undefined){
                const size2 = (Object.keys(dados[i].datas['Outras Datas']).length);
                if(size2 >=1){
                const URL_licitacao = 'http://127.0.0.1:3333/licitacao';
                    const todo = { "orgao": dados[i].orgao, "titulo": dados[i].titulo, "estado": dados[i].estado, "Cidade": dados[i].cidade, "objeto": dados[i].objeto };
                    const licitacao = await axios.post(URL_licitacao,todo);
                    const id = licitacao.data.id
                for(let j= 0;j<size2;j++){
                        const data1 = validade(datas[j].data);
                        const data2 = validade(datas[j].data_fonte);
                        const Dataenv = TransformDate(data1);
                        const DataFont = TransformDate(data2);
                        const body = {"data":Dataenv, "data_fonte":DataFont,"licitacaoId":id}
                        const URL_datas = 'http://127.0.0.1:3333/datas';
                        await axios.post(URL_datas,body);
                        
                }

            
                }
 
                
            }
        }

    }
}

i = 0;
let dateInitFormated = moment(date1).format('YYYY-MM-DD');


while (i <= diff) {
//chamando o método que pega via get da api do Nadic  as licitações daquele dia passado na URL, esta funçaõ tem como parâmetro a data para a consulta no formato YYYY/MM/DD
    get(dateInitFormated);
    var dateVar = new Date(dateInitFormated);
    var dateVar = moment(dateVar).add(2, 'day');
    dateInitFormated = moment(dateVar).format('YYYY-MM-DD');
    i = i + 1;
}; 