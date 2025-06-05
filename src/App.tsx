/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  getActiveTodos,
  getCompletedTodos,
  getTodos,
  USER_ID,
} from './api/todos';

import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('aaa');
  const [loading, setLoading] = useState(true);
  const [activeLink, setActiveLink] = useState('all');

  function updateTodos(link = activeLink) {
    switch (link) {
      case 'all':
        getTodos()
          .then(allTodos => setTodos(allTodos))
          .finally(() => setLoading(false));
        break;
      case 'active':
        getActiveTodos()
          .then(activeTodos => setTodos(activeTodos))
          .finally(() => setLoading(false));
        break;
      case 'completed':
        getCompletedTodos()
          .then(completedTodos => setTodos(completedTodos))
          .finally(() => setLoading(false));
        break;
    }
  }

  useEffect(() => {
    getTodos()
      .then(todosFromServer => setTodos(todosFromServer))
      .finally(() => setLoading(false));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form
            onSubmit={event => {
              event.preventDefault();

              if (!title) {
                setErrorMessage('Title should not be empty');

                return;
              }

              addTodo({
                userId: 3025,
                title: title,
                completed: false,
              }).then(() => {
                getTodos()
                  .then(todosFromServer => setTodos(todosFromServer))
                  .finally(() => {
                    setLoading(false);
                  });
                setTitle('');
              });
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              loading={loading}
              updateTodos={updateTodos}
            />
          ))}
        </section>

        {/* Hide the footer if there are no todos */}
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            3 items left
          </span>

          {/* Active link should have the 'selected' class */}
          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={classNames('filter__link', {
                selected: activeLink === 'all',
              })}
              data-cy="FilterLinkAll"
              onClick={() => {
                setActiveLink('all');
                updateTodos('all');
              }}
            >
              All
            </a>

            <a
              href="#/active"
              className={classNames('filter__link', {
                selected: activeLink === 'active',
              })}
              data-cy="FilterLinkActive"
              onClick={() => {
                setActiveLink('active');
                updateTodos('active');
              }}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames('filter__link', {
                selected: activeLink === 'completed',
              })}
              data-cy="FilterLinkCompleted"
              onClick={() => {
                setActiveLink('completed');
                updateTodos('completed');
              }}
            >
              Completed
            </a>
          </nav>

          {/* this button should be disabled if there are no completed todos */}
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
          >
            Clear completed
          </button>
        </footer>
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        Unable to load todos
        <br />
        {errorMessage}
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo
      </div>
    </div>
  );
};
