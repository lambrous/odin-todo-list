export const forms = {
	todo: document.querySelector("#todo-form"),
	project: document.querySelector("#project-form"),
};

export const elements = {
	todoList: document.querySelector("#todos"),
	projectList: document.querySelector("#projects"),
	projectHeading: document.querySelector("h1.project-name"),
	inboxItem: document.querySelector(".inbox-button"),
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
