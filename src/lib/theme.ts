import { storageKeys } from "@/lib/storage-keys";

type Theme = "light" | "dark";

const themeInitScript = `(function(){try{var k=${JSON.stringify(
  storageKeys.theme.mode,
)};var r=localStorage.getItem(k);var t=r?JSON.parse(r):null;if(t!=='light'&&t!=='dark'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export type { Theme };
export { themeInitScript };
