export class CloudinaryConstants {
	static CREEDENTIALS = {
		CLOUD_NAME: process.env.CD_CLOUD_NAME,
		API_KEY: process.env.CD_API_KEY,
		API_SECRET: process.env.CD_API_SECRET,
		API_ENVIRONMENT_VARIABLE: process.env.CD_API_ENVIRONMENT_VARIABLE,
	};

	static FILE_TYPE = {
		IMAGEM: "imagem",
	};

	static FOLDER_NAME = {
		UTILIZADOR: "utilizador",
		CONTEUDO: "conteudo",
		ALBUM: "album",
	};
}
