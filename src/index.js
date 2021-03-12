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

function checkExistsTodo(request, response, next) {
  const { username } = request.headers;
  const { id } = request.params;

  const user = users.find((user) => user.username === username);

  if (user !== undefined && user.todos !== undefined) {
    const todo = user.todos.find((todo) => todo.id === id);

    if (user && todo) {
      request.user = user;
      request.todo = todo;

      return next();
    } else {
      return response.status(404).json({ error: "To do not found" });
    }
  } else {
    return response.status(404).json({ error: "undefined user/todos" });
  }

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreadyExists = users.some(
    (user) => user.username === username
  );

  if(userAlreadyExists) {
    return response.status(400).json({ error: "Username already exists" });
  }

  if (name !== undefined && username !== undefined) {
  

    const user = {
      id: uuidv4(),
      name: name,
      username: username,
      pro: false,
      todos: []
    };
  
    users.push(user);
  
    return response.status(201).json(user);
  } else {
    return response.status(400).json({error: "undefined name/username!"});
  }
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const newTodo = {
    id: uuidv4(),
    title,
    deadline: new Date(deadline),
    done: false,
    created_at: new Date()
  };

  user.todos.push(newTodo);

  return response.status(201).json(newTodo);

});

app.put('/todos/:id', checksExistsUserAccount, checkExistsTodo, (request, response) => {
  const { title, deadline } = request.body;
  const { todo } = request;

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(201).send(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, checkExistsTodo, (request, response) => {
  const { todo } = request;

  todo.done = true;

  return response.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, checkExistsTodo, (request, response) => {
  // Complete aqui
  const { user, todo } = request;

  user.todos.splice(todo, 1);

  return response.status(204).json(user.todos);
});

module.exports = app;