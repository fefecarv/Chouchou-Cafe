import { ProdutoDAO } from "../database/DAO/ProdutoDAO.js";

export class IndexController
{
    async renderIndex(req,res) // exibe o arquivo index.ejs no navegador
    {
        let user; // sessão do usuário
        const produtoDAO = new ProdutoDAO(); // instanciar o objeto
        const produtos = await produtoDAO.buscarTudo(); // busca todos os produtos cadastrados (await espera o bdd processar a requisição)


        return res.render("index", { user, req, produtos }); 
    }

    async renderProdutos(req,res) 
    {
        let user;
        const produtoDAO = new ProdutoDAO(); 
        const produtos = await produtoDAO.buscarTudo();


        return res.render("produtos", { user, req, produtos }); 
    }

    async renderSobreNos(req, res)
    {
        let user; 
        
        return res.render("sobreNos", {user, req});
    }


}

