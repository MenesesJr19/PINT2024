import { models } from "../config/index.js";
import { Constants } from "../constants/index.js";
import { ResponseService } from "../services/index.js";
import { BaseController } from "./index.js";

export class CentroController extends BaseController {
	constructor(model, identifier = Constants.DEFAULT_IDENTIFIER) {
		super(model, identifier);
	}
}
