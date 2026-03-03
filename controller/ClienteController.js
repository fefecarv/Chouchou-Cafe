import { ClienteDAO } from "../database/DAO/ClienteDAO.js";
import { Cliente } from "../model/Cliente.js";

export class ClienteController
{
    /** 
     * Realiza a autenticação do usuário (login)
     * 
     * Método POST: /login
     * Body:{"email": " "...", "senha": "..."}
     */

    async login(req, res)
    {
        const dao = new ClienteDAO();

        try{
            const { email, senha } = req.body;

            console.log(email, senha)

            // 1. Validação básica de entrada
            if (!email || !senha)
            {
                return res.status(400).json({ mensagem: "Email e senha são obrigatórios."})
            }

            // 2. Busca o usuário pelo Email
            const cliente = await dao.buscarEmail(email);

            console.log(cliente)
            // 3. Verifação de Segurança 
            // Se o usuário não existe OU a senha não bate, retornamos erro 401 (Unauthorized).
            // Atenção: Usamos uma mensagem genérica para evitar enumeração de usuários (pesquise mais a fundo sobre isso).
            if (cliente.length<1 || cliente[0].senha !== senha)
            {
                return res.status(401).json({ mensagem: "Email ou senha inválidos."});
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
            const clienteLogado = {
                cpf: cliente[0].cpf, // quando o banco traz traz em uma array por isso o [0].
                nome: cliente[0].nome,
                email: cliente[0].email,
                endereco: cliente[0].endereco,
                cep: cliente[0].cep
            }  
              
            res.redirect("/");
        }

        catch (erro)
        {
            console.log(erro);

            res.redirect("/login");

        }
    } 

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