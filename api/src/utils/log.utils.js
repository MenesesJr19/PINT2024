import { LogConstants } from "../constants/index.js";
import { DateHelpers } from "../helpers/index.js";

export class LogUtils {
	static #excludedTypes = new Set();

	static #output(message, tipo = null, level = LogUtils.LEVEL.LOG) {
		if (tipo && LogUtils.#excludedTypes.has(tipo)) return;

		console.log(`${DateHelpers.getCurrentTime()} - ${tipo ? `${level} [${tipo}]` : ""}`);
		console.log(message);
		console.log();
	}

	static log(message, tipo = null) {
		this.#output(message, tipo, LogUtils.LEVEL.LOG);
	}

	static error(message, tipo = null) {
		this.#output(message, tipo, LogUtils.LEVEL.ERROR);
	}

	static excludeTypes(tipos) {
		tipos.forEach((type) => LogUtils.#excludedTypes.add(type));
	}

	static TIPO = LogConstants.LOG_TYPE;

	static LEVEL = LogConstants.LOG_LEVEL;
}

LogUtils.excludeTypes([
	LogUtils.TIPO.CONTROLLERS, 
	LogUtils.TIPO.SERVICES,
]);
