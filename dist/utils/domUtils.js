import { TodoStatusEnum } from "../enums/TodoStatusEnum.js";
const createButton = (text, className, dataId) => {
    const button = document.createElement("button");
    button.textContent = text;
    button.className = className;
    button.dataset.id = dataId.toString();
    return button;
};
const createInput = (type, className, value, dataId) => {
    const input = document.createElement("input");
    input.type = type;
    input.className = className;
    if (typeof value === 'string') {
        input.value = value;
    }
    else {
        input.checked = value;
    }
    input.dataset.id = dataId.toString();
    return input;
};
export const createTodoItem = (todo) => {
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
    }
    else {
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
