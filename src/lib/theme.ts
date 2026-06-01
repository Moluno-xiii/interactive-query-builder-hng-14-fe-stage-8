type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "qf_theme";

const themeInitScript = `(function(){try{var k=${JSON.stringify(
  THEME_STORAGE_KEY,
)};var r=localStorage.getItem(k);var t=r?JSON.parse(r):null;if(t!=='light'&&t!=='dark'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export type { Theme };
export { THEME_STORAGE_KEY, themeInitScript };
