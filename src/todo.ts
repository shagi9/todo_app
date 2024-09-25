import { TodoStatusEnum } from './enums/TodoStatusEnum';
import { TodoModel } from './interfaces/TodoModel';
import { TodoStatusType } from './types/TodoStatusType';
import { loadTodosFromLocalStorage, saveTodosToLocalStorage } from './utils/localStorageUtils';

const todoForm = document.querySelector("form") as HTMLFormElement;
const todoSelect = document.querySelector("select") as HTMLSelectElement;
const todoInput = document.getElementById("todo-input") as HTMLInputElement;
const todoListUl = document.getElementById("todo-list") as HTMLUListElement;

const defaultStatus: TodoStatusType = TodoStatusEnum.Uncompleted;
let uniqueId = 0;
let allTodos: TodoModel[] = [];

const init = (): void => {
  allTodos = loadTodosFromLocalStorage();
  uniqueId = allTodos.length > 0 ? Math.max(...allTodos.map(todo => todo.id)) : 0;
  renderTodoList(allTodos);
  todoForm.addEventListener("submit", handleAddTodoSubmit);
  todoSelect.addEventListener("change", filterTodos);
  todoListUl.addEventListener("click", handleTodoListClick);
  todoListUl.addEventListener("input", handleTodoListInput);
}

const handleAddTodoSubmit = (e: Event): void => {
  e.preventDefault();
  addTodo();
}

const filterTodos = (e: Event): void => {
  const filterValue = (e.target as HTMLSelectElement).value as TodoStatusType;
  const filteredTodos = allTodos.filter(todo => filterValue === TodoStatusEnum.All || todo.status === filterValue);
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
    saveTodosToLocalStorage(allTodos);  // Save after input change
  }
}

const deleteTodo = (todoIndex: number): void => {
  allTodos = allTodos.filter(todo => todo.id !== todoIndex);
  renderTodoList(allTodos);
  saveTodosToLocalStorage(allTodos);  // Save after deleting
}

const toggleCheckbox = (todoIndex: number, isChecked: boolean): void => {
  const todo = allTodos.find(todo => todo.id === todoIndex);
  if (todo) {
    todo.status = isChecked ? TodoStatusEnum.Completed : TodoStatusEnum.Uncompleted;
    renderTodoList(allTodos);
    saveTodosToLocalStorage(allTodos);  // Save after toggling
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
    saveTodosToLocalStorage(allTodos);  // Save after editing
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
  saveTodosToLocalStorage(allTodos);  // Save after adding
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

const createTodoItem = (todo: TodoModel): HTMLLIElement => {
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
    checkbox.checked = todo.status === TodoStatusEnum.Completed;

    const labelText = document.createElement("label");
    labelText.className = 'todo-text';
    labelText.textContent = todo.text;
    if (todo.status === TodoStatusEnum.Completed) {
      labelText.style.textDecoration = 'line-through';
      labelText.style.color = '#005f7a';
    }

    todoLi.append(checkbox, labelText, createButton("Edit", "edit-button", todo.id), createButton("Delete", "delete-button", todo.id));
  }

  return todoLi;
};

const renderTodoList = (todos: TodoModel[]): void => {
  todoListUl.innerHTML = '';
  todos.forEach(todo => {
    todoListUl.appendChild(createTodoItem(todo));
  });
}

init();