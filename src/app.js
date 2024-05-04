import "./style.css";
import TodoItem from "./todo-manager/todo-item";
import todoManager from "./todo-manager/todo-list";
import { forms } from "./ui/elements";
import * as todoUI from "./ui/todo";

const inbox = todoManager.createProject("Inbox");
const state = {
	currentProject: inbox,
};

forms.todo.addEventListener("submit", (e) => {
	e.preventDefault();

	const todoFormData = new FormData(e.target);
	const todoData = Object.fromEntries(todoFormData);

	const newTodo = new TodoItem(todoData);
	state.currentProject.addTodo(newTodo);

	todoUI.renderTodos(state.currentProject.todos);
	e.target.reset();
});
