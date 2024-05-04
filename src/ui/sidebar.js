import { elements, renderList } from "./base";

export function createProjectElement(project, onClick) {
	const projectElement = document.createElement("li");
	const projectButton = document.createElement("button");
	projectButton.textContent = project.name;
	projectButton.addEventListener("click", () => {
		onClick(project);
	});
	projectElement.replaceChildren(projectButton);
	return projectElement;
}

export const renderProjects = renderList(
	elements.projectList,
	createProjectElement,
);
