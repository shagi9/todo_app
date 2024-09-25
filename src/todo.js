var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var TodoStatusString;
(function (TodoStatusString) {
    TodoStatusString["Completed"] = "completed";
    TodoStatusString["Uncompleted"] = "uncompleted";
    TodoStatusString["All"] = "all";
})(TodoStatusString || (TodoStatusString = {}));
var todoForm = document.querySelector("form");
var todoSelect = document.querySelector("select");
var todoInput = document.getElementById("todo-input");
var todoListUl = document.getElementById("todo-list");
var defaultStatus = TodoStatusString.Uncompleted;
var uniqueId = 0;
var allTodos = [];
var init = function () {
    loadTodosFromLocalStorage();
    todoForm.addEventListener("submit", handleAddTodoSubmit);
    todoSelect.addEventListener("change", filterTodos);
    todoListUl.addEventListener("click", handleTodoListClick);
    todoListUl.addEventListener("input", handleTodoListInput);
};
var saveTodosToLocalStorage = function () {
    localStorage.setItem('todos', JSON.stringify(allTodos));
};
var loadTodosFromLocalStorage = function () {
    var storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        allTodos = JSON.parse(storedTodos);
        uniqueId = allTodos.length > 0 ? Math.max.apply(Math, allTodos.map(function (todo) { return todo.id; })) : 0;
        renderTodoList(allTodos);
    }
};
var handleAddTodoSubmit = function (e) {
    e.preventDefault();
    addTodo();
};
var filterTodos = function (e) {
    var filterValue = e.target.value;
    var filteredTodos = allTodos.filter(function (todo) { return filterValue === TodoStatusString.All || todo.status === filterValue; });
    renderTodoList(filteredTodos);
};
var handleTodoListClick = function (e) {
    var target = e.target;
    var todoIndex = parseInt(target.dataset.id || '0');
    if (target.matches(".delete-button"))
        deleteTodo(todoIndex);
    if (target.matches(".checkbox"))
        toggleCheckbox(todoIndex, target.checked);
    if (target.matches(".edit-button"))
        enableEditMode(todoIndex);
    if (target.matches(".edit-save-button"))
        saveEdit(todoIndex);
};
var handleTodoListInput = function (e) {
    var target = e.target;
    if (target.classList.contains("edit-input")) {
        var todoIndex_1 = parseInt(target.dataset.id || '0');
        allTodos = allTodos.map(function (todo) { return todo.id === todoIndex_1 ? __assign(__assign({}, todo), { text: target.value }) : todo; });
        saveTodosToLocalStorage(); // Save after input change
    }
};
var deleteTodo = function (todoIndex) {
    allTodos = allTodos.filter(function (todo) { return todo.id !== todoIndex; });
    renderTodoList(allTodos);
    saveTodosToLocalStorage(); // Save after deleting
};
var toggleCheckbox = function (todoIndex, isChecked) {
    var todo = allTodos.find(function (todo) { return todo.id === todoIndex; });
    if (todo) {
        todo.status = isChecked ? TodoStatusString.Completed : TodoStatusString.Uncompleted;
        renderTodoList(allTodos);
        saveTodosToLocalStorage(); // Save after toggling
    }
};
var enableEditMode = function (todoIndex) {
    var todo = allTodos.find(function (todo) { return todo.id === todoIndex; });
    if (todo) {
        todo.isEditing = true;
        renderTodoList(allTodos);
    }
};
var saveEdit = function (todoIndex) {
    var todo = allTodos.find(function (todo) { return todo.id === todoIndex; });
    if (todo) {
        todo.isEditing = false;
        renderTodoList(allTodos);
        saveTodosToLocalStorage(); // Save after editing
    }
};
var addTodo = function () {
    var todoText = todoInput.value.trim();
    if (!todoText)
        return alert('Please, enter a non-empty value');
    todoInput.value = '';
    uniqueId++;
    allTodos.push({ id: uniqueId, text: todoText, status: defaultStatus, isEditing: false });
    todoInput.value = '';
    renderTodoList(allTodos);
    saveTodosToLocalStorage(); // Save after adding
};
var createButton = function (text, className, dataId) {
    var button = document.createElement("button");
    button.textContent = text;
    button.className = className;
    button.dataset.id = dataId.toString();
    return button;
};
var createInput = function (type, className, value, dataId) {
    var input = document.createElement("input");
    input.type = type;
    input.className = className;
    input.value = value;
    input.dataset.id = dataId.toString();
    return input;
};
var createTodoItem = function (todo) {
    var todoLi = document.createElement("li");
    todoLi.id = "todo-".concat(todo.id);
    todoLi.className = "todo ".concat(todo.isEditing ? 'edit-mode' : '');
    var inputsContainer = document.createElement("div");
    inputsContainer.className = 'inputs-container';
    if (todo.isEditing) {
        var editInput = createInput("text", "edit-input", todo.text, todo.id);
        var saveButton = createButton("Save", "edit-save-button", todo.id);
        inputsContainer.append(editInput, saveButton);
        todoLi.append(inputsContainer, createButton("Delete", "delete-button", todo.id));
    }
    else {
        var checkbox = createInput("checkbox", "checkbox", "", todo.id);
        checkbox.checked = todo.status === TodoStatusString.Completed;
        var labelText = document.createElement("label");
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
var renderTodoList = function (todos) {
    todoListUl.innerHTML = '';
    todos.forEach(function (todo) {
        todoListUl.appendChild(createTodoItem(todo));
    });
};
init();
