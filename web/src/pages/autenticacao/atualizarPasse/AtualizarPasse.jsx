import { useState } from "react";
import "./atualizar-passe.css";
import { AutenticacaoRequest } from "api/autenticacaoRequest";
import { CaixaTexto, Botao, Notificacao } from "components/index";
import { useLoading } from "hooks/useLoading";
import { Validador } from "utils/validator";
import { useNavigate, useParams } from "react-router-dom";

export function AtualizarPasse() {
	const [senhaAntiga, setsenhaAntiga] = useState("");
	const [senhaNova, setsenhaNova] = useState("");
	const [confirmeSenhaNova, setconfirmeSenhaNova] = useState("");
	const [erros, setErros] = useState({});
	const loading = useLoading();
	const { token } = useParams();
	const navigate = useNavigate();

	const handleLogin = async () => {
		const esquema = {
			senha: { required: true, equals: confirmeSenhaNova },
			senha_old: { required: true },
		};

		const validador = new Validador(esquema);
		const data = { senha: senhaNova, senha_old: senhaAntiga };

		const validacao = validador.validar(data);
		setErros(validacao);
		if (!validador.isValido(validacao)) return;

		loading.start();
		const res = await AutenticacaoRequest.atualizarPasse(token, senhaNova, senhaAntiga);
		if (!res) {
			Notificacao("Os dados estão inválidos!", "error");
		} else {
			Notificacao("Sessão inciada com sucesso!");
			navigate("/");
		}

		loading.stop();
	};

	return (
		<div className="esqueceu-passe-container">
			<form>
				<div className="form-container">
					<CaixaTexto
						handleChange={(e) => setsenhaAntiga(e.target.value)}
						isInvalid={erros.senha_old}
						value={senhaAntiga}
						label="Senha antiga"
						type="password"
					/>
					<CaixaTexto
						handleChange={(e) => setsenhaNova(e.target.value)}
						isInvalid={erros.senha}
						value={senhaNova}
						label="Senha nova"
						type="password"
					/>
					<CaixaTexto
						handleChange={(e) => setconfirmeSenhaNova(e.target.value)}
						isInvalid={erros.senha}
						value={confirmeSenhaNova}
						label="Confirme senha nova"
						type="password"
					/>
				</div>
				<div className="d-flex align-items-center gap-2 mt-4">
					<Botao onClick={handleLogin}>Seguinte</Botao>
				</div>
			</form>
		</div>
	);
}
