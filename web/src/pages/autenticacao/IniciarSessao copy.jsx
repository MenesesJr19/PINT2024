import { useEffect, useState } from "react";
import "./iniciar-sessao.css";
import { AutenticacaoRequest } from "api/autenticacaoRequest";
import { CaixaTexto, Botao, Navegar, Notificacao } from "components/index";
import { BUTTON_VARIANTS } from "data/data";
import { STATUS } from "data/constants";
import { useLoading } from "hooks/useLoading";
import { useNavigate } from "react-router-dom";
import { useInput } from "hooks/useInput";
import { Validador } from "utils/validator";

export function IniciarSessao() {
	const formLogin = useInput();
	const formSenha = useInput();
	const loading = useLoading();
	const navigate = useNavigate();
	const [erros, setErros] = useState({});

	const handleLogin = async () => {
		const esquema = {
			login: { required: true },
			senha: { required: true },
		};

		const validador = new Validador(esquema);
		const data = {
			login: formLogin.value,
			senha: formSenha.value,
		};

		const validacao = validador.validar(data);
		setErros(validacao);
		if (!validador.isValido(validacao)) return;

		loading.start();
		const res = await AutenticacaoRequest.entrar(formLogin.value, formSenha.value);
		if (res.status === 422) {
			Notificacao("É necessário alterar a palavra-passe!", "info");
			navigate(`/atualizar-passe/${res.data.token}`);
		} else if (res === STATUS.ERRO || !res) {
			Notificacao("Os dados estão inválidos!", "error");
		} else {
			Notificacao("Sessão inciada com sucesso!");
			navigate("/");
			window.location.reload();
		}
		loading.stop();
	};

	return (
		<div className="iniciar-sessao-container">
			<form>
				<div className="form-container">
					<form onSubmit={handleLogin}>
						<CaixaTexto
							handleSubmit={() => handleLogin()}
							handleChange={(e) => formLogin.onChange(e)}
							value={formLogin.value}
							label="Endereço email ou tag"
							isInvalid={erros.login}
							disabled={loading.isLoading}
						/>
						<CaixaTexto
							handleSubmit={() => handleLogin()}
							handleChange={(e) => formSenha.onChange(e)}
							value={formSenha.value}
							label="Palavra-passe"
							type="password"
							isInvalid={erros.senha}
							disabled={loading.isLoading}
						/>
					</form>
				</div>
				<div className="d-flex align-items-center gap-2 mt-4">
					<Botao onClick={handleLogin}>Entrar</Botao>
					<Botao variant={BUTTON_VARIANTS.SECUNDARIO} route="/criar-conta">
						Registrar
					</Botao>
				</div>
			</form>

			<Navegar to="/esqueceu-passe">Esqueceu-se da senha?</Navegar>
		</div>
	);
}
