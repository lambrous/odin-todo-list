import { elements, renderList } from "./base";

export function createProjectElement(project, onClick) {
	const projectElement = document.createElement("li");
	projectElement.classList.add("nav-item");

	const icon = document.createElement("span");
	icon.textContent = "#";
	icon.classList.add("icon");

	const projectButton = document.createElement("button");
	projectButton.addEventListener("click", () => {
		onClick(project);
	});
	projectButton.append(icon, project.name);

	projectElement.replaceChildren(projectButton);
	return projectElement;
}

export const renderProjects = renderList(
	elements.projectList,
	createProjectElement,
);
