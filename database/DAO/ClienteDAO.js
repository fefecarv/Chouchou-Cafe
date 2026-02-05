import db from '../mysql.js'
import { Cliente } from '../../model/Cliente.js';

export class ClienteDAO{
    constructor(){}
    async buscarTudo(){
        const sql = "SELECT * FROM cliente";
                                                    
        const [resultado] = await db.query(sql);

       return resultado.map(linha => new Cliente(
                linha.cpf, 
                linha.nome,
                linha.senha,  // ???????????????
                linha.email,
                linha.endereco,
                linha.cep
            ));
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

    async criar(cliente){
        const sql = "INSERT INTO cliente(cpf, nome, senha, endereco, email, cep) values( ?, ?, ?, ?, ?, ?)";
    
        const [resultado] = await db.query(sql, [cliente.getCpf(), cliente.getNome(), cliente.getSenha(), cliente.getEndereco(), cliente.getEmail(), cliente.getCep()]);
    
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




