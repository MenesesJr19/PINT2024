import React from "react";
import "./iniciar-sessao.css";
import { Botao, Icone, Texto } from "components";
import { COMMON_SIZES, COMMON_TYPES } from "data/data";
import { Validador } from "utils/validator";
import { useEffect, useState } from "react";
import "./iniciar-sessao.css";
import { AutenticacaoRequest } from "api/autenticacaoRequest";
import { CaixaTexto, Navegar, Notificacao } from "components/index";
import { BUTTON_VARIANTS } from "data/data";
import { STATUS } from "data/constants";
import { useLoading } from "hooks/useLoading";
import { Link, useNavigate } from "react-router-dom";
import { useInput } from "hooks/useInput";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { REGEX } from "data/regex";
import { ApiRequest } from "api";
import { GOOGLE_CLIENT_ID } from "data/credentials";

export function IniciarSessao() {
	const formLogin = useInput();
	const formSenha = useInput();
	const loading = useLoading();
	const navigate = useNavigate();
	const [erros, setErros] = useState({});

	const GetSaudacao = () => {
		const hora = new Date().getHours();
		if (hora < 12) return "Bom dia";
		else if (hora < 18) return "Boa tarde";
		else return "Boa noite";
	};

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
		handleAfterLoginLogic(res);
		loading.stop();
	};

	const handleAfterLoginLogic = (res) => {
		if (res.status === 401) {
			Notificacao("A sua conta foi inativada!", "info");
		} else if (res.status === 422) {
			Notificacao("É necessário alterar a palavra-passe!", "info");
			navigate(`/atualizar-passe/${res.data.token}`);
			window.location.reload();
		} else if (res === STATUS.ERRO || !res) {
			Notificacao("Os dados estão inválidos!", "error");
		} else {
			Notificacao("Sessão inciada com sucesso!");
			navigate("/");
			window.location.reload();
		}
	};

	const onSuccess = (response) => {
		const token = response.credential;
		handleGoogleLogin(token);
	};

	const handleGoogleLogin = async (token) => {
		loading.start();
		const response = await AutenticacaoRequest.externalLogin(token);
		handleAfterLoginLogic(response);
		loading.stop();
	};

	const onFailure = (error) => {
		console.error("Login Failed:", error);
	};

	return (
		<div className="container-fluid">
			<div className="row d-flex justify-content-center align-items-center h-100">
				<div className="col-12">
					<div className="cartao bg-dark text-white my-5 mx-auto" style={{ borderRadius: "1rem", maxWidth: "400px" }}>
						<div className="cartao-body p-5 d-flex flex-column align-items-center mx-auto w-100">
							<Texto type={COMMON_TYPES.INVERSO} size={COMMON_SIZES.FS4} className="text-white-50 mb-4">
								{GetSaudacao()}
							</Texto>
							<Texto type={COMMON_TYPES.INVERSO} size={COMMON_SIZES.FS5} className="mb-2 text-uppercase">
								Iniciar Sessão
							</Texto>
							<Texto className="text-white-50 mb-5">Introduza o login e palavra-passe!</Texto>

							<div className="mb-4 mx-5 w-100">
								<CaixaTexto
									handleSubmit={() => handleLogin()}
									handleChange={(e) => formLogin.onChange(e)}
									value={formLogin.value}
									label="Username ou email"
									isInvalid={erros.login}
									disabled={loading.isLoading}
									isInversed={true}
								/>
							</div>

							<div className="mb-4 mx-5 w-100">
								<CaixaTexto
									handleSubmit={() => handleLogin()}
									handleChange={(e) => formSenha.onChange(e)}
									value={formSenha.value}
									label="Palavra-passe"
									type="password"
									isInvalid={erros.senha}
									disabled={loading.isLoading}
									isInversed={true}
								/>
							</div>

							<p className="small mb-3 pb-lg-2">
								<Navegar to="/esqueceu-passe" className="text-white-50">
									Esqueceu-se da palavra-passe?
								</Navegar>
							</p>

							<Botao onClick={handleLogin}>Entrar</Botao>

							<div className="d-flex flex-row mt-3">
								<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
									<GoogleLogin onSuccess={onSuccess} onError={onFailure} />
								</GoogleOAuthProvider>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
