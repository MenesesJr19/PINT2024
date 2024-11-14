import { Constants } from "../constants/index.js";
import { ErrorException, MissingParametersException, OutOfRangeException } from "../exceptions/index.js";
import { ResponseService, ScheduleService } from "../services/index.js";
import { ModelsUtils } from "../utils/index.js";
import { BaseController } from "./index.js";

export class ParticipanteController extends BaseController {
	constructor(model, identifier = Constants.DEFAULT_IDENTIFIER) {
		super(model, identifier);
	}

	async criar(req, res) {
		try {
			const exists = await ModelsUtils.checkExistence(this.model, req.body);
			if (exists) throw new ErrorException("Utilizador já esta a participar!");
			const response = await this.service.criar(req.body);
			ScheduleService.enviaEmailNovaParticipacao(req.body.conteudo);
			return ResponseService.success(res, response);
		} catch (error) {
			return ResponseService.error(res, error.message);
		}
	}

	async remover(req, res) {
		try {
			const exists = await ModelsUtils.checkExistence(this.model, req.body);
			if (!exists) throw new ErrorException("Utilizador não está a participar!");

			const response = await this.service.remover_querry(req.body);
			return ResponseService.success(res, response);
		} catch (error) {
			return ResponseService.error(res, error.message);
		}
	}
}
