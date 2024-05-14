import { element, form, renderList } from "./base";
import { createTodoElement } from "./todo-element";

let selectedTodoElement = null;
export const getSelectedTodoElement = () => selectedTodoElement;
export const getSelectedTodoElementID = () => selectedTodoElement.dataset.id;

export function showTodoForm(elementToReplace = null) {
	if (elementToReplace === null) {
		element.todoList.append(form.todo);
	} else {
		selectedTodoElement = elementToReplace;
		elementToReplace.classList.add("hidden");
		elementToReplace.insertAdjacentElement("afterend", form.todo);
	}

	form.todo.hidden = false;
	form.todo.querySelector("input").focus();
	form.todo.addEventListener("keydown", handleEscapePress);
	document.addEventListener("click", handleClickOutsideForm);
}

export function hideTodoForm() {
	form.todo.removeEventListener("keydown", handleEscapePress);
	document.removeEventListener("click", handleClickOutsideForm);
	form.todo.hidden = true;
	selectedTodoElement?.classList.remove("hidden");
}

export const submitHandler = {
	addTodo: null,
	editTodo: null,
};

function elementUpdater(element) {
	if (!element || element === element.addTodoButton) return null;
	return {
		id: element.dataset.id,
		updateTitle: (title) => {
			element.querySelector("h4").textContent = title;
		},
	};
}

export function registerSubmitListener(action, callback) {
	submitHandler[action] = (event) => {
		event.preventDefault();

		const formData = new FormData(event.target);
		const todoFormData = Object.fromEntries(formData);
		const selectedElement = getSelectedTodoElement();
		const element = elementUpdater(selectedElement);
		callback(todoFormData, element);

		hideTodoForm();
		event.target.reset();
	};
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
