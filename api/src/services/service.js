import { Constants } from "../constants/index.js";
import { LogUtils } from "../utils/index.js";

export class Service {
	constructor(model, identifier = Constants.DEFAULT_IDENTIFIER) {
		this.model = model;
		this.identifier = identifier;
		//LogUtils.log(model.name, LogUtils.TIPO.SERVICES);
	}
}
