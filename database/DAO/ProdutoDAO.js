import db from '../mysql.js'
import { Produto } from '../../model/Produto.js';

export class ProdutoDAO{
    constructor(){}
    async buscarTudo(){ // async: espera cada linha rodar e depois roda - assincrono
        const sql = "select * from Produto";
                                                    
        const [resultado] = await db.query(sql);

        return resultado;
    }

    async buscarCodigo(codigo){
        const sql = "select * from Produto where codigo = ?";
    
        const [resultado] = await db.query(sql, [codigo]);
    
        return resultado;
    }

    async criar(produto){
        const sql = "insert into Produto(nome, preco, fotoLink, descricao, categoria, unidade) values(?, ?, ?, ?, ?, ?)";
    
        const [resultado] = await db.query(sql, [produto.getNome(), produto.getPreco(), produto.getFotoLink(), produto.getDescricao(), produto.getCategoria(), produto.getUnidade()]);
    
        return resultado;
    } 

    async update(codigo, dados) {
        const columns = Object.keys(dados).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(dados), codigo];

        const sql = `UPDATE produto SET ${columns} WHERE codigo = ?`;

        const [resultado] = await db.query(sql, values);
        
        return resultado.affectedRows > 0; // linhas afetadas no banco de dados
    }

    async delete(codigo){
        const sql = "delete from Produto where codigo = ?";
    
        const [resultado] = await db.query(sql, [codigo]);
    
        return resultado.affectedRows > 0;
    }
}



