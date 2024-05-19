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
	projectInput: form.project.querySelector("input"),
	addTodoButton: document.querySelector("#add-todo-btn"),
};

export function renderList(container, createItem) {
	return (list, handler = null) => {
		container.replaceChildren();
		for (const item of list) {
			const itemElement = createItem(item, handler);
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
