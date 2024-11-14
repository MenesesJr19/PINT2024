import { useContext } from "react";
import { LoadingContext } from "context/loadingContext";

export const useLoading = () => {
	return useContext(LoadingContext);
};
