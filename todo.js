const todoForm = document.querySelector("form");
const todoSelect = document.querySelector("select");
const todoInput = document.getElementById("todo-input");
const todoListUl = document.getElementById("todo-list");

const defaultStatus = 'uncompleted';
let uniqueId = 0;
let allTodos = [];

const init = () => {
  todoForm.addEventListener("submit", handleAddTodoSubmit);
  todoSelect.addEventListener("change", filterTodos);
  todoListUl.addEventListener("click", handleTodoListClick);
  todoListUl.addEventListener("input", handleTodoListInput);
}

const handleAddTodoSubmit = (e) => {
  e.preventDefault();
  addTodo();
}

const filterTodos = (e) => {
  const filterValue = e.target.value;
  const filteredTodos = allTodos.filter(todo => filterValue === 'all' || todo.status === filterValue);
  renderTodoList(filteredTodos);
}

const handleTodoListClick = (e) => {
  const todoIndex = parseInt(e.target.dataset.id);
  
  if (e.target.matches(".delete-button")) deleteTodo(todoIndex);
  if (e.target.matches(".checkbox")) toggleCheckbox(todoIndex, e.target.checked);
  if (e.target.matches(".edit-button")) enableEditMode(todoIndex);
  if (e.target.matches(".edit-save-button")) saveEdit(todoIndex);
}

const handleTodoListInput = (e) => {
  if (e.target.classList.contains("edit-input")) {
    const todoIndex = parseInt(e.target.dataset.id);
    allTodos = allTodos.map(todo => todo.id === todoIndex ? { ...todo, text: e.target.value } : todo);
  }
}

const deleteTodo = (todoIndex) => {
  allTodos = allTodos.filter(todo => todo.id !== todoIndex);
  renderTodoList(allTodos);
}

const toggleCheckbox = (todoIndex, isChecked) => {
  const todo = allTodos.find(todo => todo.id === todoIndex);
  todo.status = isChecked ? 'completed' : 'uncompleted';
  renderTodoList(allTodos);
};

const enableEditMode = (todoIndex) => {
  const todo = allTodos.find(todo => todo.id === todoIndex);
  todo.isEditing = true;
  renderTodoList(allTodos);
}

const saveEdit = (todoIndex) => {
  const todo = allTodos.find(todo => todo.id === todoIndex);
  todo.isEditing = false;
  renderTodoList(allTodos);
}

const addTodo = () => {
  const todoText = todoInput.value.trim();
  if (!todoText) return alert('Please, enter a non-empty value');

  todoInput.value = '';

  uniqueId++;
  allTodos.push({ id: uniqueId, text: todoText, status: defaultStatus, isEditing: false });
  todoInput.value = '';
  renderTodoList(allTodos);
}

const createButton = (text, className, dataId) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = className;
  button.dataset.id = dataId;
  return button;
};

const createInput = (type, className, value, dataId) => {
  const input = document.createElement("input");
  input.type = type;
  input.className = className;
  input.value = value;
  input.dataset.id = dataId;
  return input;
};

const createTodoItem = (todo) => {
  const todoLi = document.createElement("li");
  todoLi.id = `todo-${todo.id}`;
  todoLi.className = `todo ${todo.isEditing ? 'edit-mode' : ''}`;

  const inputsContainer = document.createElement("div");
  inputsContainer.className = 'inputs-container';

  if (todo.isEditing) {
    const editInput = createInput("text", "edit-input", todo.text, todo.id);
    const saveButton = createButton("Save", "edit-save-button", todo.id);
    inputsContainer.append(editInput, saveButton);
    todoLi.append(inputsContainer, createButton("Delete", "delete-button", todo.id));
  } else {
    const checkbox = createInput("checkbox", "checkbox", "", todo.id);
    checkbox.checked = todo.status === 'completed';

    const labelText = document.createElement("label");
    labelText.className = 'todo-text';
    labelText.textContent = todo.text;
    if (todo.status === 'completed') {
      labelText.style.textDecoration = 'line-through';
      labelText.style.color = '#005f7a';
    }

    todoLi.append(checkbox, labelText, createButton("Edit", "edit-button", todo.id), createButton("Delete", "delete-button", todo.id));
  }

  return todoLi;
};

const renderTodoList = (todos) => {
  todoListUl.innerHTML = '';
  todos.forEach(todo => {
    todoListUl.appendChild(createTodoItem(todo));
  });
}

init();