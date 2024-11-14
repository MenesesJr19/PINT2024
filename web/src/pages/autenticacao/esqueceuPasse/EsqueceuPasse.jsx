import { useState } from "react";
import "./esqueceu-passe.css";
import { AutenticacaoRequest } from "api/autenticacaoRequest";
import { CaixaTexto, Botao, Notificacao } from "components/index";
import { useLoading } from "hooks/useLoading";
import { REGEX } from "data/regex";
import { Validador } from "utils/validator";
import { useNavigate } from "react-router-dom";

export function EsqueceuPasse() {
	const [formLogin, setFormLogin] = useState("");
	const [erros, setErros] = useState({});
	const loading = useLoading();
	const navigate = useNavigate();

	const handleLogin = async () => {
		const validador = new Validador({ email: { required: true, pattern: REGEX.EMAIL } });
		const data = { email: formLogin };

		const validacao = validador.validar(data);
		setErros(validacao);
		if (!validador.isValido(validacao)) {
			Notificacao("Verifique os campos!", "error");
			return;
		}

		loading.start();
		const res = await AutenticacaoRequest.forgotPassword(formLogin);
		if (!res) {
			Notificacao("Alguma coisa correu mal!", "error");
		} else {
			Notificacao("Foi-lhe enviado um email!");
			navigate("/iniciar-sessao");
			window.location.reload();
		}

		loading.stop();
	};

	return (
		<div className="esqueceu-passe-container">
			<form>
				<div className="form-container">
					<CaixaTexto
						handleChange={(e) => setFormLogin(e.target.value)}
						isInvalid={erros.email}
						value={formLogin}
						label="Email"
					/>
				</div>
				<div className="d-flex align-items-center gap-2 mt-4">
					<Botao onClick={handleLogin}>Seguinte</Botao>
				</div>
			</form>
		</div>
	);
}
