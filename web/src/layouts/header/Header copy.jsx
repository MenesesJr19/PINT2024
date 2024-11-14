import { Link } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Dropdown, Icone, Imagem, Navegar } from "components/index";
import { userItems } from "./headerData";

import "./header.css";
import { useCurrentUser } from "hooks/useCurrentUser";
import { ImagemUtilizador } from "components/common/imagem/ImagemUtilizador";
import { PROJETO_LOGO } from "data/constants";

export function Header() {
	const utilizadorAtual = useCurrentUser();

	return (
		<section id="Header">
			<div className="nav-area">
				<Link to="/" className="header-logo remove-margin">
					<Imagem src={PROJETO_LOGO} alt="Logo" className="header-site-logo" />
				</Link>
				<Navbar utilizadorAtual={utilizadorAtual} />
				<div>
					{utilizadorAtual ? (
						<Dropdown items={userItems(utilizadorAtual.id)}>
							<ImagemUtilizador src={utilizadorAtual.imagem} className="header-user-image cursor-pointer" />
						</Dropdown>
					) : (
						<Navegar to="/iniciar-sessao">
							<Icone iconName={"PersonPlusFill"} className="icon" />
						</Navegar>
					)}
				</div>
			</div>
		</section>
	);
}
