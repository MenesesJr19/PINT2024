import { models } from "../config/index.js";
import { Constants } from "../constants/index.js";
import { ResponseService } from "../services/index.js";
import { BaseController } from "./index.js";

export class TipoController extends BaseController {
	constructor(model, identifier = Constants.DEFAULT_IDENTIFIER) {
		super(model, identifier);
	}

	async listar(req, res) {
		try {
			const response = await this.service.listar(req.body, TipoController.#modelos_adicionais());
			return ResponseService.success(res, response);
		} catch (error) {
			return ResponseService.error(res, error.message);
		}
	}

	static #modelos_adicionais = () => {
		return [
			{
				model: models.conteudo,
				as: "conteudo_tipo",
				include: [
					{
						model: models.utilizador,
						as: "conteudo_utilizador",
					},
					{
						model: models.subtopico,
						as: "conteudo_subtopico",
					},
				],
			},
		];
	};
}
