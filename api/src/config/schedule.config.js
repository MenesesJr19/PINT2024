import cron from "node-cron";
import { Constants } from "../constants/index.js";
import { ScheduleService } from "../services/index.js";
import { LogUtils } from "../utils/index.js";

export class ScheduleConfig {
	static async init() {
		await this.#verify();
		cron.schedule(`*/${Constants.NOTIFICATION_INTERVAL_MIN} * * * *`, async () => {
			await this.#verify();
		});
	}

	static async #verify() {
		LogUtils.log("Verificando se existem eventos próximos...", LogUtils.TIPO.EVENTO);
		//await ScheduleService.verificaProximoEventoOuAtividade();
		LogUtils.log("Verificação de eventos próximos concluída.", LogUtils.TIPO.EVENTO);
	}
}
