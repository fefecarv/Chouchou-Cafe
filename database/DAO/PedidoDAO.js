/**
     * método construtor da classe Pedidos
     * 
     * @param {int} cc codigo cliente
     * @param {int} pc codigo produto
     * @param {Array} s status produto
     * @param {string} c cep
*/

import db from '../mysql.js'
export class PedidoDAO{
    constructor(){}
    async buscarTudo(){ // async: espera cada linha rodar e depois roda - assincrono
        const sql = "select * from Pedido";
                                                    
        const [resultado] = await db.query(sql);

        return resultado;
    }

    async buscarCodigo(codigoProduto, codigoCliente){
        const sql = "select * from Pedido where codigoProduto = ? and codigoCliente = ?";
    
        const [resultado] = await db.query(sql, [codigoProduto, codigoCliente]);
    
        return resultado;
    }

    async criar(pedido){
        const sql = "insert into Pedido(codigoCliente, codigoProduto, status, cep) values(?, ?, ?, ?)";
    
        const [resultado] = await db.query(sql, [pedido.getClienteCodigo(), pedido.getProdutoCodigo(), pedido.getStatus(), pedido.getCep()]);
        
        return resultado;
    } 

    async update(codigoProduto, codigoCliente, dados) {
        const columns = Object.keys(dados).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(dados), codigoProduto, codigoCliente];

        const sql = `UPDATE pedido SET ${columns} WHERE codigoProduto = ? AND codigoCliente = ?`;

        const [resultado] = await db.query(sql, values);
        
        return resultado.affectedRows > 0; // linhas afetadas no banco de dados
    }

    async delete(codigoProduto, codigoCliente){
        const sql = "delete from pedido where codigoProduto = ? AND codigoCliente = ?";
    
        const [resultado] = await db.query(sql, [codigoProduto, codigoCliente]);
    
        return resultado.affectedRows > 0;
    }
}

/**
 * o async vai criar um algoritmo assincrono, onde cada passo será executado após a finalização do
 * anterior. 
 * exemplo: na busca pelo id de um usuário em um banco populado, normalmente o tempo de resposta do 
 * banco é superior a um segundo e a atribuição do valor à variável é imediato, o que faria com que o 
 * js atribuísse 'undefined' e não o dado do banco de dados.
 */

