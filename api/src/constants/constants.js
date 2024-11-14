export class Constants {
	static ACCESS_LOG_FILENAME = "access.log";

	static MULTER_UPLOADS_DIRECTORY = "uploads";

	static JWT_CONFIG = {
		TOKEN_AUTH_SECRET: "trMCqw7EUQn4FwRyiH9w5jW",
		TOKEN_FORGET_PASSWORD_SECRET: "7AXPRpy1rG22ZSG1hamQ",
		TOKEN_ATUALIZAR_PASSWORD_SECRET: "7AXPRpy1rasdgG22ZSG1hamQ",
		EXPIRES: "30d",
	};

	static SV_PORT = process.env.PORT || 8000;

	static FRONTEND_URL = "https://web-6grl.onrender.com";

	static FUNCION_NAMING = {
		LIST: "list",
		CREATE: "create",
		UPDATE: "update",
		DELETE: "delete",
	};

	static URL_NAMING = {
		GET: "/obter/:id",
		SIMPLE_GET: "/simples/obter/:id",
		CREATE: "/criar",
		LIST: "/listar",
		SIMPLE_LIST: "/simples/listar",
		UPDATE: "/atualizar/:id",
		DELETE: "/remover/:id",
	};

	static DEFAULT_IDENTIFIER = "id";

	static NOTIFICATION_INTERVAL_MIN = 3;

	static NOTIFICATION_SEND_MIN = 15;

	static DEFAULT_PASSWORD_LENGHT = 8;
}
