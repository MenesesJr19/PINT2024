import { useEffect, useState, useContext, createContext } from "react";
import { AutenticacaoRequest } from "api/autenticacaoRequest";
import { Log } from "utils/log.utils";

export const AutenticacaoContext = createContext();

export const useAutenticacao = () => {
	return useContext(AutenticacaoContext);
};

export const AutenticacaoProvider = ({ children }) => {
	const [userData, setUserData] = useState({});

	useEffect(() => {
		const getUserData = async () => {
			try {
				const data = await AutenticacaoRequest.obterUtilizadorAtual();
				setUserData(data);
			} catch (error) {
				Log.erro("Error fetching user data:", error);
			}
		};
		getUserData();
	}, []);

	return <AutenticacaoContext.Provider value={userData}>{children}</AutenticacaoContext.Provider>;
};
