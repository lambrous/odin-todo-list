import { showTodoForm, submitHandler } from "./todo-content";
import { elements, forms } from "./base";

export function createTodoElement(todo, handler) {
	const todoElement = document.createElement("li");
	todoElement.classList.add("todo-item");
	todoElement.dataset.id = todo.id;

	const todoTitle = document.createElement("h4");
	todoTitle.textContent = todo.title;

	const todoCompleteButton = createTodoCompleteButton(
		todo.isComplete,
		todo.id,
		handler.onTodoComplete,
	);

	todoElement.append(todoCompleteButton, todoTitle);
	todoElement.addEventListener("click", (event) => {
		if (event.target.closest("button")) return;
		showTodoForm(todoElement);
		forms.todo.removeEventListener("submit", submitHandler.addTodo);
		forms.todo.addEventListener("submit", submitHandler.editTodo);
	});

	return todoElement;
}

const createTodoCompleteButton = (isComplete, todoID, onClick = null) => {
	const todoCompleteButton = document.createElement("button");
	const todoCompleteIcon = document.createElement("span");
	todoCompleteIcon.classList.add("icon", "material-symbols-outlined");
	const toggleButton = (isComplete) => {
		todoCompleteIcon.textContent = isComplete
			? "check_box"
			: "check_box_outline_blank";
	};
	toggleButton(isComplete);
	todoCompleteButton.replaceChildren(todoCompleteIcon);

	todoCompleteButton.addEventListener("click", () => {
		onClick(todoID, toggleButton);
	});

	return todoCompleteButton;
};
