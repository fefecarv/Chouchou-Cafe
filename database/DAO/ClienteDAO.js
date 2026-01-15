const db = require("../mysql");

export class ClienteDAO{
    constructor(){}
    async buscarTudo(){
        const sql = "SELECT * FROM cliente";
                                                    
        const [resultado] = await db.query(sql);

        return resultado;
    }

    async buscarCodigo(codigo){
        const sql = "SELECT * FROM cliente WHERE codigo = ?";
    
        const [resultado] = await db.query(sql, [codigo]);
    
        return resultado;
    }

    async buscarEmail(email){
        const sql = "SELECT * FROM cliente WHERE email = ?";
    
        const [resultado] = await db.query(sql, [email]);
    
        return resultado;
    }

    async criar(codigo, cpf, nome, senha, endereco, email, cep){
        const sql = "INSERT INTO cliente(codigo, cpf, nome, senha, endereco, email, cep) values(?, ?, ?, ?, ?, ?, ?)";
    
        const [resultado] = await db.query(sql, [codigo, cpf, nome, senha, endereco, email, cep]);
    
        return resultado;
    } 

    async update(codigo, dados) {
        const columns = Object.keys(dados).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(dados), codigo];

        const sql = `UPDATE cliente SET ${columns} WHERE codigo = ?`;

        const [resultado] = await db.query(sql, values);
        
        return resultado.affectedRows > 0; 
    }

    async delete(codigo){
        const sql = "DELETE FROM cliente WHERE codigo = ?"; // = ? evita sql injection 
    
        const [resultado] = await db.query(sql, [codigo]);
    
        return resultado.affectedRows > 0;
    }
}




