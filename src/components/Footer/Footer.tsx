// import { FilterType } from '../../types/FilterType';
// import { Todo } from '../../types/Todo';
// import cs from 'classnames';

// interface Props {
//   todos: Todo[];
//   filterBy: FilterType;
//   setFilterBy: (filter: FilterType) => void;
//   clearCompleted: () => void;
// }

// export const Footer: React.FC<Props> = ({
//   todos,
//   filterBy,
//   setFilterBy,
//   clearCompleted,
// }) => {
//   const activeTodos = todos.filter(todo => !todo.completed);
//   const completedTodos = todos.filter(todo => todo.completed);

//   const handleFilterClick =
//     (filter: FilterType) => (event: React.MouseEvent<HTMLAnchorElement>) => {
//       event.preventDefault();
//       setFilterBy(filter);
//     };

//   const filters = [
//     { type: FilterType.All, label: 'All', cy: 'FilterLinkAll' },
//     { type: FilterType.Active, label: 'Active', cy: 'FilterLinkActive' },
//     { type: FilterType.Completed, label: 'Completed', cy: 'FilterLinkCompleted' },
//   ];



//   return (
//     <footer className="todoapp__footer" data-cy="Footer">
//       <span className="todo-count" data-cy="TodosCounter">
//         {`${activeTodos.length} items left`}
//       </span>

//       {/* Active link should have the 'selected' class */}
//       <nav className="filter" data-cy="Filter">
//         {filters.map(({ type, label, cy }) => (
//           <a
//             key={type}
//             href={`"#/${label}"`}
//             className={cs('filter__link', { selected: filterBy === type })}
//             data-cy={cy}
//             onClick={handleFilterClick(type)}
//         >
//           {label}
//         </a>
//         ))}

//       </nav>

//       {/* this button should be disabled if there are no completed todos */}
//       <button
//         type="button"
//         className="todoapp__clear-completed"
//         data-cy="ClearCompletedButton"
//         disabled={completedTodos.length === 0}
//         onClick={clearCompleted}
//       >
//         Clear completed
//       </button>
//     </footer>
//   );
// };
