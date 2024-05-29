import { element } from "./base";
import { createDropdownMenu } from "./dropdown-menu";

const themeIcon = element.themeSelector.querySelector(".icon");
const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

const isDarkMode = () => {
	const theme = document.documentElement.dataset.theme;
	return theme ? theme === "dark" : darkModeMediaQuery.matches;
};

const setTheme = (theme) => {
	document.documentElement.dataset.theme = theme;
	themeIcon.textContent = theme === "dark" ? "dark_mode" : "light_mode";
};

const toggleTheme = () => {
	setTheme(isDarkMode() ? "light" : "dark");
};

const handleThemeChange = (event) => {
	setTheme(event.matches ? "dark" : "light");
	updateThemeMenu();
};

const matchSystemTheme = () => {
	setTheme(darkModeMediaQuery.matches ? "dark" : "light");
	updateThemeMenu();
};

let themeMenuToggler = null;

const updateThemeMenu = (menuItem = themeMenuToggler) => {
	if (!menuItem) return;

	const icon = menuItem.querySelector(".icon");
	const text = menuItem.querySelector(".text");
	const darkMode = isDarkMode();

	icon.textContent = darkMode ? "light_mode" : "dark_mode";
	text.textContent = darkMode ? "Light Mode" : "Dark Mode";
};

const createThemeDropdown = () => {
	return createDropdownMenu(
		[
			{
				text: isDarkMode() ? "Light Mode" : "Dark Mode",
				icon: isDarkMode() ? "light_mode" : "dark_mode",
				handler() {
					toggleTheme();
					updateThemeMenu();
					localStorage.setItem("color-theme", isDarkMode() ? "dark" : "light");
					darkModeMediaQuery.removeEventListener("change", handleThemeChange);
				},
			},
			{
				text: "System Theme",
				icon: "desktop_windows",
				handler() {
					localStorage.removeItem("color-theme");
					matchSystemTheme();
					darkModeMediaQuery.addEventListener("change", handleThemeChange);
				},
			},
		],
		element.themeSelector,
	);
};

const setupDropdownMenu = () => {
	const themeDropdownMenu = createThemeDropdown();
	themeMenuToggler = themeDropdownMenu.menu.firstElementChild;
	element.themeSelector.insertAdjacentElement(
		"afterend",
		themeDropdownMenu.menu,
	);
};

const initializeTheme = () => {
	const savedTheme = localStorage.getItem("color-theme");
	if (savedTheme) {
		setTheme(savedTheme);
	} else {
		matchSystemTheme();
		darkModeMediaQuery.addEventListener("change", handleThemeChange);
	}
};

window.addEventListener("load", () => {
	initializeTheme();
	setupDropdownMenu();
});
