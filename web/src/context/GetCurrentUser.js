import { createContext, useState } from "react";

export const GetCurrentUserContext = createContext();

export function GetCurrentUserProvider({ children }) {
	const [userData, setUserData] = useState({});
	const [isValid, setIsValid] = useState({});
	const [hasFetched, setHasFetched] = useState(false);

	return (
		<GetCurrentUserContext.Provider value={{ userData, setUserData, hasFetched, setHasFetched, isValid, setIsValid }}>
			{children}
		</GetCurrentUserContext.Provider>
	);
}
