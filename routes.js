import { Router } from 'express';
import { ClienteController } from './controller/ClienteController.js';
import { ProdutoController } from './controller/ProdutoController.js';
import { PedidoController } from './controller/PedidoController.js';

// Importando os Controllers

const router = Router();

// Instanciando os Controllers
const clienteController = new ClienteController();
const produtoController = new ProdutoController();
const pedidoController = new PedidoController();

// ROTAS DE EMPRESA
// ROTAS CLIENTE
router.get('/clientes', (req, res) => clienteController.listar(req, res)); // testado OK
router.get('/clientes/:codigo', (req, res) => clienteController.buscarCodigo(req, res)); // testado OK
router.post('/clientes', (req, res) => clienteController.criar(req, res)); // testado OK
router.put('/clientes/:codigo', (req, res) => clienteController.atualizar(req, res)); // testado OK
router.delete('/clientes/:codigo', (req, res) => clienteController.apagar(req, res)); // testado OK
// ROTAS PRODUTO
router.get('/produtos', (req, res) => produtoController.listar(req, res)); // OK
router.get('/produtos/:codigo', (req, res) => produtoController.buscarCodigo(req, res)); // OK
router.post('/produtos', (req, res) => produtoController.criar(req, res)); // OK
router.put('/produtos/:codigo', (req, res) => produtoController.atualizar(req, res)); // OK
router.delete('/produtos/:codigo', (req, res) => produtoController.apagar(req, res)); // OK
// ROTAS PEDIDO
router.get('/pedidos', (req, res) => pedidoController.listar(req, res)); // OK
router.get('/pedidos/:codigoProduto/:codigoCliente', (req, res) => pedidoController.buscarPedido(req, res)); // OK
router.post('/pedidos', (req, res) => pedidoController.criar(req, res)); // OK
router.put('/pedidos/:codigoProduto/:codigoCliente', (req, res) => pedidoController.atualizar(req, res)); // OK
router.delete('/pedidos/:codigoProduto/:codigoCliente', (req, res) => pedidoController.apagar(req, res)); // OK
export { router };