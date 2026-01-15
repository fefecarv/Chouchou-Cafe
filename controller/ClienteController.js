import { ClienteDAO } from "../database/DAO/ClienteDAO";

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

            // 1. Validação básica de entrada
            if (!email || !senha)
            {
                return res.status(400).json({ mensagem: "Email e senha são obrigatórios."})
            }

            // 2. Busca o usuário pelo Email
            const cliente = await dao.buscarEmail(email);

            // 3. Verifação de Segurança 
            // Se o usuário não existe OU a senha não bate, retornamos erro 401 (Unauthorized).
            // Atenção: Usamos uma mensagem genérica para evitar enumeração de usuários (pesquise mais a fundo sobre isso).
            if (!cliente || cliente.getSenha() !== senha)
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
                cpf: cliente.getCpf(),
                nome: cliente.getNome(),
                email: cliente.getEmail(),
                endereco: cliente.getEndereco(),
                cep: cliente.getCep()
            };

            res.status(200).json({
                mensagem: "Login realizado com sucesso!",
                cliente: clienteLogado
            });
        }

        catch (erro)
        {
            console.log(erro);

            res.status(500).json({mensagem: "Erro interno no servidor ao realizar login.", detalhe: erro.mensagem });
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
        
            const novoCliente = new ClienteModel(cpf, nome, email, endereco, cep);
            
            await dao.criar(novoCliente);

            // Retornamos sucesso, mas sem expor a senha gerada explicitamente no JSON de resposta,
            // apenas informamos que foi criado.
            res.status(201).json({
                mensagem: "Cliente criado com sucesso! A senha padrão são os 5 primeiros dígitos do CPF."
            });
        }

        catch(erro)
        {
            console.log(erro);

            if (erro.code == 'ER_DUP_ENTRY')
            {
                return res.status(409).json({ mensagem: "Já existe um usuário cadastrado com este CPF ou e-mail."});
            }

            res.status(400).json({ mensagem: "Erro ao cadastrar usuário.", detalhe: erro.message });
        
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

        const clienteAtualizado = new ClienteModel( codigoUrl, nome, email, endereco, cep);

        const sucesso = await dao.atualizar(clienteAtualizado);

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

        const sucesso = await dao.apagar(codigo);

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