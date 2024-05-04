import { elements, renderList } from "./base";

export function createTodoElement({ title }) {
	const todoElement = document.createElement("li");
	todoElement.textContent = title;
	return todoElement;
}

export const renderTodos = renderList(elements.todoList, createTodoElement);
