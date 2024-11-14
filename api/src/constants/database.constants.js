import dotenv from 'dotenv';
dotenv.config();

export class DatabaseConstants {
	static DB_CONFIG = {
		DATABASE: process.env.DB_DATABASE,
		USERNAME: process.env.DB_USERNAME,
		PASSWORD: process.env.DB_PASSWORD,
		HOST: process.env.DB_HOST,
		PORT: process.env.DB_PORT,
		DIALECT: process.env.DB_DIALECT,
		SSL_ENABLED: process.env.DB_SSL_ENABLED === "true",
	};
}
