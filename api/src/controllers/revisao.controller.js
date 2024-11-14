import { models } from "../config/index.js";
import { Constants, DataConstants } from "../constants/index.js";
import { ResponseService } from "../services/index.js";
import { BaseController } from "./index.js";

export class RevisaoController extends BaseController {
	constructor(model, identifier = Constants.DEFAULT_IDENTIFIER) {
		super(model, identifier);
	}

	async listar(req, res) {
		try {
			const response = await this.service.listar(req.body, RevisaoController.#modelos_adicionais());
			return ResponseService.success(res, response);
		} catch (error) {
			return ResponseService.error(res, error.message);
		}
	}

	/*async em_revisao_listar(req, res) {
		try {
			req.body = {
				estado: DataConstants.ESTADO.REJEITADO
			}
			const response = await this.service.listar(req.body, RevisaoController.#modelos_adicionais());
			return ResponseService.success(res, response);
		} catch (error) {
			return ResponseService.error(res, error.message);
		}
	}*/

	static #modelos_adicionais = () => {
		return [
			{
				model: models.comentario,
				as: "revisao_comentario",
				include: [
					{
						model: models.conteudo,
						as: "comentario_conteudo",
					},
				],
			},
			{
				model: models.conteudo,
				as: "revisao_conteudo",
				include: [
					{
						model: models.utilizador,
						as: "conteudo_utilizador",
					},
				],
			},
		];
	};
}
