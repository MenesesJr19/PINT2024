import { Link } from "react-router-dom";
import { Dropdown, Icone, Imagem, Navegar, Texto } from "components/index";
import { userItems } from "./headerData";

import "./header.css";
import { useCurrentUser } from "hooks/useCurrentUser";
import { ImagemUtilizador } from "components/common/imagem/ImagemUtilizador";
import { PROJETO_LOGO } from "data/constants";
import { Row } from "components/ui/Row";
import { COMMON_SIZES, COMMON_TYPES } from "data/data";
import { useDrawerStatus } from "hooks/useDrawerStatus";

export function Header() {
	const { drawerIsOpen, setDrawerIsOpen, drawerIsHidden } = useDrawerStatus();
	const utilizadorAtual = useCurrentUser();

	const handleTrigger = () => {
		setDrawerIsOpen(!drawerIsOpen);
	};

	return (
		<header id="Header" className="header-height fixed-header">
			<div className="nav-area">
				<Row className="gap-4">
					{!drawerIsHidden &&
						<div className="trigger" onClick={handleTrigger}>
							<Icone iconName={drawerIsOpen ? "X" : "List"} className="trigger-icon" />
						</div>
					}
					<Link to="/" className="header-logo remove-margin remove-user-select">
						<Imagem src={PROJETO_LOGO} alt="Logo" className="header-site-logo" />
					</Link>
				</Row>
				<nav className="desktop-nav">
					<ul className="menus d-flex remove-padding"></ul>
				</nav>
				<Row className="gap-4 remove-user-select">
					{utilizadorAtual ? (
						<>
							{utilizadorAtual?.utilizador_centro?.centro && (
								<Row className="gap-2">
									<Icone iconName="BuildingsFill" />
									<Texto size={COMMON_SIZES.FS2} type={COMMON_TYPES.INVERSO}>
										{utilizadorAtual?.utilizador_centro?.centro}
									</Texto>
								</Row>
							)}
							<Row className="gap-2">
								<Icone iconName="PersonFill" />
								<div>
									<div>
										<Texto size={COMMON_SIZES.FS2} type={COMMON_TYPES.INVERSO}>
											{utilizadorAtual.nome} {utilizadorAtual.sobrenome}
										</Texto>
									</div>
									<div>
										<Texto size={COMMON_SIZES.FS0} type={COMMON_TYPES.INVERSO}>
											{utilizadorAtual?.utilizador_perfil?.perfil}
										</Texto>
									</div>
								</div>
							</Row>
							<Dropdown items={userItems(utilizadorAtual.id)}>
								<ImagemUtilizador src={utilizadorAtual.imagem} className="header-user-image cursor-pointer" />
							</Dropdown>
						</>
					) : (
						<Navegar to="/iniciar-sessao">
							<Icone iconName={"PersonPlusFill"} className="icon" />
						</Navegar>
					)}
				</Row>
			</div>
		</header>
	);
}
