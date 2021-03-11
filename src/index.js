const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

    const user = users.find(user => user.username === username);

    if(!user) {
        return response.status(400).send({ error: "User not Found!" });
    }

    // Retorna a Conta para recuperar na Rota
    request.user = user;

    return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreadyExists = users.some(
    (user) => user.username === username
  );

  if(userAlreadyExists) {
    return response.status(400).json({ error: "User already exists! " });
  }

  const user = { 
    id: uuidv4(), // precisa ser um uuid
    name: name, 
    username: username, 
    todos: []
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;

  const todosOperation = { 
    id: uuidv4(), // precisa ser um uuid
    title: title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  };

  user.todos.push(todosOperation);

  return response.status(201).send();

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const getTodoID = user.todos.findIndex((todo) => todo.id === id);
  user.todos[getTodoID].title = title;
  user.todos[getTodoID].deadline = deadline;

  return response.status(201).send();
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const getTodoID = user.todos.findIndex((todo) => todo.id === id);
  user.todos[getTodoID].done = true;

  return response.status(201).send();
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const getTodoID = user.todos.findIndex((todo) => todo.id === id);

  user.todos.splice(getTodoID, 1);

  return response.status(200).json(user.todos);
});

module.exports = app;