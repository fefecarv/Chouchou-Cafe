import { Router } from 'express';
import { ClienteController } from './controller/ClienteController.js';
import { ProdutoController } from './controller/ProdutoController.js';
import { PedidoController } from './controller/PedidoController.js';
import { IndexController } from './controller/IndexController.js';
import { AuthController } from './controller/AuthController.js';
import { DashboardController } from './controller/DashboardController.js';

// Importando os Controllers

const router = Router();

// Instanciando os Controllers
const clienteController = new ClienteController();
const produtoController = new ProdutoController();
const pedidoController = new PedidoController();
const indexController = new IndexController();
const authController = new AuthController();
const dashboardController = new DashboardController();

// ROTAS DE EMPRESA
// ROTAS CLIENTE
router.get('/clientes', (req, res) => clienteController.listar(req, res)); // testado OK
router.get('/clientes/:codigo', (req, res) => clienteController.buscarCodigo(req, res)); // testado OK
router.post('/clientes', (req, res) => clienteController.criar(req, res)); // testado OK
router.put('/clientes/:codigo', (req, res) => clienteController.atualizar(req, res)); // testado OK
router.delete('/clientes/:codigo', (req, res) => clienteController.apagar(req, res)); // testado OK
// ROTAS PRODUTO
router.get('/produtos', (req, res) => indexController.renderProdutos(req, res)); // OK
router.get('/produtos/:codigo', (req, res) => produtoController.buscarCodigo(req, res)); // OK
router.post('/dashboard/produtos/novo', (req, res) => produtoController.criar(req, res)); // ele faz o post através do formulário emitido pelo site
router.post('/dashboard/produtos/update/:codigo', (req, res) => produtoController.atualizar(req, res)); // OK
router.post('/dashboard/produtos/delete/:codigo', (req, res) => produtoController.apagar(req, res)); // OK
// ROTAS PEDIDO
router.get('/pedidos', (req, res) => pedidoController.listar(req, res)); // OK
router.get('/pedidos/:codigoProduto/:codigoCliente', (req, res) => pedidoController.buscarPedido(req, res)); // OK
router.post('/pedidos', (req, res) => pedidoController.criar(req, res)); // OK
router.put('/pedidos/:codigoProduto/:codigoCliente', (req, res) => pedidoController.atualizar(req, res)); // OK
router.delete('/pedidos/:codigoProduto/:codigoCliente', (req, res) => pedidoController.apagar(req, res)); // OK
// ROTAS GERAIS
router.get('/', (req,res) => indexController.renderIndex(req,res)); 
router.get('/login', (req,res) => authController.renderLogin(req,res)); 
router.get('/cadastro', (req,res) => authController.renderCadastro(req,res)); 
router.post('/login', (req,res) => authController.login(req,res)); 
router.post('/logout', (req,res) => authController.logout(req,res)); 
router.get('/sobre-nos', (req, res) => indexController.renderSobreNos(req, res));
// ROTAS DASHBOARD
router.get('/dashboard', (req,res) => dashboardController.renderDashboard(req,res));
router.get('/dashboard/produtos/novo', (req,res) => dashboardController.renderCriarProduto(req,res));
router.get('/dashboard/produtos', (req, res) => dashboardController.renderListarProduto(req, res));
router.get('/dashboard/produtos/update/:codigo', (req, res) => dashboardController.renderUpdateProduto(req, res));

export { router };