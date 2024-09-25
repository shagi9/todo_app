enum TodoStatusString {
  Completed = 'completed',
  Uncompleted = 'uncompleted',
  All = 'all'
}

type TodoStatus = TodoStatusString.Completed | TodoStatusString.Uncompleted | TodoStatusString.All;

interface Todo {
  id: number;
  text: string;
  status: TodoStatus;
  isEditing: boolean;
}

const todoForm = document.querySelector("form") as HTMLFormElement;
const todoSelect = document.querySelector("select") as HTMLSelectElement;
const todoInput = document.getElementById("todo-input") as HTMLInputElement;
const todoListUl = document.getElementById("todo-list") as HTMLUListElement;

const defaultStatus: TodoStatus = TodoStatusString.Uncompleted;
let uniqueId = 0;
let allTodos: Todo[] = [];

const init = (): void => {
  loadTodosFromLocalStorage();
  todoForm.addEventListener("submit", handleAddTodoSubmit);
  todoSelect.addEventListener("change", filterTodos);
  todoListUl.addEventListener("click", handleTodoListClick);
  todoListUl.addEventListener("input", handleTodoListInput);
}

const saveTodosToLocalStorage = (): void => {
  localStorage.setItem('todos', JSON.stringify(allTodos));
};

const loadTodosFromLocalStorage = (): void => {
  const storedTodos = localStorage.getItem('todos');
  if (storedTodos) {
    allTodos = JSON.parse(storedTodos) as Todo[];
    uniqueId = allTodos.length > 0 ? Math.max(...allTodos.map(todo => todo.id)) : 0;
    renderTodoList(allTodos);
  }
};

const handleAddTodoSubmit = (e: Event): void => {
  e.preventDefault();
  addTodo();
}

const filterTodos = (e: Event): void => {
  const filterValue = (e.target as HTMLSelectElement).value as TodoStatus;
  const filteredTodos = allTodos.filter(todo => filterValue === TodoStatusString.All || todo.status === filterValue);
  renderTodoList(filteredTodos);
}

const handleTodoListClick = (e: Event): void => {
  const target = e.target as HTMLElement;
  const todoIndex = parseInt(target.dataset.id || '0');
  
  if (target.matches(".delete-button")) deleteTodo(todoIndex);
  if (target.matches(".checkbox")) toggleCheckbox(todoIndex, (target as HTMLInputElement).checked);
  if (target.matches(".edit-button")) enableEditMode(todoIndex);
  if (target.matches(".edit-save-button")) saveEdit(todoIndex);
}

const handleTodoListInput = (e: Event): void => {
  const target = e.target as HTMLInputElement;
  if (target.classList.contains("edit-input")) {
    const todoIndex = parseInt(target.dataset.id || '0');
    allTodos = allTodos.map(todo => todo.id === todoIndex ? { ...todo, text: target.value } : todo);
    saveTodosToLocalStorage();  // Save after input change
  }
}

const deleteTodo = (todoIndex: number): void => {
  allTodos = allTodos.filter(todo => todo.id !== todoIndex);
  renderTodoList(allTodos);
  saveTodosToLocalStorage();  // Save after deleting
}

const toggleCheckbox = (todoIndex: number, isChecked: boolean): void => {
  const todo = allTodos.find(todo => todo.id === todoIndex);
  if (todo) {
    todo.status = isChecked ? TodoStatusString.Completed : TodoStatusString.Uncompleted;
    renderTodoList(allTodos);
    saveTodosToLocalStorage();  // Save after toggling
  }
};

const enableEditMode = (todoIndex: number): void => {
  const todo = allTodos.find(todo => todo.id === todoIndex);
  if (todo) {
    todo.isEditing = true;
    renderTodoList(allTodos);
  }
}

const saveEdit = (todoIndex: number): void => {
  const todo = allTodos.find(todo => todo.id === todoIndex);
  if (todo) {
    todo.isEditing = false;
    renderTodoList(allTodos);
    saveTodosToLocalStorage();  // Save after editing
  }
}

const addTodo = (): void => {
  const todoText = todoInput.value.trim();
  if (!todoText) return alert('Please, enter a non-empty value');

  todoInput.value = '';

  uniqueId++;
  allTodos.push({ id: uniqueId, text: todoText, status: defaultStatus, isEditing: false });
  todoInput.value = '';
  renderTodoList(allTodos);
  saveTodosToLocalStorage();  // Save after adding
}

const createButton = (text: string, className: string, dataId: number): HTMLButtonElement => {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = className;
  button.dataset.id = dataId.toString();
  return button;
};

const createInput = (type: string, className: string, value: string, dataId: number): HTMLInputElement => {
  const input = document.createElement("input");
  input.type = type;
  input.className = className;
  input.value = value;
  input.dataset.id = dataId.toString();
  return input;
};

const createTodoItem = (todo: Todo): HTMLLIElement => {
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
    checkbox.checked = todo.status === TodoStatusString.Completed;

    const labelText = document.createElement("label");
    labelText.className = 'todo-text';
    labelText.textContent = todo.text;
    if (todo.status === TodoStatusString.Completed) {
      labelText.style.textDecoration = 'line-through';
      labelText.style.color = '#005f7a';
    }

    todoLi.append(checkbox, labelText, createButton("Edit", "edit-button", todo.id), createButton("Delete", "delete-button", todo.id));
  }

  return todoLi;
};

const renderTodoList = (todos: Todo[]): void => {
  todoListUl.innerHTML = '';
  todos.forEach(todo => {
    todoListUl.appendChild(createTodoItem(todo));
  });
}

init();