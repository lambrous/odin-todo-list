import { element, renderList } from "./base";
import { createCheckbox } from "./todo-element";
import { getRelativeDate } from "../utils/date";

const { completedContainer, completedList } = element;
const completedFoldButton = completedContainer.querySelector(".fold-btn");

export function createCompletedItem(todo, onUncheck) {
	const completedItem = document.createElement("li");
	completedItem.classList.add("completed-item");
	completedItem.dataset.id = todo.id;

	const checkbox = createCheckbox(todo.isComplete, todo.id, onUncheck);
	checkbox.classList.add("completed-btn");

	const { relativeDateDescription } = getRelativeDate(todo.completedDate, true);
	const completedDateSpan = document.createElement("span");
	completedDateSpan.classList.add("completed-date");
	completedDateSpan.textContent = relativeDateDescription;

	const todoTitle = document.createElement("p");
	todoTitle.classList.add("title");
	todoTitle.textContent = todo.title;

	completedItem.append(checkbox, completedDateSpan, todoTitle);
	return completedItem;
}

export function addItem(todo, onUncheck) {
	const completedItem = createCompletedItem(todo, onUncheck);
	completedList.append(completedItem);
	toggleContainerVisibility();
}

export function removeItem(todoID) {
	const itemToRemove = completedList.querySelector(
		`.completed-item[data-id="${todoID}"]`,
	);
	itemToRemove?.remove();
	toggleContainerVisibility();
}

export function toggleContainerVisibility() {
	completedContainer.classList.toggle(
		"hidden",
		completedList.children.length === 0,
	);
}

export const renderItems = (completedTodos, onUncheck) => {
	if (completedTodos.length === 0) {
		completedList.replaceChildren();
		completedContainer.classList.add("hidden");
		return;
	}
	completedContainer.classList.remove("hidden");
	const render = renderList(completedList, createCompletedItem);
	render(completedTodos, onUncheck);
};

completedFoldButton.addEventListener("click", () => {
	completedList.classList.toggle("hidden");
	const foldIcon = completedFoldButton.querySelector("span.icon");
	foldIcon.textContent = completedList.classList.contains("hidden")
		? "unfold_more"
		: "unfold_less";
});
