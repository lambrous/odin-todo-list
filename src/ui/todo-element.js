import { showTodoForm, submitHandler } from "./todo-content";
import { form, createIcon } from "./base";
import { getRelativeDate } from "../utils/date";

export function createTodoElement(
	todo,
	handler,
	{ showProject = false, showPriority = true, showDueDate = true } = {},
) {
	const todoElement = document.createElement("li");
	todoElement.classList.add("todo-item");
	todoElement.dataset.id = todo.id;

	const headerContainer = document.createElement("div");
	headerContainer.classList.add("todo-header");

	const todoTitle = document.createElement("h3");
	todoTitle.classList.add("title");
	todoTitle.textContent = todo.title;

	const todoCompleteButton = createCheckbox(
		todo.isComplete,
		todo.id,
		handler.onTodoComplete,
	);

	headerContainer.append(todoCompleteButton, todoTitle);
	if (showPriority) {
		const priorityElement = createPriorityElement(todo.priority);
		headerContainer.append(priorityElement);
	}

	const descriptionText = createDescriptionElement(todo.description);
	const infoContainer = document.createElement("div");
	infoContainer.classList.add("info-container");
	infoContainer.append(headerContainer, descriptionText);

	const rightContainer = document.createElement("div");
	rightContainer.classList.add("right-container");

	if (showProject) {
		const projectElement = createProjectElement(todo.project);
		rightContainer.append(projectElement);
	}
	if (showDueDate) {
		const dueDateElement = createDateElement(todo.dueDate);
		rightContainer.append(dueDateElement);
	}

	const deleteButton = createDeleteButton(todo.id, handler.onTodoDelete);
	todoElement.append(infoContainer, rightContainer, deleteButton);

	todoElement.addEventListener("click", (event) => {
		if (event.target.closest("button")) return;
		showTodoForm(todoElement, todo);
		form.todo.removeEventListener("submit", submitHandler.addTodo);
		form.todo.addEventListener("submit", submitHandler.editTodo);
	});

	return todoElement;
}

export const createCheckbox = (isComplete, todoID, onClick = null) => {
	const todoCompleteButton = document.createElement("button");
	const todoCompleteIcon = createIcon();
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

	const priorityIcon = createIcon("flag");

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

	const { daysDiff, relativeDateDescription } = getRelativeDate(dueDate);

	const dateElement = document.createElement("div");
	dateElement.classList.add("date");
	dateElement.classList.toggle("due", daysDiff < 1);

	const dateIcon = createIcon(`hourglass_${daysDiff < 0 ? "bottom" : "top"}`);

	const dateText = document.createElement("span");
	dateText.classList.add("text");
	dateText.textContent = relativeDateDescription;

	dateElement.append(dateIcon, dateText);

	return dateElement;
};

function createDeleteButton(todoID, onDelete) {
	const deleteButton = document.createElement("button");
	deleteButton.id = "delete-todo-btn";

	const deleteIcon = createIcon("delete");
	deleteButton.append(deleteIcon);

	deleteButton.addEventListener("click", () => {
		onDelete(todoID);
	});

	return deleteButton;
}

function createProjectElement(project) {
	const projectElement = document.createElement("div");
	projectElement.classList.add("project");

	const projectIcon = createIcon(project?.name ? "tag" : "inbox");
	const projectText = document.createElement("span");
	projectText.classList.add("text");
	projectText.textContent = project?.name ?? "Inbox";

	projectElement.append(projectIcon, projectText);

	return projectElement;
}
