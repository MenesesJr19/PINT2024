import { models } from "../config/index.js";
import { Constants } from "../constants/index.js";
import { BaseService, ResponseService } from "../services/index.js";
import { ModelsUtils } from "../utils/models.utils.js";
import { BaseController } from "./index.js";

export class InteresseController extends BaseController {
	constructor(model, identifier = Constants.DEFAULT_IDENTIFIER) {
		super(model, identifier);
	}

	async criar(req, res) {
		try {
			const { subtopico: subtopicosRecebidos, utilizador } = req.body;

			const interesseAll = await this.service.listar({ utilizador: utilizador });
			const subtopicoAllSet = new Set(interesseAll.map((item) => item.interesse_subtopico.id));

			const subtopicosRecebidosSet = new Set(subtopicosRecebidos);

			const subtopicosAAdicionar = [...subtopicosRecebidosSet].filter((subtopico) => !subtopicoAllSet.has(subtopico));
			const subtopicosARemover = [...subtopicoAllSet].filter((subtopico) => !subtopicosRecebidosSet.has(subtopico));

			for (const item of subtopicosAAdicionar) await this.service.criar({ subtopico: item, utilizador: utilizador });

			for (const item of subtopicosARemover)
				await this.service.remover_querry({ subtopico: item, utilizador: utilizador });

			return ResponseService.success(res, { removed: subtopicosARemover, added: subtopicosAAdicionar });
		} catch (error) {
			return ResponseService.error(res, error.message);
		}
	}
}
