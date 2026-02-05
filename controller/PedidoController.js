import { PedidoDAO } from "../database/DAO/PedidoDAO.js";
import { Pedido } from "../model/Pedido.js";

export class PedidoController
{

    /**
     * Lista todos os pedidos
     * 
     * Método GET: /pedido
     */

    async listar (req, res)
    {
        const dao = new PedidoDAO();

        try
        {
            const lista = await dao.buscarTudo();
        
        // "segura" porque não exibe senha do usuário
        const listaSegura = lista.map(pedido => 
        {
            return {
                clienteCodigo: pedido.getClienteCodigo(),
                pedidoCodigo: pedido.getProdutoCodigo(),
                status: pedido.getStatus(),
                cpf: pedido.getCep(),
            };
        });

        res.status(200).json(listaSegura);

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

        res.status(200).json(pedido);     
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
        
        const { clienteCodigo, produtoCodigo, status, cep } = req.body;

        const pedidoAtualizado = new Pedido( codigoClienteUrl, codigoProdutoUrl, status, cep);

        const sucesso = await dao.atualizar(pedidoAtualizado);

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

        const sucesso = await dao.apagar(codigoProduto, codigoCliente); //ordem DAO

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