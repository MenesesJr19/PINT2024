import App from "App";
import { ToastContainer } from "react-toastify";
import { LoadingProvider } from "context/loadingContext";
import { AutenticacaoProvider } from "hooks/useAutenticacao";
import { DrawerStatusProvider } from "context/drawerStatusContext";
import { GetCurrentUserProvider } from "context/GetCurrentUser";

export function AppWrapper() {
	return (
		<>
			<AutenticacaoProvider>
				<LoadingProvider>
					<DrawerStatusProvider>
						<GetCurrentUserProvider>
							<ToastContainer />
							<App />
						</GetCurrentUserProvider>
					</DrawerStatusProvider>
				</LoadingProvider>
			</AutenticacaoProvider>
		</>
	);
}
