import { createTodoItem } from './utils/domUtils.js';
import { TodoStatusEnum } from './enums/TodoStatusEnum.js';
import { loadTodosFromLocalStorage, saveTodosToLocalStorage } from './utils/localStorageUtils.js';
const todoForm = document.querySelector("form");
const todoSelect = document.querySelector("select");
const todoInput = document.getElementById("todo-input");
const todoListUl = document.getElementById("todo-list");
const defaultStatus = TodoStatusEnum.Uncompleted;
let uniqueId = 0;
let allTodos = [];
const init = () => {
    allTodos = loadTodosFromLocalStorage();
    uniqueId = allTodos.length > 0 ? Math.max(...allTodos.map(todo => todo.id)) : 0;
    renderTodoList(allTodos);
    todoForm.addEventListener("submit", handleAddTodoSubmit);
    todoSelect.addEventListener("change", filterTodos);
    todoListUl.addEventListener("click", handleTodoListClick);
    todoListUl.addEventListener("input", handleTodoListInput);
};
// handlers
const handleAddTodoSubmit = (e) => {
    e.preventDefault();
    addTodo();
};
const filterTodos = (e) => {
    const filterValue = e.target.value;
    const filteredTodos = allTodos.filter(todo => filterValue === TodoStatusEnum.All || todo.status === filterValue);
    renderTodoList(filteredTodos);
};
const handleTodoListClick = (e) => {
    const target = e.target;
    const todoIndex = parseInt(target.dataset.id || '0');
    if (target.matches(".delete-button"))
        deleteTodo(todoIndex);
    if (target.matches(".checkbox"))
        toggleCheckbox(todoIndex, target.checked);
    if (target.matches(".edit-button"))
        enableEditMode(todoIndex);
    if (target.matches(".edit-save-button"))
        saveEdit(todoIndex);
};
const handleTodoListInput = (e) => {
    const target = e.target;
    if (target.classList.contains("edit-input")) {
        const todoIndex = parseInt(target.dataset.id || '0');
        allTodos = allTodos.map(todo => todo.id === todoIndex ? Object.assign(Object.assign({}, todo), { text: target.value }) : todo);
        saveTodosToLocalStorage(allTodos); // Save after input change
    }
};
// actions
const deleteTodo = (todoIndex) => {
    allTodos = allTodos.filter(todo => todo.id !== todoIndex);
    renderTodoList(allTodos);
    saveTodosToLocalStorage(allTodos); // Save after deleting
};
const toggleCheckbox = (todoIndex, isChecked) => {
    const todo = allTodos.find(todo => todo.id === todoIndex);
    if (todo) {
        todo.status = isChecked ? TodoStatusEnum.Completed : TodoStatusEnum.Uncompleted;
        renderTodoList(allTodos);
        saveTodosToLocalStorage(allTodos); // Save after toggling
    }
};
const enableEditMode = (todoIndex) => {
    const todo = allTodos.find(todo => todo.id === todoIndex);
    if (todo) {
        todo.isEditing = true;
        renderTodoList(allTodos);
    }
};
const saveEdit = (todoIndex) => {
    const todo = allTodos.find(todo => todo.id === todoIndex);
    if (todo) {
        todo.isEditing = false;
        renderTodoList(allTodos);
        saveTodosToLocalStorage(allTodos); // Save after editing
    }
};
const addTodo = () => {
    const todoText = todoInput.value.trim();
    if (!todoText)
        return alert('Please, enter a non-empty value');
    todoInput.value = '';
    uniqueId++;
    allTodos.push({ id: uniqueId, text: todoText, status: defaultStatus, isEditing: false });
    todoInput.value = '';
    renderTodoList(allTodos);
    saveTodosToLocalStorage(allTodos); // Save after adding
};
// render items
const renderTodoList = (todos) => {
    todoListUl.innerHTML = '';
    todos.forEach(todo => {
        todoListUl.appendChild(createTodoItem(todo));
    });
};
init();
