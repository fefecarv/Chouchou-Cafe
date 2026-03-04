import { ProdutoDAO } from "../database/DAO/ProdutoDAO.js";

export class IndexController
{
    async renderIndex(req,res) // exibe o arquivo index.ejs no navegador
    {
        let user;
        const produtoDAO = new ProdutoDAO(); // instanciar o objeto
        const produtos = await produtoDAO.buscarTudo();


        return res.render("index", { user, req, produtos }); // renderizar o nome do usuário
    }

}

