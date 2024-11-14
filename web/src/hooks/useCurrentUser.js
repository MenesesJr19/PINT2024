import { AutenticacaoRequest } from "api";
import { userProfile } from "data/userProfile";
import { useEffect, useState } from "react";
import { useGetCurrentUser } from "./useGetCurrentUser";

export const useCurrentUser = (shouldReturnIsValid = false) => {
	const [userData, setUserData] = useState({});
	const [isValid, setIsValid] = useState(false);
	const [hasFetched, setHasFetched] = useState(false);
	const localData = useGetCurrentUser();

	useEffect(() => {
		getUserData();
	}, []);

	const getUserData = async () => {
		try {
			const data = await AutenticacaoRequest.obterUtilizadorAtual();
			userProfile.setData(data);
			setUserData(data);
			localData.setUserData(data);
			setIsValid(!!data);
			localData.setIsValid(!!data);
		} catch (error) {
			setIsValid(false);
			localData.setIsValid(false);
			console.error("Error fetching user data:", error);
		} finally {
			setHasFetched(true);
			localData.setHasFetched(true);
		}
	};

	return shouldReturnIsValid ? { userData, isValid, hasFetched } : userData;
};
