import { Router } from 'express';
import { ClienteController } from './controller/ClienteController.js';

// Importando os Controllers

const router = Router();

// Instanciando os Controllers
const clienteController = new ClienteController();


// ROTAS DE EMPRESA
router.get('/clientes', (req, res) => clienteController.listar(req, res));
router.get('/clientes/:codigo', (req, res) => clienteController.buscarCodigo(req, res));
router.post('/clientes', (req, res) => clienteController.criar(req, res));
router.put('/clientes/:codigo', (req, res) => clienteController.atualizar(req, res));
router.delete('/clientes/:codigo', (req, res) => clienteController.apagar(req, res));

export { router };