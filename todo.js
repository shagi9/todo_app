const todoForm = document.querySelector("form");
const todoSelect = document.querySelector("select");
const todoInput = document.getElementById("todo-input");
const todoListUl = document.getElementById("todo-list");

const defaultStatus = 'uncompleted';
let uniqueId = 0;
let allTodos = [];

const init = () => {
  todoForm.addEventListener("submit", handleAddSubmit);
  todoSelect.addEventListener("change", filterTodos);
  todoListUl.addEventListener("click", handleTodoListClick);
}

const handleAddSubmit = (e) => {
  e.preventDefault();
  addTodo();
}

const filterTodos = (e) => {
  const filterValue = e.target.value;
  renderTodoList(allTodos.filter(todo => filterValue === 'all' || todo.status === filterValue));
}

const handleTodoListClick = (e) => {
  const { target } = e;

  if (target.classList.contains("delete-button")) {
    const todoIndex = parseInt(target.dataset.id);
    deleteTodo(todoIndex);
  }

  if (target.classList.contains("checkbox")) {
    const todoIndex = parseInt(target.dataset.id);
    toggleCheckbox(target, todoIndex);
  }
}

const deleteTodo = (todoIndex) => {
  allTodos = allTodos.filter(todo => todo.id !== todoIndex);
  renderTodoList(allTodos);
}

const toggleCheckbox = (checkbox, todoIndex) => {
  const todo = allTodos.find(todo => todo.id === todoIndex);
  todo.status = checkbox.checked ? 'completed' : 'uncompleted';
  renderTodoList(allTodos);
}

const addTodo = () => {
  const todoText = todoInput.value.trim();
  todoInput.value = '';

  if (todoText) {
    uniqueId += 1;
    allTodos.push({ id: uniqueId, text: todoText, status: defaultStatus });
    renderTodoList(allTodos);
  } else {
    alert('Please, enter a non-empty value');
  }
}

const renderTodoList = (todos) => {
  todoListUl.innerHTML = '';
  todos.forEach(todo => {
    todoListUl.appendChild(createTodoItem(todo));
  });
}

const createTodoItem = (todo) => {
  const todoLi = document.createElement("li");
  todoLi.id = `todo-${todo.id}`;
  todoLi.className = 'todo';

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = 'checkbox';
  checkbox.dataset.id = todo.id;
  checkbox.checked = todo.status === 'completed';

  const labelText = document.createElement("label");
  labelText.className = 'todo-text';
  labelText.textContent = todo.text;

  if (todo.status === 'completed') {
    labelText.style.textDecoration = 'line-through';
    labelText.style.color = '#005f7a';
  }

  const deleteButton = document.createElement("button");
  deleteButton.className = 'delete-button';
  deleteButton.textContent = 'Delete';
  deleteButton.dataset.id = todo.id;

  const editButton = document.createElement("button");
  editButton.className = 'edit-button';
  editButton.textContent = 'Edit';

  todoLi.append(checkbox, labelText, editButton, deleteButton);

  return todoLi;
}

init();