import { elements } from "./elements";

export function createTodoElement({ title }) {
	const todoElement = document.createElement("li");
	todoElement.textContent = title;
	return todoElement;
}

export function clearTodoList() {
	elements.todoList.replaceChildren();
}

export function renderTodos(todos) {
	clearTodoList();
	for (const todo of todos) {
		const todoElement = createTodoElement(todo);
		elements.todoList.append(todoElement);
	}
}
