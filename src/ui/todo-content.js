import { elements, forms, renderList } from "./base";

let selectedTodoElement = null;
export const getSelectedTodoElementID = () => selectedTodoElement.dataset.id;

function showTodoForm(elementToReplace = null) {
	if (elementToReplace === null) {
		elements.todoList.append(forms.todo);
	} else {
		selectedTodoElement = elementToReplace;
		elementToReplace.classList.add("hidden");
		elementToReplace.insertAdjacentElement("afterend", forms.todo);
	}

	forms.todo.classList.remove("hidden");
	forms.todo.querySelector("input").focus();
	forms.todo.addEventListener("keydown", handleEscapePress);
	forms.todo.addEventListener("focusout", hideTodoForm);
}

export function hideTodoForm() {
	forms.todo.removeEventListener("keydown", handleEscapePress);
	forms.todo.removeEventListener("focusout", hideTodoForm);
	forms.todo.classList.add("hidden");
	selectedTodoElement?.classList.remove("hidden");
}

let addTodoHandler = null;
let editTodoHandler = null;

export function addListenerForTodoAdd(handler) {
	addTodoHandler = (event) => handler(event);
}

export function addListenerForTodoEdit(handler) {
	editTodoHandler = (event) => handler(event);
}

function handleEscapePress(event) {
	if (event.key === "Escape") hideTodoForm();
}

export function createTodoElement(todo) {
	const todoElement = document.createElement("li");
	todoElement.textContent = todo.title;
	todoElement.dataset.id = todo.id;
	todoElement.addEventListener("dblclick", () => {
		showTodoForm(todoElement);
		forms.todo.removeEventListener("submit", addTodoHandler);
		forms.todo.addEventListener("submit", editTodoHandler);
	});
	return todoElement;
}

export function editTodoItem(todo) {
	const todoItem = elements.todoList.querySelector(`li[data-id="${todo.id}"`);
	todoItem.textContent = todo.title;
}

export const renderTodos = renderList(elements.todoList, createTodoElement);

elements.addTodoButton.addEventListener("click", () => {
	showTodoForm(elements.addTodoButton);
	forms.todo.removeEventListener("submit", editTodoHandler);
	forms.todo.addEventListener("submit", addTodoHandler);
});
