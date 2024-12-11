// 引入 Bootstrap 样式文件，用于快速设置样式
import "bootstrap/dist/css/bootstrap.min.css";
// 引入 React 核心功能及相关钩子
import React, { useState, useEffect, useRef } from 'react';
// 引入 React Bootstrap 组件和图标，用于实现 UI 组件
import { Button, Navbar, Modal } from "react-bootstrap";
import { CardChecklist, Trash } from 'react-bootstrap-icons';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
// 引入 ReactDOM 用于渲染 React 组件
import ReactDOM from 'react-dom';

// 获取浏览器的 localStorage，用于持久化存储数据
const storage = window.localStorage;

/**
 * 自定义 Hook：useCallbackState
 * 用于在更新状态时支持异步回调，确保回调在状态更新后执行。
 * @param {any} initialState - 初始状态值
 * @returns {[any, function]} 状态值和更新状态的函数
 */
function useCallbackState(initialState) {
  const callbackRef = useRef(); // 存储回调函数的引用
  const [state, setState] = useState(initialState); // 定义状态

  useEffect(() => {
    // 在状态更新后调用回调函数
    if (callbackRef.current) {
      callbackRef.current(state);
    }
  }, [state]);

  // 包装的 setState 函数，支持回调
  const setStateWithCallback = (newState, callback) => {
    callbackRef.current = callback;
    setState(newState);
  };

  return [state, setStateWithCallback];
}

/**
 * 从 localStorage 获取待办事项列表
 * 如果不存在有效数据，则返回默认值。
 * @returns {Array} 待办事项列表
 */
function fetchTodos() {
  const todoTasks = storage.getItem("todoTasks");
  if (todoTasks) {
    try {
      return JSON.parse(todoTasks);
    } catch (error) {
      console.error("Failed to parse todoTasks from localStorage:", error);
    }
  }
  // 默认返回的待办事项
  return [
    {
      id: 1,
      title: "Hey, 这是一个用于追踪计划完成明细的清单，你可以点击下面的按钮，试着添加独属于你的计划任务",
      completed: false,
    },
  ];
}

/**
 * 主应用组件
 * 包括待办事项的列表显示、增删改查功能。
 */
function App() {
  // 使用自定义 Hook 管理待办事项的状态
  const [todos, setTodos] = useCallbackState(fetchTodos());
  // 控制模态框的显示状态
  const [showModal, setShowModal] = useState(false);

  // 关闭模态框
  const handleCloseModal = () => setShowModal(false);
  // 显示模态框
  const handleShowModal = () => setShowModal(true);

  /**
   * 添加新的待办事项
   */
  const handleAddItem = () => {
    const newTodo = {
      id: generateUUID(), // 生成唯一 ID
      title: document.getElementById("todoItem").value.trim(), // 获取输入框的值并去掉首尾空格
      completed: document.getElementById("ifCompleted").checked, // 获取是否完成的状态
    };

    // 校验输入，防止添加空任务
    if (!newTodo.title) {
      alert("待办事项标题不能为空！");
      return;
    }

    const updatedTodos = [...todos, newTodo]; // 使用扩展运算符生成新数组，确保状态不可变
    setTodos(updatedTodos, saveTodos); // 更新状态并保存到 localStorage
    setShowModal(false); // 关闭模态框
  };

  return (
    <>
      {/* 导航栏 */}
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <CardChecklist /> 待办清单
          </Navbar.Brand>
        </Container>
      </Navbar>

      {/* 待办事项列表 */}
      <Container>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id} // 使用唯一 ID 作为 key
            title={todo.title}
            completed={todo.completed}
            onDelete={() => {
              const filteredTodos = todos.filter((x) => x.id !== todo.id); // 过滤掉被删除的项
              setTodos(filteredTodos, saveTodos); // 更新状态并保存
            }}
            onToggle={() => {
              const toggledTodos = todos.map((x) =>
                x.id === todo.id ? { ...x, completed: !x.completed } : x
              ); // 切换完成状态
              setTodos(toggledTodos, saveTodos);
            }}
            onEdit={(event) => {
              const editedTodos = todos.map((x) =>
                x.id === todo.id ? { ...x, title: event.target.value.trim() } : x
              ); // 更新标题
              setTodos(editedTodos, saveTodos);
            }}
          />
        ))}
        <div className="d-grid gap-2">
          <Button variant="primary" size="lg" onClick={handleShowModal}>
            新增待办
          </Button>
        </div>
      </Container>

      {/* 新增待办模态框 */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>添加待办事项</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Checkbox aria-label="是否已完成" id="ifCompleted" />
            <FormControl
              aria-label="输入待办事项"
              id="todoItem"
              placeholder="输入待办任务，勾选左侧代表已完成"
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            取消
          </Button>
          <Button variant="primary" onClick={handleAddItem}>
            保存
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );

  /**
   * 保存待办事项到 localStorage
   */
  function saveTodos() {
    storage.setItem("todoTasks", JSON.stringify(todos));
  }

  /**
   * 待办事项子组件
   * @param {object} props - 待办事项的属性
   */
  function TodoItem({ title, completed, onDelete, onToggle, onEdit }) {
    return (
      <InputGroup>
        <InputGroup.Checkbox checked={completed} onChange={onToggle} />
        <FormControl
          defaultValue={title}
          onBlur={onEdit}
          style={{
            textDecoration: completed ? "line-through 4px" : "none", // 已完成任务添加删除线
          }}
        />
        <Button variant="outline-danger" onClick={onDelete}>
          <Trash />
        </Button>
      </InputGroup>
    );
  }

  /**
   * 生成唯一 ID
   * 使用随机数和时间戳的组合，确保唯一性
   * @returns {string} 唯一 ID
   */
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

// 将主应用组件渲染到 DOM 中的指定节点
ReactDOM.render(<App />, document.getElementById('root'));