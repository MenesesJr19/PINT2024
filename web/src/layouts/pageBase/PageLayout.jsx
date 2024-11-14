import { Outlet } from "react-router-dom";
import { Header } from "layouts/header/Header";
import { PageContent } from "./PageContent";
import "./layouts.css";
import { useDrawerStatus } from "hooks/useDrawerStatus";
import { Drawer } from "layouts/drawer/Drawer";
import { DRAWER_CLOSE_WIDTH, DRAWER_OPEN_WIDTH } from "data/constants";
import { Suspense } from "react";
import { Loading } from "layouts/loading/Loading";

export function PageLayout() {
	const { drawerIsOpen, drawerIsHidden } = useDrawerStatus();
	return (
		<div id="PageLayout" className="layout-container">
			<Header />
			<main>
				{!drawerIsHidden && <Drawer />}
				<div id="main-conteudo" style={{ marginLeft: !drawerIsHidden ? drawerIsOpen 
							? `${DRAWER_CLOSE_WIDTH}px` : `${DRAWER_OPEN_WIDTH}px`
							: `0px`, transition: "margin-left 0.3s ease", paddingBottom: "20px" }}>
					<PageContent>
						<Suspense fallback={<Loading />}>
							<Outlet />
						</Suspense>
					</PageContent>
				</div>
			</main>
		</div>
	);
}

