import { ClienteDAO } from "../database/DAO/ClienteDAO.js";
import { Cliente } from "../model/Cliente.js";

export class ClienteController
{
    /**
     * Lista todos os clientes
     * 
     * Método GET: /clientes
     */

    async listar (req, res)
    {
        const dao = new ClienteDAO();

        try
        {
            const lista = await dao.buscarTudo();
        
        // "segura" porque não exibe senha do usuário
        const listaSegura = lista.map(cliente => 
        {
            return {
                cpf: cliente.getCpf(),
                nome: cliente.getNome(),
                email: cliente.getEmail(),
                endereco: cliente.getEndereco(),
                cep: cliente.getCep()
            };
        });

        res.status(200).json(listaSegura);

    }
    catch (erro)
    {
        console.log(erro);

        res.status(500).json({ mensagem: "Erro ao listar usúarios.", detalhe: erro.menssage });
    }
    }

     /**
     * Busca um usuário pelo CÓDIGO
     * 
     * Método GET: /clientes/:codigo
     */ 
    async buscarCodigo (req, res)
    {
        const dao = new ClienteDAO();

        try 
        {
            const codigo = req.params.codigo;
            const cliente = await dao.buscarCodigo(codigo);
            
            if (!cliente)
            {
                return res.status(404).json({ mensagem: "Cliente não encontrado."});
            }

        res.status(200).json(cliente);     
        }
        catch (erro)
        {
            console.log(erro);

            res.status(500).json({ mensagem: "Erro ao buscar cliente.", detalhe: erro.mensagem });
        }
    }

    /**
     * Cadastra um novo cliente
     * Método POST: /clientes
     */
    async criar(req, res)
    {
        const dao = new ClienteDAO();

        try 
        {
            const { cpf, nome, email, endereco, cep } = req.body;

            // Regra de Negócio: A senha inicial é gerada automaticamente baseada no CPF.
            const senhaTemporaria = cpf.replace(/\D/g, '').substring(0, 5);
        
            const novoCliente = new Cliente(cpf, nome, senhaTemporaria, email, endereco, cep);
            
            await dao.criar(novoCliente);

            // Retornamos sucesso, mas sem expor a senha gerada explicitamente no JSON de resposta,
            // apenas informamos que foi criado.
            res.redirect("/");
        }

        catch(erro)
        {
            console.log(erro);

           res.redirect("/cadastro");
        
        }
    
    }


/**
 * Atualiza dados do usuário.
 * 
 * Método PUT: /clientes/:codigo
 */

async atualizar (req, res)
{
    const dao = new ClienteDAO();

    try 
    {
        const codigoUrl = req.params.codigo;
        const { nome, email, endereco, cep} = req.body;

        const ClienteAntigo = await dao.buscarCodigo(codigoUrl);
        
        if(ClienteAntigo.length<1)
        {
          return res.status(404).json({ mensagem: "Cliente não encontrado para atualização." });
        }

        const clienteAtualizado = new Cliente(ClienteAntigo[0].cpf, nome || ClienteAntigo[0].nome, ClienteAntigo[0].senha, email || ClienteAntigo[0].email, endereco || ClienteAntigo[0].endereco, cep || ClienteAntigo[0].cep);

        const sucesso = await dao.update(codigoUrl, clienteAtualizado);

        if(!sucesso)
        {
            return res.status(404).json({ mensagem: "Cliente não encontrado para atualização." });
        }

        res.status(200).json({ mensagem: "Cliente atualizado com sucesso!" });
    }

    catch (erro)
    {
        console.log(erro);

        res.status(400).json({ mensagem: "Erro ao atualizar cliente.", detalhe: erro.message});
    }
}

/**
* Remove um usuário.
* 
* Método DELETE: /clientes/:codigo
*/

async apagar (req, res)
{
    const dao = new ClienteDAO;

    try
    {
        const codigo = req.params.codigo;

        const sucesso = await dao.delete(codigo);

        if (!sucesso)
        {
            return res.status(404).json({ mensagem: "Cliente não encontrado."});
        }  
        
        res.status(200).json({ mensagem: "Cliente excluído com sucesso!"});
    }

    catch (erro)
    {
        console.log(erro);

        if(erro.code && erro.code.includes("ROW_IS_REFERENCED"))
        {
            return res.status(409).json({ mensagem: "Não é possível excluir este cliente"})
        }

        res.status(500).json({ mensagem: " Erro ao excluir usuário.", detalhe: erro.message});
    }
}

}