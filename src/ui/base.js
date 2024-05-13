export const forms = {
	todo: document.querySelector("#todo-form"),
	project: document.querySelector("#project-form"),
};

export const elements = {
	sidebar: document.querySelector("#sidebar"),
	todoList: document.querySelector("#todos"),
	projectList: document.querySelector("#projects-list"),
	projectHeading: document.querySelector("h1.project-name"),
	inboxItem: document.querySelector(".inbox-button"),
	projectInput: forms.project.querySelector("input"),
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

function blurOnEscapePress(event) {
	if (event.key === "Escape") event.target.blur();
}

elements.projectInput.addEventListener("blur", (event) => {
	event.target.value = null;
	document.removeEventListener("keydown", blurOnEscapePress);
});

elements.projectInput.addEventListener("focus", () => {
	document.addEventListener("keydown", blurOnEscapePress);
});
