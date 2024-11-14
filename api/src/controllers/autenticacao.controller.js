import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { Constants } from "../constants/index.js";
import { Controller, UtilizadorController } from "./index.js";
import { AuthService, EmailService, ResponseService } from "../services/index.js";
import { CreedentialsWrongException, NotFoundException, ValidationException } from "../exceptions/index.js";
import { ModelsUtils } from "../utils/models.utils.js";
import { models } from "../config/index.js";
import { AuthLoginService } from "../services/authLogin.service.js";

export class AutenticacaoController extends Controller {
	constructor(model, identifier = Constants.DEFAULT_IDENTIFIER) {
		super(model, identifier);
	}

	async obter(req, res) {
		try {
			const token = AuthService.getTokenHeader(req);
			if (!token) throw new NotFoundException("Token não foi recebido!");

			const decoded_token = await AuthService.verifyAuthToken(token);
			if (!decoded_token) throw new NotFoundException("Erro ao descodificar o token.");

			const response = await this.service.buscar(decoded_token.id, null, AutenticacaoController.#modelos_adicionais());
			if (!response) throw new NotFoundException("Utilizador não existe!");

			return ResponseService.success(res, response);
		} catch (error) {
			return ResponseService.error(res, error);
		}
	}

	async atualizar(req, res) {
		try {
			const token = AuthService.getTokenHeader(req);
			if (!token) throw new NotFoundException("Token não foi recebido!");

			const decoded_token = await AuthService.verifyAuthToken(token);
			if (!decoded_token) throw new NotFoundException("Erro ao descodificar o token.");

			const response = await this.service.buscar(decoded_token.id);
			if (!response) throw new NotFoundException("Utilizador não existe!");

			const new_token = await AuthService.createAuthToken(response.id);

			return ResponseService.success(res, { token: new_token });
		} catch (error) {
			return ResponseService.error(res, error);
		}
	}

	async entrar(req, res) {
		try {
			const { login, senha } = req.body;
			const resultado = await AuthLoginService.entrar(login, senha);
			if (resultado?.contaEstaInativa) {
				return ResponseService.unauthorized(res, "A sua conta foi inativada.");
			} else if (resultado.precisaAtualizarSenha) {
				return ResponseService.message(res, "Precisa alterar a senha.", { token: resultado.token });
			} else {
				return ResponseService.success(res, { token: resultado.token });
			}
		} catch (error) {
			return ResponseService.error(res, error.message);
		}
	}

	async external_login(req, res) {
		try {
			const { token } = req.body;
			const dataJson = await AuthService.verifyGoogleLoginToken(token);
			const { email, picture, given_name, family_name } = dataJson;

			const utilizador = await this.model.findOne({ where: { email: email } });
			if (!utilizador) {
				const newUser = await AuthLoginService.criar({
					email,
					nome: given_name,
					sobrenome: family_name,
					imagem: picture,
					verificado: true,
				});
			} else {
				const updateVerifiedUser = await this.service.atualizar(utilizador.id, { verificado: true });
			}
			const loggedUser = await AuthLoginService.entrar(email, null, true);
			if (loggedUser?.contaEstaInativa) {
				return ResponseService.unauthorized(res, "A sua conta foi inativada.");
			} else if (loggedUser.precisaAtualizarSenha) {
				return ResponseService.message(res, "Precisa alterar a senha.", { token: loggedUser.token });
			} else {
				return ResponseService.success(res, { token: loggedUser.token });
			}
		} catch (error) {
			return ResponseService.error(res, error.message);
		}
	}

	async github_login(req, res) {
        try {
            const { photoURL, displayName, email } = req.body;

            const utilizador = await this.model.findOne({ where: { email: email } });
            if (!utilizador) {
                const newUser = await AuthLoginService.criar({
                    email,
                    nome: displayName,
                    sobrenome: " ",
                    imagem: photoURL,
                    verificado: true,
                });
        	} else {
                const updateVerifiedUser = await this.service.atualizar(utilizador.id, { verificado: true });
            }
            const loggedUser = await AuthLoginService.entrar(email, null, true);
            if (loggedUser?.contaEstaInativa) {
            	return ResponseService.unauthorized(res, "A sua conta foi inativada.");
            } else if (loggedUser.precisaAtualizarSenha) {
                return ResponseService.message(res, "Precisa alterar a senha.", { token: loggedUser.token });
            } else {
            	return ResponseService.success(res, { token: loggedUser.token });
            }
        } catch (error) {
            return ResponseService.error(res, error.message);
        }            
    }

	async forgot_password(req, res) {
		try {
			const { email } = req.body;

			const response = await this.service.buscar(email, "email");
			if (!response) throw new NotFoundException("Utilizador não existe.");

			const token = await AuthService.createForgetPasswordToken(response.id, response.email);
			await EmailService.enviaVerificacaoPassword(response.email, response.nome, token);

			return ResponseService.success(res, "Email de verificacao da palavra-passe foi enviado!");
		} catch (error) {
			return ResponseService.error(res, error.message);
		}
	}

	async reset_password(req, res) {
		try {
			const { senha, confirmacao_senha, token } = req.body;
			if (!token) throw new NotFoundException("Token não foi recebido!");
			if (senha != confirmacao_senha) throw new CreedentialsWrongException("Senhas não coincidem.");

			const decoded_token = await AuthService.verifyForgetPasswordToken(token);
			if (!decoded_token) throw new NotFoundException("Erro ao descodificar o token.");

			const response = await ModelsUtils.checkExistence(this.model, { id: decoded_token.id });
			if (!response) throw new NotFoundException("Utilizador não existe.");

			await this.service.atualizar(response.id, { senha: confirmacao_senha });

			return ResponseService.success(res, "Senha atualizada com sucesso!");
		} catch (error) {
			return ResponseService.error(res, error.message);
		}
	}

	async atualizar_password(req, res) {
		try {
			const { token, senha, senha_old } = req.body;

			const decoded_token = await AuthService.verifyAtualizarPasswordToken(token);
			if (!decoded_token) throw new NotFoundException("Erro ao descodificar o token.");

			const response = await ModelsUtils.checkExistence(this.model, { id: decoded_token.id });
			if (!response) throw new NotFoundException("Utilizador não existe.");

			if (!AuthService.comparePassword(senha_old, response.senha))
				throw new CreedentialsWrongException("Senha está incorreta.");

			await this.service.atualizar(response.id, { senha, verificado: true });
			const auth_token = await AuthService.createAuthToken(
				response.id,
				response.tag,
				response.email,
				response.perfil,
				response.imagem
			);

			return ResponseService.success(res, { token: auth_token });
		} catch (error) {
			return ResponseService.error(res, error.message);
		}
	}

	static #modelos_adicionais = () => {
		return [
			{
				model: models.centro,
				as: "utilizador_centro",
			},
			{
				model: models.perfil,
				as: "utilizador_perfil",
			},
		];
	};
}
