export class IndexController
{
    async renderIndex(req,res) // exibe o arquivo index.ejs no navegador
    {
        const nome = "lojaCafé";

        return res.render("index", { nome });
    }

    async renderLogin(req,res)
    {
        return res.render("login");
    }

    async renderCadastro(req,res)
    {
        return res.render("cadastro");
    }

}

