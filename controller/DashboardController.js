import { ProdutoDAO } from "../database/DAO/ProdutoDAO.js";

export class DashboardController
{
    async renderDashboard(req,res) 
    {
        return res.render("dashboard"); // renderizar
    }
    
    async renderCriarProduto(req,res) 
    {
        return res.render("criarProduto"); // renderizar 
    }

    async renderListarProduto(req,res) 
    {
        const produtoDAO = new ProdutoDAO(); 
        const produtos = await produtoDAO.buscarTudo();
        
        return res.render("listarProduto", {produtos}); // renderizar 
    }

    async renderUpdateProduto(req,res)
    {
        const codigo = req.params.codigo; // extrai no link do site o código do produto 
        const produtoDAO = new ProdutoDAO(); 
        const produto = await produtoDAO.buscarCodigo(codigo);
        
        return res.render("updateProduto", {produto});
    }

}