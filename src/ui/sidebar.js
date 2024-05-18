import { element, renderList } from "./base";

export function createProjectElement(project, onClick) {
	const projectElement = document.createElement("li");
	projectElement.classList.add("nav-item");

	const icon = document.createElement("span");
	icon.textContent = "tag";
	icon.classList.add("material-symbols-outlined", "icon");

	const nameSpan = document.createElement("span");
	nameSpan.classList.add("text");
	nameSpan.textContent = project.name;

	const projectButton = document.createElement("button");
	projectButton.addEventListener("click", () => {
		onClick(project);
	});
	projectButton.dataset.id = project.id;
	projectButton.append(icon, nameSpan);

	projectElement.replaceChildren(projectButton);
	return projectElement;
}

export const renderProjects = renderList(
	element.projectList,
	createProjectElement,
);

export function toggleActiveNavItem(itemID) {
	const activeNavItemButton = document.querySelector(".nav-item button.active");
	activeNavItemButton?.classList.remove("active");

	const selectedNavItemButton = document.querySelector(
		`.nav-item button[data-id="${itemID}"]`,
	);
	selectedNavItemButton?.classList.add("active");
}

function blurOnEscapePress(event) {
	if (event.key === "Escape") event.target.blur();
}

element.projectInput.addEventListener("blur", (event) => {
	event.target.value = null;
	document.removeEventListener("keydown", blurOnEscapePress);
});

element.projectInput.addEventListener("focus", () => {
	document.addEventListener("keydown", blurOnEscapePress);
});

export function updateProjectName(projectID, newProjectName) {
	const projectNavItem = document.querySelector(
		`.nav-item [data-id="${projectID}"]`,
	);
	const projectTextSpan = projectNavItem.querySelector("span.text");
	projectTextSpan.textContent = newProjectName;
}
