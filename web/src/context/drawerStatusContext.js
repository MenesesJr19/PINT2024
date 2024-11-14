import { createContext, useEffect, useState } from "react";
import { DrawerStateUtils } from "utils/drawerState.utils";

export const DrawerStatusContext = createContext();

export function DrawerStatusProvider({ children }) {
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);
	const [drawerIsHidden, setDrawerIsHidden] = useState(false);

	useEffect(() => {
		DrawerStateUtils.set(drawerIsOpen);
	}, [drawerIsOpen]);

	return (
		<DrawerStatusContext.Provider value={{ drawerIsOpen, setDrawerIsOpen, drawerIsHidden, setDrawerIsHidden }}>
			{children}
		</DrawerStatusContext.Provider>
	);
}
