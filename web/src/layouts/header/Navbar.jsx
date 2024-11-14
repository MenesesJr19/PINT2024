import { Utils } from "utils/utils";
import { menuItemsData } from "./headerData";
import MenuItems from "./HeaderItems";

export function Navbar({ utilizadorAtual }) {
	const depthLevel = 0;
	return (
		<nav className="desktop-nav">
			<ul className="menus d-flex remove-padding">
				{menuItemsData
					.filter((item) => Utils.Perms(item.perfil, utilizadorAtual.perfil))
					.map((item, index) => {
						return <MenuItems items={item} key={index} depthLevel={depthLevel} />;
					})}
			</ul>
		</nav>
	);
}
