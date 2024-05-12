import { forms } from "./base";
import { showTodoForm, addTodoHandler, editTodoHandler } from "./todo-content";

export function createTodoElement(todo) {
	const todoElement = document.createElement("li");
	todoElement.dataset.id = todo.id;

	const isCompleteButton = document.createElement("button");
	const isCompleteIcon = document.createElement("span");
	isCompleteIcon.classList.add("icon", "material-symbols-outlined");
	isCompleteIcon.textContent = todo.isComplete
		? "check_box"
		: "check_box_outline_blank";
	isCompleteButton.replaceChildren(isCompleteIcon);

	const todoTitle = document.createElement("h4");
	todoTitle.textContent = todo.title;

	todoElement.append(isCompleteButton, todoTitle);
	todoElement.addEventListener("dblclick", () => {
		showTodoForm(todoElement);
		forms.todo.removeEventListener("submit", addTodoHandler);
		forms.todo.addEventListener("submit", editTodoHandler);
	});

	return todoElement;
}
