import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Constants, GoogleCredentials } from "../constants/index.js";
import { ErrorException } from "../exceptions/error.exception.js";
import { BaseService } from "./base.service.js";
import { models } from "../config/models.config.js";
import { OAuth2Client } from "google-auth-library";

export class AuthService {
	static getTokenHeader = (req) => {
		const tokenWithBearer = req.headers["x-access-token"] || req.headers["authorization"];
		if (tokenWithBearer && tokenWithBearer.startsWith("Bearer ")) {
			return tokenWithBearer.slice(7, tokenWithBearer.length);
		}
		return null;
	};

	static createAuthToken = async (id) => {
		return jwt.sign(
			{
				id: id,
			},
			Constants.JWT_CONFIG.TOKEN_AUTH_SECRET,
			{ expiresIn: Constants.JWT_CONFIG.EXPIRES }
		);
	};

	static createForgetPasswordToken = async (id, email) => {
		return jwt.sign(
			{
				id: id,
				email: email,
			},
			Constants.JWT_CONFIG.TOKEN_FORGET_PASSWORD_SECRET,
			{ expiresIn: Constants.JWT_CONFIG.EXPIRES }
		);
	};

	static createAtualizarPasswordToken = async (id) => {
		return jwt.sign(
			{
				id: id,
			},
			Constants.JWT_CONFIG.TOKEN_ATUALIZAR_PASSWORD_SECRET,
			{ expiresIn: Constants.JWT_CONFIG.EXPIRES }
		);
	};

	static verifyAuthToken = async (token) => {
		return jwt.verify(token, Constants.JWT_CONFIG.TOKEN_AUTH_SECRET);
	};

	static verifyForgetPasswordToken = async (token) => {
		return jwt.verify(token, Constants.JWT_CONFIG.TOKEN_FORGET_PASSWORD_SECRET);
	};

	static verifyAtualizarPasswordToken = async (token) => {
		return jwt.verify(token, Constants.JWT_CONFIG.TOKEN_ATUALIZAR_PASSWORD_SECRET);
	};

	static verifyGoogleLoginToken = async (token) => {
		try {
			const client = new OAuth2Client(GoogleCredentials.GOOGLE_CLIENT_ID);
			var ticket = await client.verifyIdToken({ idToken: token, audience: GoogleCredentials.GOOGLE_CLIENT_ID });
			return ticket.getPayload();
		} catch {
			const client = new OAuth2Client(GoogleCredentials.GOOGLE_CLIENT_ID_MOBILE);
			var ticket = await client.verifyIdToken({ idToken: token, audience: GoogleCredentials.GOOGLE_CLIENT_ID_MOBILE });
			return ticket.getPayload();
		}
	}

	static comparePassword = (senha_recebida, senha) => {
		return bcrypt.compareSync(senha_recebida, senha);
	};

	static hasPermission = (user, method, path) => {
		return true;
	};

	static async getUserById(id) {
		try {
			const baseService = new BaseService(models.utilizador);
			const user = await baseService.buscar(id);
			if (!user) throw new NotFoundException("Utilizador não existe!");

			return user;
		} catch (error) {
			throw new ErrorException("Erro a obter o utilizador pelo token.");
		}
	}
}
