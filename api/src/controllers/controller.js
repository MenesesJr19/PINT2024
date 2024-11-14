import { Constants, LogConstants } from "../constants/index.js";
import { BaseService } from "../services/index.js";
import { LogUtils } from "../utils/index.js";

export class Controller {
	constructor(model, identifier = Constants.DEFAULT_IDENTIFIER) {
		this.model = model;
		this.identifier = identifier;
		this.service = new BaseService(model, identifier);
		LogUtils.log(model.name, LogUtils.TIPO.CONTROLLERS);
	}
}
