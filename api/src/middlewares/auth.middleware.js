import { AuthService, ResponseService } from "../services/index.js";
export const AuthMiddleware = async (req, res, next) => {
	try {
		const token = AuthService.getTokenHeader(req);

		if (token) {
			const decoded = await AuthService.verifyAuthToken(token);
			const user = await AuthService.getUserById(decoded.id);
			req.user = user;
			req.token = token;
		}

		next();
	} catch (erro) {
		return ResponseService.error(res, erro.message)
	}
};
