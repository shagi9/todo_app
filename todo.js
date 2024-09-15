const todoForm = document.querySelector("form");
const todoInput = document.getElementById("todo-input");
const todoListUl = document.getElementById("todo-list");

let uniqueId = 0;
let allTodos = [];

todoForm.addEventListener("submit", function(e) {
  e.preventDefault();
  addTodo();
})

const deleteTodo = (todoIndex) => {
  const todoCurrentLi = document.getElementById(`todo-${todoIndex}`);
  allTodos = allTodos.filter(x => x.id !== todoIndex);
  todoCurrentLi.parentNode.removeChild(todoCurrentLi);
}

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

  todoLi.id = `todo-${todoIndex}`
  todoLi.className = `todo`;
  todoLi.innerHTML = `
    <input type="checkbox" id="${todoId}">
        <label class="custom-checkbox" for=${todoId}>

        </label>
        <label for="${todoId}" class="todo-text">
          ${todoText}
        </label>
        <button className="edit-button">Edit</button>
        <button className="delete-button" onclick="deleteTodo(${todoIndex})">Delete</button>
  `

  return todoLi;
}