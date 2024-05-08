import { elements, forms, renderList } from "./base";

export const renderTodos = renderList(elements.todoList, createTodoElement);

export function createTodoElement({ title }) {
	const todoElement = document.createElement("li");
	todoElement.textContent = title;
	return todoElement;
}

let selectedTodoElement = null;

function showTodoForm() {
	selectedTodoElement = this;
	selectedTodoElement?.classList.add("hidden");
	this.insertAdjacentElement("afterend", forms.todo);
	forms.todo.querySelector("input").focus();
	forms.todo.addEventListener("keydown", hideTodoFormOnEscapePress);
}

export function hideTodoForm() {
	forms.todo.removeEventListener("keydown", hideTodoFormOnEscapePress);
	document.querySelector("#todo-form")?.remove();
	selectedTodoElement?.classList.remove("hidden");
}

elements.addTodoButton.addEventListener("click", showTodoForm);

function hideTodoFormOnEscapePress(event) {
	if (event.key === "Escape") hideTodoForm();
}
