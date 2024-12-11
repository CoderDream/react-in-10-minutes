import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Button, Navbar, Modal } from "react-bootstrap";
import { CardChecklist, Trash } from 'react-bootstrap-icons';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

function fetchTodos() {
  return [{ id: 1, title: "吃饭", completed: false },
  { id: 2, title: "刷牙", completed: false },
  { id: 3, title: "喝水", completed: true },
  { id: 4, title: "洗澡", completed: false },
  { id: 5, title: "睡觉", completed: true }];
}

function App() {
  const todos = fetchTodos();

  return <>
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">
          <CardChecklist /> 待办事项
        </Navbar.Brand>
      </Container>
    
    </Navbar>

    <Container>
      {
        todos.map(todo => (<InputGroup key={todo.id}>
          <InputGroup.Checkbox checked={todo.completed} />
          <FormControl value={todo.title}
            style={{
              textDecoration: todo.completed ? 'line-through 4px' : 'none'
            }}
          />
        </InputGroup>))
      }
    </Container>
  </>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);
