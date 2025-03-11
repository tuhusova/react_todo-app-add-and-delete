import React, { useEffect, useState, FormEvent } from 'react';
import * as postService from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/Error';
import { FilterType } from '../../types/FilterType';
import { Footer } from '../../components/Footer/Footer';
import { TodoItem } from '../../components/TodoItem/TodoItem';
import cs from 'classnames';
import { USER_ID } from '../../api/todos';

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorType | null>(null);
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    postService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError(ErrorType.LoadTodos);
        setTimeout(() => setError(null), 3000);
      });
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();
    if (!trimmedTitle) {
      setError(ErrorType.NoTitle);
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsAdding(true);
    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });

    postService.createTodo({ title: trimmedTitle, completed: false, userId: USER_ID })
      .then((newTodo) => {
        setTodos((currentTodos) => [...currentTodos, newTodo]);
        setTempTodo(null);
        setNewTodoTitle('');
      })
      .catch(() => {
        setError(ErrorType.AddTodo);
      })
      .finally(() => {
        setIsAdding(false);
      });
  }

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(completedTodos.map(todo => postService.deleteTodo(todo.id)))
      .then(() => {
        setTodos(todos.filter(todo => !todo.completed));
      })
      .catch(() => {
        setError(ErrorType.DeleteTodo);
        setTimeout(() => setError(null), 3000);
      });
  };

  function deleteTodo(todoId: number) {
    postService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError(ErrorType.DeleteTodo);
        setTimeout(() => setError(null), 3000);
      });
  }

  const handleToggle = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  }

  const filteredTodos = todos.filter(todo => {
    if (filterBy === FilterType.Active) {
      return !todo.completed;
    } else if (filterBy === FilterType.Completed) {
      return todo.completed;
    }
    return true;
  });

  return (
    <div className="todoapp">
      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              className={cs('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              autoFocus
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={deleteTodo}
              onToggle={handleToggle}/>
          ))}

          {tempTodo && <TodoItem key={tempTodo.id} todo={tempTodo} {...tempTodo} onDelete={deleteTodo} onToggle={handleToggle}/>}
        </section>

        {todos.length > 0 && (
          <Footer
            setFilterBy={setFilterBy}
            filterBy={filterBy}
            todos={todos}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      {error && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setError(null)}
          />
          <div>{error}</div>
        </div>
      )}
    </div>
  );
};
