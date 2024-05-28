import { element, renderList, createIcon } from "./base";
import { createDropdownMenu } from "./dropdown-menu";

export function createProjectNavItem(project, handler) {
	const navItem = document.createElement("li");
	navItem.classList.add("nav-item");
	navItem.dataset.id = project.id;

	const icon = createIcon("tag");

	const nameSpan = document.createElement("span");
	nameSpan.classList.add("text");
	nameSpan.textContent = project.name;

	const navButton = document.createElement("button");
	navButton.classList.add("project-btn");
	navButton.addEventListener("click", () => {
		handler.onClick(project);
	});
	navButton.append(icon, nameSpan);

	const dropdownMenu = createDropdownMenu([
		{
			text: "Rename",
			icon: "edit",
			handler() {
				handler.onClick(project);
				element.projectHeading.querySelector("input").focus();
			},
		},
		{
			text: "Delete",
			icon: "delete",
			handler() {
				handler.onDelete(project.id);
			},
		},
	]);

	navItem.append(navButton, dropdownMenu.button, dropdownMenu.menu);
	return navItem;
}

export const renderProjects = renderList(
	element.projectList,
	createProjectNavItem,
);

export function toggleActiveNavItem(itemID) {
	const activeNavItem = document.querySelector(".nav-item.active");
	activeNavItem?.classList.remove("active");

	const selectedNavItem = document.querySelector(
		`.nav-item[data-id="${itemID}"]`,
	);
	selectedNavItem?.classList.add("active");
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
	const projectNavItem = element.projectList.querySelector(
		`.nav-item[data-id="${projectID}"]`,
	);
	const projectTextSpan = projectNavItem.querySelector(
		".project-btn span.text",
	);
	projectTextSpan.textContent = newProjectName;
}

export function removeProjectItem(projectID) {
	const navItemToRemove = element.projectList.querySelector(
		`[data-id="${projectID}"]`,
	);
	navItemToRemove?.remove();
}
