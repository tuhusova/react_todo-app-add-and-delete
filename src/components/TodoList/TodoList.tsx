
import React, { useEffect, useState, FormEvent, useMemo } from 'react';
import { TodoItem } from '../../components/TodoItem/TodoItem';
import * as postService from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/Error';
import { FilterType } from '../../types/FilterType';
import cs from 'classnames';
import { USER_ID } from '../../api/todos';


export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorType | null>(null);
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);

  useEffect(() => {
    postService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError(ErrorType.LoadTodos);
        setTimeout(() => setError(null), 3000);
      });
  }, []);

  const handleSubmit = (event: FormEvent) => {
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
  };

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

  const deleteTodo = (todoId: number) => {
    setLoadingTodoId(todoId);

    postService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError(ErrorType.DeleteTodo);
        setTimeout(() => setError(null), 3000);
      })
      .finally(() => setLoadingTodoId(null));
  };

  const handleToggle = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filterBy === FilterType.Active) {
        return !todo.completed;
      } else if (filterBy === FilterType.Completed) {
        return todo.completed;
      }
      return true;
    });
  }, [todos, filterBy]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const handleFilterClick = (filter: FilterType) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setFilterBy(filter);
  };

  const filters = [
    { type: FilterType.All, label: 'All', cy: 'FilterLinkAll' },
    { type: FilterType.Active, label: 'Active', cy: 'FilterLinkActive' },
    { type: FilterType.Completed, label: 'Completed', cy: 'FilterLinkCompleted' },
  ];

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
              onToggle={handleToggle}
              isLoading={todo.id === loadingTodoId} />
          ))}

          {tempTodo && <TodoItem key={tempTodo.id} todo={tempTodo} {...tempTodo} onDelete={deleteTodo} onToggle={handleToggle} isLoading={true}/>}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos.length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              {filters.map(({ type, label, cy }) => (
                <a
                  key={type}
                  href={`"#/${label}"`}
                  className={cs('filter__link', { selected: filterBy === type })}
                  data-cy={cy}
                  onClick={handleFilterClick(type)}
                >
                  {label}
                </a>
              ))}
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedTodos.length === 0}
              onClick={clearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {error && (
        <div
          data-cy="ErrorNotification"
          className={cs(
            'notification is-danger is-light has-text-weight-normal',
            {
              hidden: !error,
            },
          )}
        >
          <button data-cy="HideErrorButton" type="button" className="delete" />
          <div>
            {error}
            <br />
          </div>
        </div>
      )}
    </div>
  );
};
