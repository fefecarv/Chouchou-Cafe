import { ClienteDAO } from "../database/DAO/ClienteDAO.js";
import { PedidoDAO } from "../database/DAO/PedidoDAO.js";
import { ProdutoDAO } from "../database/DAO/ProdutoDAO.js";
import { Pedido } from "../model/Pedido.js";

export class PedidoController
{

    /**
         * Lista todos os pedidos
         * 
         * Método GET: /pedidos/:codigo
         */
    
        async listar (req, res)
        {
            const dao = new PedidoDAO();
    
            try
            {
                const lista = await dao.buscarTudo();
    
            res.status(200).json(lista);
    
        }
        catch (erro)
        {
            console.log(erro);
    
            res.status(500).json({ mensagem: "Erro ao listar pedidos.", detalhe: erro.menssage });
        }
    }
     /**
     * Busca um pedido pelo CÓDIGO
     * 
     * Método GET: /pedido/:codigoProduto/:codidoCliente
     */ 
    async buscarPedido (req, res)
    {
        const dao = new PedidoDAO();

        try 
        {
            const codigoProduto = req.params.codigoProduto;
            const codigoCliente = req.params.codigoCliente;
            const pedido = await dao.buscarCodigo(codigoProduto, codigoCliente);
            
            if (!pedido)
            {
                return res.status(404).json({ mensagem: "Pedido não encontrado."});
            }
        
            const daoProduto = new ProdutoDAO();
            const daoCliente = new ClienteDAO();
            const produto = await daoProduto.buscarCodigo(codigoProduto);
            const nomeProduto = produto[0].nome;
            const cliente = await daoCliente.buscarCodigo(codigoCliente);
            const nomeCliente = cliente[0].nome;

            const PedidoInfo = pedido.map(pedido => 
        {
            return {
                nomeCliente,
                nomeProduto,
                status: pedido.status,
                cep: pedido.cep
            };
        });    

        res.status(200).json(PedidoInfo);     
        }
        catch (erro)
        {
            console.log(erro);

            res.status(500).json({ mensagem: "Erro ao buscar pedido.", detalhe: erro.mensagem }); // 500 = codigo de erro de servidor
        }
    }

    /**
     * Cadastra um novo pedido
     * Método POST: /pedidos
     */
    async criar(req, res)
    {
        const dao = new PedidoDAO();

        try 
        {
            const { clienteCodigo, produtoCodigo, status, cep } = req.body;

            const novoPedido = new Pedido(clienteCodigo, produtoCodigo, status, cep);
            
            await dao.criar(novoPedido);

            res.status(201).json({
                mensagem: "Pedido no carrinho."
            });
        }

        catch(erro)
        {
            console.log(erro);

            res.status(400).json({ mensagem: "Erro ao processar pedido.", detalhe: erro.message });
        
        }
    
    }


/**
 * Atualiza dados do pedido.
 * 
 * Método PUT: /pedidos/:codigoProduto/:codigoCliente
 */

async atualizar (req, res)
{
    const dao = new PedidoDAO();

    try 
    {
        const codigoProdutoUrl = req.params.codigoProduto;
        const codigoClienteUrl = req.params.codigoCliente;
        
        const {status} = req.body;
        const PedidoAntigo = await dao.buscarCodigo(codigoProdutoUrl, codigoClienteUrl);
                
        if(PedidoAntigo.length<1)
        {
        return res.status(404).json({ mensagem: "Pedido não encontrado para atualização." });
        }
        
        const pedidoAtualizado = new Pedido(codigoClienteUrl, codigoProdutoUrl, status || PedidoAntigo[0].status, PedidoAntigo[0].cep);

        const sucesso = await dao.update(codigoProdutoUrl, codigoClienteUrl, pedidoAtualizado);

        if(!sucesso)
        {
            return res.status(404).json({ mensagem: "Pedido não encontrado para atualização." });
        }

        res.status(200).json({ mensagem: "Pedido atualizado com sucesso!" });
    }

    catch (erro)
    {
        console.log(erro);

        res.status(400).json({ mensagem: "Erro ao atualizar pedidos.", detalhe: erro.message});
    }
}

/**
* Remove um usuário.
* 
* Método DELETE: /pedidos/:codigoProduto/:codigoCliente
*/

async apagar (req, res)
{
    const dao = new PedidoDAO;

    try
    {
        const codigoProduto = req.params.codigoProduto;
        const codigoCliente = req.params.codigoCliente;

        const sucesso = await dao.delete(codigoProduto, codigoCliente); //ordem DAO

        if (!sucesso)
        {
            return res.status(404).json({ mensagem: "Pedido não encontrado."});
        }  
        
        res.status(200).json({ mensagem: "Pedido excluído com sucesso!"});
    }

    catch (erro)
    {
        console.log(erro);

        if(erro.code && erro.code.includes("ROW_IS_REFERENCED"))
        {
            return res.status(409).json({ mensagem: "Não é possível excluir este pedido"})
        }

        res.status(500).json({ mensagem: " Erro ao excluir pedido.", detalhe: erro.message});
    }
}

}