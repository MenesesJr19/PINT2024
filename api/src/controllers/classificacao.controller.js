import { Constants } from "../constants/index.js";
import { MissingParametersException, OutOfRangeException } from "../exceptions/index.js";
import { ResponseService } from "../services/index.js";
import { ModelsUtils } from "../utils/index.js";
import { BaseController } from "./index.js";

export class ClassificacaoController extends BaseController {
	constructor(model, identifier = Constants.DEFAULT_IDENTIFIER) {
		super(model, identifier);
	}

	async criar(req, res) {
		try {
			const { comentario, conteudo, utilizador, classificacao } = req.body;

			let tipo_classificacao_id, tipo_classificacao;
			if (comentario) {
				tipo_classificacao_id = "comentario";
				tipo_classificacao = comentario;
			} else if (conteudo) {
				tipo_classificacao_id = "conteudo";
				tipo_classificacao = conteudo;
			} else throw new MissingParametersException("Faltam dados!");

			if (classificacao > 5 || classificacao < 0)
				throw new OutOfRangeException("A classificação tem que estar entre 0-5.");
			const exists = await ModelsUtils.checkExistence(this.model, {
				[tipo_classificacao_id]: tipo_classificacao,
				utilizador,
			});
			let response;
			if (exists == null) {
				response = await this.service.criar(req.body);
			} else {
				response = await this.service.atualizar(exists.id, req.body);
			}
			return ResponseService.success(res, response);
		} catch (error) {
			return ResponseService.error(res, error.message);
		}
	}
}
