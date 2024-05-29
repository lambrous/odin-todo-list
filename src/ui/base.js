export const form = {
	todo: document.querySelector("#todo-form"),
	project: document.querySelector("#project-form"),
};

export const element = {
	sidebar: document.querySelector("#sidebar"),
	todoList: document.querySelector("#todos"),
	projectList: document.querySelector("#projects-list"),
	projectHeading: document.querySelector(".project-heading"),
	inboxItem: document.querySelector("#inbox-nav-item"),
	inboxButton: document.querySelector("#inbox-nav-item .project-btn"),
	todayNavButton: document.querySelector("#today-nav-item .project-btn"),
	priorityNavButton: document.querySelector("#priority-nav-item .project-btn"),
	projectInput: form.project.querySelector("input"),
	addTodoButton: document.querySelector("#add-todo-btn"),
	confirmDialog: document.querySelector("dialog#confirm-dialog"),
	completedContainer: document.querySelector("section.completed-section"),
	completedList: document.querySelector("#completed-todos"),
	themeSelector: document.querySelector("#theme-selector"),
};

export function renderList(container, createItem) {
	return (list, handler, options) => {
		container.replaceChildren();
		for (const item of list) {
			const itemElement = createItem(item, handler, options);
			container.append(itemElement);
		}
	};
}

export function createIcon(symbol = "") {
	const icon = document.createElement("span");
	icon.classList.add("icon", "material-symbols-outlined");
	icon.textContent = symbol;
	return icon;
}
