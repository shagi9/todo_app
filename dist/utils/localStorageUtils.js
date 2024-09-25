const saveTodosToLocalStorage = (allTodos) => {
    localStorage.setItem('todos', JSON.stringify(allTodos));
};
const loadTodosFromLocalStorage = () => {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : [];
};
export { saveTodosToLocalStorage, loadTodosFromLocalStorage };
