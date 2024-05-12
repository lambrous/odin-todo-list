import { elements, forms, renderList } from "./base";
import { createTodoElement } from "./todo-element";

let selectedTodoElement = null;
export const getSelectedTodoElementID = () => selectedTodoElement.dataset.id;

export function showTodoForm(elementToReplace = null) {
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

export const submitHandler = {
	addTodo: null,
	editTodo: null,
};

export function registerSubmitListener(action, callback) {
	submitHandler[action] = (event) => {
		event.preventDefault();

		const formData = new FormData(event.target);
		const todoFormData = Object.fromEntries(formData);
		callback(todoFormData);

		hideTodoForm();
		event.target.reset();
	};
}

function handleEscapePress(event) {
	if (event.key === "Escape") hideTodoForm();
}

export function editTodoItem(todo) {
	const todoItem = elements.todoList.querySelector(`li[data-id="${todo.id}"`);
	todoItem.textContent = todo.title;
}

export const renderTodos = renderList(elements.todoList, createTodoElement);

elements.addTodoButton.addEventListener("click", () => {
	showTodoForm(elements.addTodoButton);
	forms.todo.removeEventListener("submit", submitHandler.editTodo);
	forms.todo.addEventListener("submit", submitHandler.addTodo);
});
