const todoForm = document.querySelector("form");
const todoInput = document.getElementById("todo-input");
const todoListUl = document.getElementById("todo-list");

let uniqueId = 0;
let allTodos = [];

todoForm.addEventListener("submit", function(e) {
  e.preventDefault();
  addTodo();
})

const addTodo = () => {
  const todoText = todoInput.value.trim();
  todoInput.value = '';

  if (todoText.length > 0) {
    uniqueId += 1;
    allTodos.push({
      id: uniqueId,
      text: todoText
    });
    todoListUl.append(createTodoItem(todoText, uniqueId));
  }
  else {
    alert('Please, enter not empty value');
  }
}

const createTodoItem = (todoText, todoIndex) => {
  const todoId = `todo-${todoIndex}`;
  const todoLi = document.createElement("li");
  todoLi.className = "todo";
  todoLi.innerHTML = `
    <input type="checkbox" id="${todoId}">
        <label class="custom-checkbox" for=${todoId}>
          
        </label>
        <label for="${todoId}" class="todo-text">
          ${todoText}
        </label>
        <button class="edit-button">Edit</button>
        <button class="delete-button">Delete</button>
  `

  return todoLi;
}