import { AutenticacaoRequest } from "api";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function TerminarSessao() {
	const navigate = useNavigate();
	
	useEffect(() => {
		handleTerminarSessao();
	}, []);

	const handleTerminarSessao = async () => {
		const confirmLogout = window.confirm("Tem a certeza que quer fazer logout? Vai ter de refazer o login denovo.");
		if (confirmLogout) {
			await AutenticacaoRequest.terminar_sessao();
			navigate("/iniciar-sessao");
			window.location.reload();
		} else {
			navigate("/");
		}
	};

	return <></>;
}
