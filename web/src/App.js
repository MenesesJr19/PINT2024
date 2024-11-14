/// React
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { useEffect } from "react";

/// Componentes
import { INATIVO_DELAY_TO_LOGOUT, PROJETO_NAME } from "data/constants";
import { Rotas } from "routes";
import { useCurrentUser } from "hooks/useCurrentUser";
import { AutenticacaoRequest } from "api";
import { Notificacao } from "components";
import { useLoading } from "hooks/useLoading";

function App() {
	const { userData, isValid, hasFetched } = useCurrentUser(true);
	const loading = useLoading();

	useEffect(() => {
		if (hasFetched) loading.stop();
		else loading.start();
	}, [hasFetched]);

	useEffect(() => {
		document.title = PROJETO_NAME;
	}, []);

	useEffect(() => {
		if (userData?.inativo) {
			loading.start();
			AutenticacaoRequest.terminar_sessao();
			Notificacao("A sua conta foi inativada!", "error");
			setTimeout(() => {
				window.location.reload();
				loading.stop();
			}, INATIVO_DELAY_TO_LOGOUT);
		}
	}, [userData]);

	if (!hasFetched) return;

	const loggedRoutes = createBrowserRouter(Rotas.Routes);
	const unloggedRoutes = createBrowserRouter(Rotas.Routestwo);
	return <>{isValid ? <RouterProvider router={loggedRoutes} /> : <RouterProvider router={unloggedRoutes} />}</>;
}

export default App;
