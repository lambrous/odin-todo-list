import { createIcon, element, form, renderList } from "./base";
import { createTodoElement } from "./todo-element";

let currentTodoElement = null;

export const getCurrentTodoElement = () => currentTodoElement;

export function showTodoForm(elementToReplace = null, todo = null) {
	currentTodoElement?.classList.remove("hidden");
	form.todo.reset();

	if (!elementToReplace) {
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
}

export function hideTodoForm() {
	form.todo.removeEventListener("keydown", handleEscapePress);
	form.todo.hidden = true;
	currentTodoElement?.classList.remove("hidden");
}

function fillForm(todo) {
	const inputFields = {
		title: form.todo.querySelector("#todo-title"),
		description: form.todo.querySelector("#todo-description"),
		dueDate: form.todo.querySelector("#todo-due-date"),
		priority: form.todo.querySelector("#todo-priority"),
	};

	for (const key in inputFields) {
		if (todo[key] !== undefined && todo[key] !== null && todo[key] !== "") {
			inputFields[key].value = todo[key];
		}
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
		const elementData = getElementData(selectedElement);
		callback(todoFormData, elementData);
		hideTodoForm();
	};
}

function getElementData(element) {
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

export const renderTodos = renderList(element.todoList, createTodoElement);

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

const todoCancelButton = form.todo.querySelector(".cancel-btn");

todoCancelButton.addEventListener("click", () => {
	hideTodoForm();
});

element.addTodoButton.addEventListener("click", () => {
	showTodoForm(element.addTodoButton);
	form.todo.removeEventListener("submit", submitHandler.editTodo);
	form.todo.addEventListener("submit", submitHandler.addTodo);
});
