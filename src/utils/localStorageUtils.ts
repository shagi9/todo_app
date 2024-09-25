import { TodoModel } from '../interfaces/TodoModel';

const saveTodosToLocalStorage = (allTodos: TodoModel[]): void => {
  localStorage.setItem('todos', JSON.stringify(allTodos));
};

const loadTodosFromLocalStorage = (): TodoModel[] => {
  const storedTodos = localStorage.getItem('todos');
  return storedTodos ? (JSON.parse(storedTodos) as TodoModel[]) : [];
};

export { saveTodosToLocalStorage, loadTodosFromLocalStorage };