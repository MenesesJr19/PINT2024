import express from "express";

export const AutenticacaoRoutes = (controllerClass) => {
	const router = express.Router();
	router.route("/obter").get((req, res) => controllerClass.obter(req, res));
	router.route("/atualizar-password").post((req, res) => controllerClass.atualizar_password(req, res));
	router.route("/forgot-password").post((req, res) => controllerClass.forgot_password(req, res));
	router.route("/reset-password").post((req, res) => controllerClass.reset_password(req, res));
	router.route("/atualizar").get((req, res) => controllerClass.atualizar(req, res));
	router.route("/entrar").post((req, res) => controllerClass.entrar(req, res));
	router.route("/external-login").post((req, res) => controllerClass.external_login(req, res));
	router.route("/github-login").post((req, res) => controllerClass.github_login(req, res));
	return router;
};
