import { elements, renderList } from "./base";

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
	projectButton.setAttribute("data-key", project.id);
	projectButton.append(icon, nameSpan);

	projectElement.replaceChildren(projectButton);
	return projectElement;
}

export const renderProjects = renderList(
	elements.projectList,
	createProjectElement,
);

export function toggleActiveNavItem(itemID) {
	const navButtons = elements.sidebar.querySelectorAll(".nav-item button");
	for (const button of navButtons) {
		const { key } = button.dataset;
		button.classList.toggle("active", key === itemID);
	}
}
