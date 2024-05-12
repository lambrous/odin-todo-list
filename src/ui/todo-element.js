import { showTodoForm, submitHandler } from "./todo-content";
import { forms } from "./base";

export function createTodoElement(todo) {
	const todoElement = document.createElement("li");
	todoElement.dataset.id = todo.id;

	const todoTitle = document.createElement("h4");
	todoTitle.textContent = todo.title;

	todoElement.append(todoTitle);
	todoElement.addEventListener("dblclick", () => {
		showTodoForm(todoElement);
		forms.todo.removeEventListener("submit", submitHandler.addTodo);
		forms.todo.addEventListener("submit", submitHandler.editTodo);
	});

	return todoElement;
}
