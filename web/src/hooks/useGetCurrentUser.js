import { useContext } from "react";
import { GetCurrentUserContext } from "context/GetCurrentUser";

export function useGetCurrentUser() {
	return useContext(GetCurrentUserContext);
}
