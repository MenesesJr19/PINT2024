import { Op } from "sequelize";
import { models } from "../config/index.js";
import { CreedentialsWrongException } from "../exceptions/index.js";
import { CryptoUtils } from "../utils/index.js";
import { AuthService, BaseService, EmailService } from "./index.js";
import { Constants } from "../constants/index.js";

export class AuthLoginService {
	static async entrar(login, senha, isExternalLogin = false) {
		if (isExternalLogin) senha = "temp";
		if (!login || (!isExternalLogin && !senha)) throw new CreedentialsWrongException("Campos em branco!");

		const utilizador = await models.utilizador.findOne({
			where: { [Op.or]: [{ tag: login }, { email: login }] },
		});
		if (!utilizador) throw new CreedentialsWrongException("Utilizador não existe!");
		if (!isExternalLogin && !AuthService.comparePassword(senha, utilizador.senha))
			throw new CreedentialsWrongException("Senha está incorreta.");

		if (utilizador.inativo) {
			return { contaEstaInativa: true };
		} else if (utilizador.verificado) {
			const token = await AuthService.createAuthToken(utilizador.id);
			return { token, precisaAtualizarSenha: false };
		} else {
			const token = await AuthService.createAtualizarPasswordToken(utilizador.id);
			return { token, precisaAtualizarSenha: true };
		}
	}

	static async criar(data) {
		// Definir a imagem como vazia e gerar a senha
		data.imagem = data.imagem || "";
		data.senha = CryptoUtils.generatePassword(Constants.DEFAULT_PASSWORD_LENGHT);

		// Criar o usuário (ou outro objeto relevante) usando o serviço apropriado
		const service = new BaseService(models.utilizador);
		const response = await service.criar(data);

		// Enviar o e-mail de aviso
		await EmailService.enviaAvisoContaCriada(response.email, response.nome, response.tag, data.senha);

		// Retornar a resposta criada
		return response;
	}
}
