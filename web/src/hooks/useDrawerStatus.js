import { DrawerStatusContext } from "context/drawerStatusContext";
import { useContext } from "react";

export function useDrawerStatus() {
	return useContext(DrawerStatusContext);
}
