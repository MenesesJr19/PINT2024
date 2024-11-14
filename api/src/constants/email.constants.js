import dotenv from 'dotenv';
dotenv.config();

export class EmailConstants {
	static EMAIL_INFO = {
		EMAIL: process.env.EC_EMAIL,
		PASSWORD: process.env.EC_PASSWORD,
		APP_PASSWORD: process.env.EC_APP_PASSWORD,
	};
}
