import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2392;

export function getTodos(USER_ID: number) {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};
export function createTodo({ title, completed, userId = USER_ID }: Omit<Todo, 'id'>) {
  return client.post<Todo>(`/todos`, { title, completed, userId });
};
// export const patchTodos = (todoId: number, updates: Partial<Todo>) => {
//   return client.patch<Todo[]>(`/todos/${todoId}`, updates);
// };
export function deleteTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
