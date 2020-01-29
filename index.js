// Importação do express
const express = require('express');

// Inicialização do express
const server = express();


// Convertendo no formato JSON
server.use(express.json());

const projects = []

// Middleware que verifica se existe um projeto
function checkProjectExists(req, res, next) {
  const { id } = req.params;

  if(!projects[id]){
    return res.status(400).json( { error: 'Project not found'})
  }

  return next();
}

// Middleware que exibe logs das requisições
function logRequest(req, res, next) {
  console.time('Request');

  console.log(`Método ${req.method}; URL: ${req.url}`);
  console.count("Número de Requisições");

  next();

  console.timeEnd('Request');
}

server.use(logRequest);

// Rota de cadastro de todos os projetos

server.post('/projects', (req, res) => {
    const { id, title, tasks } = req.body;
  
    projects.push({ id, title, tasks });
  
    return res.json(projects);
  });

// Rota de listagem de todos os projetos
server.get('/projects', (req, res) => {
  return res.json(projects);

});

// Rota de adição de uma nova tarefa a um projeto escolhido por ID
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find( pr => pr.id == id);

  project.tasks.push(title);

  return res.json(project);

});

// Rota para edição de um projeto pelo ID
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find( pr => pr.id == id );

  project.title = title;

  return res.json(project);

});

// Rota para exclusão de um projeto pelo ID
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  projects.splice( id , 1)

  return res.send();

})


server.listen(3000);