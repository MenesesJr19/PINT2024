import { Sequelize } from "sequelize";
import { LogUtils } from "../utils/index.js";
import { DatabaseConstants } from "../constants/index.js";
import { ServerException } from "../exceptions/index.js"

export class DatabaseConfig {
	static async connect() {
		const { DATABASE, USERNAME, PASSWORD, HOST, PORT, DIALECT, SSL_ENABLED } = DatabaseConstants.DB_CONFIG;

		const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
			host: HOST,
			port: PORT,
			dialect: DIALECT,
			dialectOptions: SSL_ENABLED ? { ssl: { require: true, rejectUnauthorized: false } } : {},
			logging: false,
		});

		await this.init(sequelize);

		return sequelize;
	}

	static init = async (sequelize) => {
		try {
			await sequelize.authenticate();
			LogUtils.log("Autenticado à Base de Dados!", LogUtils.TIPO.DATABASE);
		} catch (error) {
			LogUtils.error("Erro ao conectar à base de dados: " + error, LogUtils.TIPO.DATABASE);
			throw new ServerException("Erro ao conectar à base de dados.");
		}
	};

	static sync = async (sequelize) => {
		try {
			await sequelize.sync();
			LogUtils.log("Base de Dados sincronizada!", LogUtils.TIPO.DATABASE);
		} catch (error) {
			LogUtils.error("Erro ao sincronizar a base de dados: " + error, LogUtils.TIPO.DATABASE);
			throw new ServerException("Erro ao sincronizar a base de dados.");
		}
	};
}
