import { DRAWER_STATE_KEY } from "data/constants";

export class DrawerStateUtils {
	static set(isOpen) {
		sessionStorage.setItem(DRAWER_STATE_KEY, JSON.stringify(isOpen));
	}

	static get() {
		const item = sessionStorage.getItem(DRAWER_STATE_KEY);
		return item ? JSON.parse(item) : false;
	}

	static remove() {
		sessionStorage.removeItem(DRAWER_STATE_KEY);
	}
}
