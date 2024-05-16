import { showTodoForm, submitHandler } from "./todo-content";
import { element, form } from "./base";
import { getRelativeDate } from "../helpers/date";

export function createTodoElement(todo, handler) {
	const todoElement = document.createElement("li");
	todoElement.classList.add("todo-item");
	todoElement.dataset.id = todo.id;

	const headerContainer = document.createElement("div");
	headerContainer.classList.add("todo-header");

	const todoTitle = document.createElement("h3");
	todoTitle.classList.add("title");
	todoTitle.textContent = todo.title;

	const todoCompleteButton = createTodoCompleteButton(
		todo.isComplete,
		todo.id,
		handler.onTodoComplete,
	);

	const priorityElement = createPriorityElement(todo.priority);
	headerContainer.append(todoCompleteButton, todoTitle, priorityElement);

	const descriptionText = createDescriptionElement(todo.description);
	const infoContainer = document.createElement("div");
	infoContainer.classList.add("info-container");
	infoContainer.append(headerContainer, descriptionText);

	const dueDateElement = createDateElement(todo.dueDate);
	todoElement.append(infoContainer, dueDateElement);

	todoElement.addEventListener("click", (event) => {
		if (event.target.closest("button")) return;
		showTodoForm(todoElement, todo);
		form.todo.removeEventListener("submit", submitHandler.addTodo);
		form.todo.addEventListener("submit", submitHandler.editTodo);
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

const createPriorityElement = (priority) => {
	const value = +priority;
	if (!value) return "";

	const priorityEl = document.createElement("span");
	priorityEl.classList.add("priority", `priority-${priority}`);

	const priorityIcon = document.createElement("span");
	priorityIcon.classList.add("icon", "material-symbols-outlined");
	priorityIcon.textContent = "flag";

	const priorityText = document.createElement("span");
	priorityText.classList.add("text");
	priorityText.textContent = getPriorityText(value);

	priorityEl.append(priorityIcon, priorityText);
	return priorityEl;
};

const getPriorityText = (value) => {
	switch (value) {
		case 1:
			return "Low";
		case 2:
			return "Normal";
		case 3:
			return "High";
		default:
			return "";
	}
};

const createDescriptionElement = (description) => {
	if (!description) return "";
	const descriptionText = document.createElement("p");
	descriptionText.classList.add("description");
	descriptionText.textContent = description;
	return descriptionText;
};

const createDateElement = (dueDate) => {
	if (!dueDate) return "";
	const dateContainer = document.createElement("div");
	dateContainer.classList.add("date-container");

	const dateSpan = document.createElement("span");
	dateSpan.classList.add("date");

	const { daysDiff, relativeDateDescription } = getRelativeDate(dueDate);

	const dateIcon = document.createElement("span");
	dateIcon.classList.add("icon", "material-symbols-outlined");
	dateIcon.textContent = `hourglass_${daysDiff < 0 ? "bottom" : "top"}`;

	const dateText = document.createElement("span");
	dateText.classList.add("text");
	dateText.textContent = relativeDateDescription;

	dateSpan.append(dateIcon, dateText);
	dateContainer.append(dateSpan);
	dateContainer.classList.toggle("due", daysDiff < 1);

	return dateContainer;
};
