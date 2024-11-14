import bodyParser from "body-parser";
import dotenv from "dotenv";
import { Constants } from "../constants/index.js";
import { LogUtils } from "../utils/index.js";
dotenv.config();

export const ServerConfig = async (app) => {
	const { json, urlencoded } = bodyParser;

	//! Configurar CORS
	app.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header(
			"Access-Control-Allow-Headers",
			"Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
		);
		res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
		res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
		next();
	});

	//! Middlewares
	app.use(urlencoded({ extended: true }));
	app.use(json());

	//! Configurações
	app.set("port", Constants.SV_PORT);

	//! Listen
	app.listen(app.get("port"), () => {
		LogUtils.log("Servidor iniciado na porta " + app.get("port") + ".", LogUtils.TIPO.SERVER);
	});
};
