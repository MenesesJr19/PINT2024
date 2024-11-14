import { models } from "../config/index.js";
import { Constants } from "../constants/index.js";
import { ResponseService } from "../services/index.js";
import { BaseController } from "./index.js";

export class TopicoController extends BaseController {
	constructor(model, identifier = Constants.DEFAULT_IDENTIFIER) {
		super(model, identifier);
	}

	async simples_listar(req, res) {
		try {
			const response = await this.service.simples_listar(req.body, TopicoController.#modelos_adicionais_simplificado());
			return ResponseService.success(res, response);
		} catch (error) {
			return ResponseService.error(res, error.message);
		}
	}

	static #modelos_adicionais_simplificado = () => {
		return [
			{
				model: models.subtopico,
				as: "subtopico_topico",
			},
		];
	};
}
