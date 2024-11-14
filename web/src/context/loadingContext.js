import { createContext } from "react";
import { useLoadingState } from "hooks/useLoadingState";

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
	const loadingState = useLoadingState();

	return (
		<LoadingContext.Provider value={loadingState}>
			{loadingState.create}
			{children}
		</LoadingContext.Provider>
	);
};
