import { form, element } from "./base";
import { createTodoElement } from "./todo-element";

let formTargetElement = null;
export const getFormTargetElement = () => formTargetElement;

export function showTodoForm(targetElement = null, todo = null) {
	formTargetElement?.classList.remove("hidden");
	form.todo.reset();

	if (!targetElement) {
		element.todoList.append(form.todo);
	} else {
		formTargetElement = targetElement;
		targetElement.classList.add("hidden");
		targetElement.insertAdjacentElement("afterend", form.todo);
	}

	form.todo.hidden = false;
	if (targetElement !== element.addTodoButton) {
		fillForm(todo);
	}

	form.todo.querySelector("input").focus();
	form.todo.addEventListener("keydown", handleEscapePress);
	element.addTodoButton.disabled = formTargetElement === element.addTodoButton;
}

export function hideTodoForm() {
	form.todo.removeEventListener("keydown", handleEscapePress);
	form.todo.hidden = true;
	formTargetElement?.classList.remove("hidden");
	element.addTodoButton.disabled = false;
	formTargetElement = null;
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
		const selectedElement = getFormTargetElement();
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
	formTargetElement.replaceChildren(...updatedTodoElement.children);
}

function handleEscapePress(event) {
	if (event.key === "Escape") hideTodoForm();
}

const todoCancelButton = form.todo.querySelector(".cancel-btn");

todoCancelButton.addEventListener("click", () => {
	hideTodoForm();
});

element.addTodoButton.addEventListener("click", () => {
	showTodoForm(element.addTodoButton);
	form.todo.removeEventListener("submit", submitHandler.editTodo);
	form.todo.addEventListener("submit", submitHandler.addTodo);
});
