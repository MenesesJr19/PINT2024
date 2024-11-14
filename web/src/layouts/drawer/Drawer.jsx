import "./drawer.css";
import { Icone, Texto } from "components";
import { Link, useLocation } from "react-router-dom";
import { COMMON_TYPES } from "data/data";
import { Row } from "components/ui/Row";
import { useDrawerStatus } from "hooks/useDrawerStatus";
import { DRAWER_CLOSE_WIDTH, DRAWER_OPEN_WIDTH } from "data/constants";
import { useOnResize } from "hooks/useOnResize";
import { useEffect, useState } from "react";
import { NavItems } from "data/navItems";

export function Item({ route, icone, label }) {
	const { drawerIsOpen } = useDrawerStatus();
	const [isSelected, setisSelected] = useState();
	const location = useLocation();

	useEffect(() => {
		setisSelected(location.pathname === route);
	}, [location.pathname, route]);

	return (
		<div className={`header-item remove-user-select ${isSelected ? "drawer-item-highlight" : "drawer-item"}`}>
			<Link to={route} className="drawer-position top-gap-beetwen-items">
				<Row className="gap-3">
					<Icone
						type={COMMON_TYPES.INVERSO}
						iconName={icone}
						size={4}
						className={`drawer-item-icon ${isSelected ? "drawer-item-icon-highlight" : ""}`}
					/>
					{drawerIsOpen && (
						<Texto type={COMMON_TYPES.INVERSO} className="drawer-item-label">
							{label}
						</Texto>
					)}
				</Row>
			</Link>
		</div>
	);
}

export function Drawer() {
	const { drawerIsOpen, setDrawerIsOpen } = useDrawerStatus();
	const windowWidth = useOnResize();

	useEffect(() => {
		if (windowWidth < 1300) setDrawerIsOpen(false);
	}, [windowWidth]);

	return (
		<aside
			className={`drawer-menu`}
			style={{
				width: drawerIsOpen ? `${DRAWER_CLOSE_WIDTH}px` : `${DRAWER_OPEN_WIDTH}px`,
				transition: "width 0.3s ease",
			}}
		>
			<nav className="drawer-nav-items">{NavItems.Render()}</nav>
		</aside>
	);
}
