import { useState } from "react";
import "./resetar-passe.css";
import { AutenticacaoRequest } from "api/autenticacaoRequest";
import { CaixaTexto, Botao, Notificacao } from "components/index";
import { useLoading } from "hooks/useLoading";
import { Validador } from "utils/validator";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function ResetarPasse() {
	const [formSenha, setFormSenha] = useState("");
	const [formSenhaConfirmacao, setFormSenhaConfirmacao] = useState("");
	const [token, settoken] = useState("");
	const [erros, setErros] = useState({});
	const loading = useLoading();
	const navigate = useNavigate();

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		settoken(urlParams.get("token"));
	}, []);

	const handleResetarPassword = async () => {
		const esquema = {
			senha: { required: true },
			confirmacao_senha: { required: true },
		};

		const validador = new Validador(esquema);
		const data = { senha: formSenha, confirmacao_senha: formSenhaConfirmacao };

		const validacao = validador.validar(data);
		setErros(validacao);
		if (!validador.isValido(validacao)) return;

		loading.start();
		const res = await AutenticacaoRequest.resetPassword(token, formSenha, formSenhaConfirmacao);
		if (!res) {
			Notificacao("Os dados estão inválidos!", "error");
		} else {
			Notificacao("Sessão inciada com sucesso!");
			navigate("/iniciar-sessao");
		}

		loading.stop();
	};

	return (
		<div className="resetar-passe-container">
			<form>
				<div className="form-container">
					<CaixaTexto
						handleChange={(e) => setFormSenha(e.target.value)}
						isInvalid={erros.senha}
						value={formSenha}
						label="Senha"
						type="password"
					/>
					<CaixaTexto
						handleChange={(e) => setFormSenhaConfirmacao(e.target.value)}
						isInvalid={erros.confirmacao_senha}
						value={formSenhaConfirmacao}
						label="Confirme a Senha"
						type="password"
					/>
				</div>
				<div className="d-flex align-items-center gap-2 mt-4">
					<Botao onClick={handleResetarPassword}>Seguinte</Botao>
				</div>
			</form>
		</div>
	);
}
