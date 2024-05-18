export const form = {
	todo: document.querySelector("#todo-form"),
	project: document.querySelector("#project-form"),
};

export const element = {
	sidebar: document.querySelector("#sidebar"),
	todoList: document.querySelector("#todos"),
	projectList: document.querySelector("#projects-list"),
	projectHeading: document.querySelector(".project-heading"),
	inboxItem: document.querySelector(".inbox-button"),
	projectInput: form.project.querySelector("input"),
	addTodoButton: document.querySelector("#add-todo-btn"),
};

export function renderList(container, createItem) {
	return (list, onItemClick = null) => {
		container.replaceChildren();
		for (const item of list) {
			const itemElement = createItem(item, onItemClick);
			container.append(itemElement);
		}
	};
}
