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

function TodoItem(props) {
  return (<InputGroup key={props.id}>
    <InputGroup.Checkbox
      checked={props.completed}
      onChange={props.onToggle}
    />
    <FormControl value={props.title}
      style={{
        textDecoration: props.completed ? 'line-through 4px' : 'none'
      }}
    />
    <Button variant="outline-danger" onClick={props.onDelete}>
      <Trash />
    </Button>
  </InputGroup>);
}

function App() {
  // const todos = fetchTodos();
  const [todos, setTodos] = React.useState(fetchTodos());

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
        todos.map((todo) => (
          <TodoItem key={todo.id}
            title={todo.title}
            completed={todo.completed}
            onDelete={() => {
              setTodos(todos.filter((t) => t.id !== todo.id));
            }}
            onToggle={() => {
              setTodos(todos.map((t) =>
                t.id === todo.id ? { ...todo, completed: !todo.completed } : t
              )
              );
            }}
          />
        ))
      }
    </Container>
  </>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);
