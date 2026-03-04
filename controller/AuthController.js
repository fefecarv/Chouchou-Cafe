import { ClienteDAO } from "../database/DAO/ClienteDAO.js";
import { Cliente } from "../model/Cliente.js";

export class AuthController {

    async renderLogin(req, res) {
        return res.render("login");
    }

    /** 
         * Realiza a autenticação do usuário (login)
         * 
         * Método POST: /login
         * Body:{"email": " "...", "senha": "..."}
         */

    async login(req, res) {
        const dao = new ClienteDAO();

        try {
            const { email, senha } = req.body;

            // 1. Validação básica de entrada
            if (!email || !senha) {
                return res.status(400).json({ mensagem: "Email e senha são obrigatórios." })
            }

            // 2. Busca o usuário pelo Email
            const cliente = await dao.buscarEmail(email);

            // 3. Verifação de Segurança 
            // Se o usuário não existe OU a senha não bate, retornamos erro 401 (Unauthorized).
            // Atenção: Usamos uma mensagem genérica para evitar enumeração de usuários (pesquise mais a fundo sobre isso).
            if (cliente.length < 1 || cliente[0].senha !== senha) {
                return res.status(401).json({ mensagem: "Email ou senha inválidos." });
            }

            // 4. Sanitização (Remover dados sensíveis antes de enviar pro Front)
            // Criamos um objeto simples apenas com o que o Front precisa saber.
            /**
           * método construtor da classe cliente
           * 
           * @param {string} cpf cpf do cliente 
           * @param {string} n nome cliente
           * @param {string} s senha cliente 
           * @param {string} e email cliente
           * @param {string} end endereço cliente
           * @param {string} cep cep cliente 
           */
            req.session.user = {
                cpf: cliente[0].cpf, // quando o banco traz traz em uma array por isso o [0].
                nome: cliente[0].nome,
                email: cliente[0].email,
                endereco: cliente[0].endereco,
                cep: cliente[0].cep
            }

        res.redirect("/");
        }

        catch (erro) {
            console.log(erro);

            res.redirect("/login");

        }
    }

    async renderCadastro(req, res) {
        return res.render("cadastro");
    }

    async logout(req,res) {
        req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao destruir sessão:', err);
            return res.status(500).send('Erro ao fazer logout');
        }

        res.clearCookie('connect.sid'); 
        res.redirect('/login');
    });
    }
}