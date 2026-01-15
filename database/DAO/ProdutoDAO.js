const db = require("../mysql");

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

    async criarProduto(nome, preco, fotolink, descricao, categoria, unidade){
        const sql = "insert into Produto(nome, preco, fotolink, descricao, categoria, unidade) values(?, ?, ?, ?, ?, ?)";
    
        const [resultado] = await db.query(sql, [nome, preco, fotolink, descricao, categoria, unidade]);
    
        return resultado;
    } 

    async updateProduto(codigo, dados) {
        const columns = Object.keys(dados).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(dados), codigo];

        const sql = `UPDATE produtos SET ${columns} WHERE codigo = ?`;

        const [resultado] = await db.query(sql, values);
        
        return resultado.affectedRows > 0; // linhas afetadas no banco de dados
    }

    async deleteProduto(codigo){
        const sql = "delete from Produto where codigo = ?";
    
        const [resultado] = await db.query(sql, [codigo]);
    
        return resultado.affectedRows > 0;
    }
}



