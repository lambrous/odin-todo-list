import { element, form, renderList } from "./base";
import { createTodoElement } from "./todo-element";

let currentTodoElement = null;
export const getCurrentTodoElement = () => currentTodoElement;

export function showTodoForm(elementToReplace = null, todo = null) {
	currentTodoElement?.classList.remove("hidden");
	form.todo.reset();

	if (elementToReplace === null) {
		element.todoList.append(form.todo);
	} else {
		currentTodoElement = elementToReplace;
		elementToReplace.classList.add("hidden");
		elementToReplace.insertAdjacentElement("afterend", form.todo);
	}

	form.todo.hidden = false;
	if (elementToReplace !== element.addTodoButton) {
		fillForm(todo);
	}

	form.todo.querySelector("input").focus();
	form.todo.addEventListener("keydown", handleEscapePress);
	document.addEventListener("click", handleClickOutsideForm);
}

export function hideTodoForm() {
	form.todo.removeEventListener("keydown", handleEscapePress);
	document.removeEventListener("click", handleClickOutsideForm);
	form.todo.hidden = true;
	currentTodoElement?.classList.remove("hidden");
}

function fillForm(todo) {
	const input = {
		title: form.todo.querySelector("#todo-title"),
		description: form.todo.querySelector("#todo-description"),
		dueDate: form.todo.querySelector("#todo-due-date"),
		priority: form.todo.querySelector("#todo-priority"),
	};

	for (const key in input) {
		if (
			todo[key] !== null ||
			todo[key] !== undefined ||
			todo[key] !== "" ||
			key in todo
		)
			input[key].value = todo[key];
	}
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
		const selectedElement = getCurrentTodoElement();
		const element = elementUpdater(selectedElement);
		callback(todoFormData, element);

		hideTodoForm();
	};
}

function elementUpdater(element) {
	if (!element || element === element.addTodoButton) return null;
	return {
		id: element.dataset.id,
		updateContent: updateTodoElement,
	};
}

function updateTodoElement(todo, handler) {
	const updatedTodoElement = createTodoElement(todo, handler);
	currentTodoElement.replaceChildren(...updatedTodoElement.children);
}

export function addTodoElement(todo, handler) {
	const todoElement = createTodoElement(todo, handler);
	element.todoList.append(todoElement);
}

export function removeTodoElement(todoID) {
	const todoElement = element.todoList?.querySelector(`[data-id="${todoID}"]`);
	if (todoElement) element.todoList.removeChild(todoElement);
}

function handleEscapePress(event) {
	if (event.key === "Escape") hideTodoForm();
}

const handleClickOutsideForm = (event) => {
	const rect = form.todo.getBoundingClientRect();
	if (
		event.clientY < rect.top ||
		event.clientY > rect.bottom ||
		event.clientX < rect.left ||
		event.clientX > rect.right
	) {
		hideTodoForm();
	}
};

export const renderTodos = renderList(element.todoList, createTodoElement);

element.addTodoButton.addEventListener("click", () => {
	showTodoForm(element.addTodoButton);
	form.todo.removeEventListener("submit", submitHandler.editTodo);
	form.todo.addEventListener("submit", submitHandler.addTodo);
});
