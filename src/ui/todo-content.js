import { createIcon, element, renderList } from "./base";
import { createTodoElement } from "./todo-element";
export * from "./todo-form";

export const renderTodos = renderList(element.todoList, createTodoElement);

export function addTodoElement(todo, handler) {
	const todoElement = createTodoElement(todo, handler);
	element.todoList.append(todoElement);
}

export function removeTodoElement(todoID) {
	const todoElement = element.todoList?.querySelector(`[data-id="${todoID}"]`);
	if (todoElement) element.todoList.removeChild(todoElement);
}

export const updateProjectName = (name, handler = null, icon = "tag") => {
	const headingIcon = createIcon(icon);

	if (!handler) {
		element.projectHeading.replaceChildren(headingIcon, name);
		return;
	}

	const projectNameInput = document.createElement("input");
	element.projectHeading.replaceChildren(headingIcon, projectNameInput);
	projectNameInput.value = name;
	projectNameInput.addEventListener("blur", handler);
	projectNameInput.addEventListener("keydown", (event) => {
		if (event.key === "Enter" || event.key === "Escape") {
			projectNameInput.blur();
		}
	});
};
