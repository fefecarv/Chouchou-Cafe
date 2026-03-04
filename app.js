import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';

// Configuração das variáveis de ambiente
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Permite que o navegador autorize requisições de outras portas (Ex.: http://localhost:3001).
app.use(cors());

// Configuração do EJS
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'view'));

app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, './Public/Assets')));

app.use(session({
    secret: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 
    resave: false,             
    saveUninitialized: false,  
    cookie: { 
        secure: false,         
        maxAge: 1000 * 60 * 60 
    }
}));

// Autorizando a chegada de dados do <form> no req.body
app.use(express.urlencoded({ extended: true }));

// Middleware para aceitar os métodos PUT e DELETE
// http://localhost:3000/empresas?method=PUT
app.use((req, res, next) =>
{
  if (req.query && req.query.method)
  {
    req.method = req.query.method.toUpperCase(); // PUT
  }

  next();

});

// app.use(express.static(path.join(__dirname, '../assets')));

// Rotas do arquivo routes.js
app.use(router);

// Continua como antes...
const PORT = process.env.WEB_PORT || 3000;

app.listen(PORT, () => 
{
  console.log(`\n🚀 Servidor rodando na porta ${PORT}.`);
  console.log(`📡 URL base: http://localhost:${PORT}.`);
  console.log(`-----------------------------------------`);
});

