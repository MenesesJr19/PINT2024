import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";
import { Icone, Texto } from "components/index";
import { COMMON_TYPES } from "data/data";

export function Footer() {
	return (
		<section id="Footer" className="footer-content d-flex justify-content-between">
			<div className="align-items-left d-flex gap-4 align-items-center">
				<Texto>An IBM Group Company</Texto>
				<Texto>@ Softinsa Todos os direitos reservados</Texto>
				<Link to="/politica-de-privacidade">
					<Texto>Política de Privacidade</Texto>
				</Link>
			</div>
			<div className="align-items-right d-flex gap-4 align-items-center">
				<Link to="/sobre-nos">Sobre nós</Link>
				<Link to="/contacte-nos">Contacte-nos:</Link>
				<div className="d-flex gap-2">
					<Link to="https://www.facebook.com/">
						<Icone iconName="Facebook" type={COMMON_TYPES.INVERSO} />
					</Link>
					<Link to="https://x.com">
						<Icone iconName="TwitterX" type={COMMON_TYPES.INVERSO} />
					</Link>
				</div>
			</div>
		</section>
	);
};
