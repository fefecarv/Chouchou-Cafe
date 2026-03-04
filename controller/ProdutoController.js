import { ProdutoDAO } from "../database/DAO/ProdutoDAO.js";
import { Produto } from "../model/Produto.js";

export class ProdutoController
{

    /**
     * Lista todos os produtos
     * 
     * Método GET: /produto/:codigo
     */

    async listar (req, res)
    {
        const dao = new ProdutoDAO();

        try
        {
            const lista = await dao.buscarTudo();

        res.status(200).json(lista);

    }
    catch (erro)
    {
        console.log(erro);

        res.status(500).json({ mensagem: "Erro ao listar produtos.", detalhe: erro.menssage });
    }
    }

     /**
     * Busca um produto pelo CÓDIGO
     * 
     * Método GET: /produto/:codigo
     */ 
    async buscarCodigo (req, res)
    {
        const dao = new ProdutoDAO();

        try 
        {
            const codigo = req.params.codigo;
            const produto = await dao.buscarCodigo(codigo);
            
            if (!produto)
            {
                return res.status(404).json({ mensagem: "Produto não encontrado."});
            }

        res.status(200).json(produto);     
        }
        catch (erro)
        {
            console.log(erro);

            res.status(500).json({ mensagem: "Erro ao buscar produto.", detalhe: erro.mensagem }); // 500 = codigo de erro de servidor
        }
    }

    /**
     * Cadastra um novo produto
     * Método POST: /produtos
     */
    async criar(req, res)
    {
        const dao = new ProdutoDAO();

        try 
        {
            const { nome, preco, fotolink, descricao, categoria, unidade } = req.body;

            const novoProduto = new Produto(nome, preco, fotolink, descricao, categoria, unidade);
            
            await dao.criar(novoProduto);

            res.redirect("/dashboard/produtos");
        }

        catch(erro)
        {
            console.log(erro);

            res.status(400).json({ mensagem: "Erro ao criar produto.", detalhe: erro.message });
        
        }
    
    }


/**
 * Atualiza dados do produto.
 * 
 * Método PUT: /produtos/:codigoProduto/:codigoCliente
 */

async atualizar (req, res)
{
    const dao = new ProdutoDAO();

    try 
    {
        const codigoUrl = req.params.codigo;
        
        const { nome, preco, fotolink, descricao, categoria, unidade } = req.body;

        const ProdutoAntigo = await dao.buscarCodigo(codigoUrl);
                
        if(ProdutoAntigo.length<1)
        {
        return res.status(404).json({ mensagem: "Produto não encontrado para atualização." });
        }
        
        const produtoAtualizado = new Produto(nome || ProdutoAntigo[0].nome, preco || ProdutoAntigo[0].preco, fotolink || ProdutoAntigo[0].fotoLink, descricao || ProdutoAntigo[0].descricao, categoria || ProdutoAntigo[0].categoria, unidade || ProdutoAntigo[0].unidade);

        const sucesso = await dao.update(codigoUrl, produtoAtualizado);

        if(!sucesso)
        {
            return res.status(404).json({ mensagem: "Produto não encontrado para atualização." });
        }

        res.redirect("/dashboard/produtos");
    }

    catch (erro)
    {
        console.log(erro);

        res.status(400).json({ mensagem: "Erro ao atualizar produtos.", detalhe: erro.message}); // 400 erro do usuário
    }
}

/**
* Remove um produto.
* 
* Método DELETE: /produtos/:codigoProduto/:codigoCliente
*/

async apagar (req, res)
{
    const dao = new ProdutoDAO;

    try
    {
        const codigo = req.params.codigo;
    
        const sucesso = await dao.delete(codigo); //ordem DAO

        if (!sucesso)
        {
            return res.status(404).json({ mensagem: "Produto não encontrado."});
        }  
        
        res.redirect("/dashboard/produtos");
    }

    catch (erro)
    {
        console.log(erro);

        if(erro.code && erro.code.includes("ROW_IS_REFERENCED"))
        {
            return res.status(409).json({ mensagem: "Não é possível excluir este produto"})
        }

        res.status(500).json({ mensagem: " Erro ao excluir produto.", detalhe: erro.message});
    }
}

}