import express from "express";
import { Constants } from "../constants/index.js";

export const ParticipanteRoutes = (controllerClass) => {
	const router = express.Router();
	router.route(Constants.URL_NAMING.GET).get((req, res) => controllerClass.obter(req, res));
	router.route(Constants.URL_NAMING.SIMPLE_GET).get((req, res) => controllerClass.simples_obter(req, res));
	router.route(Constants.URL_NAMING.CREATE).post((req, res) => controllerClass.criar(req, res));
	router.route(Constants.URL_NAMING.LIST).post((req, res) => controllerClass.listar(req, res));
	router.route(Constants.URL_NAMING.SIMPLE_LIST).post((req, res) => controllerClass.simples_listar(req, res));
	router.route(Constants.URL_NAMING.UPDATE).put((req, res) => controllerClass.atualizar(req, res));
	router.route("/remover").post((req, res) => controllerClass.remover(req, res));
	return router;
};
