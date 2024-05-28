import { createIcon } from "./base";

export const createDropdownMenuButton = () => {
	const menuButton = document.createElement("button");
	const menuButtonIcon = createIcon("more_vert");
	menuButton.classList.add("menu-btn");
	menuButton.append(menuButtonIcon);
	return menuButton;
};

export const createDropdownMenu = (options, targetButton) => {
	let menuButton = null;
	if (!targetButton) menuButton = createDropdownMenuButton();
	else menuButton = targetButton;

	const menuList = document.createElement("ul");
	menuList.classList.add("dropdown-menu", "hidden");

	for (const option of options) {
		const menuItem = document.createElement("li");

		const icon = createIcon(option.icon);
		const textSpan = document.createElement("span");
		textSpan.classList.add("text");
		textSpan.textContent = option.text;

		menuItem.append(icon, textSpan);
		menuItem.addEventListener("click", () => {
			option.handler(menuItem);
			toggleMenu();
		});
		menuList.append(menuItem);
	}

	function hideMenuOnOutsideClick(event) {
		if (
			!menuButton.contains(event.target) &&
			!menuList.contains(event.target)
		) {
			toggleMenu();
		}
	}

	function toggleMenu() {
		menuList.classList.toggle("hidden");
		menuButton.classList.toggle("active");

		if (menuList.classList.contains("hidden")) {
			document.removeEventListener("click", hideMenuOnOutsideClick);
		} else {
			document.addEventListener("click", hideMenuOnOutsideClick);
		}
	}

	menuButton.addEventListener("click", toggleMenu);

	return { button: menuButton, menu: menuList };
};
