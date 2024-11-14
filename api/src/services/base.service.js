import { Constants } from "../constants/index.js";
import { NotFoundException, ServerException } from "../exceptions/index.js";
import { ControllersUtils, ModelsUtils } from "../utils/index.js";
import { Service } from "./service.js";

export class BaseService extends Service {
	constructor(model, identifier = Constants.DEFAULT_IDENTIFIER) {
		super(model, identifier);
	}

	async buscar(id, identifier = null, manual_models = []) {
		try {
			const response = await this.model.findOne({
				where: { [identifier ? identifier : this.identifier]: id },
				include: [...manual_models],
			});
			if (!response) throw new NotFoundException("Objeto não encontrado.");
			return response;
		} catch (e) {
			throw new ServerException(e);
		}
	}

	async obter(id, manual_models = []) {
		try {
			const response = await this.model.findOne({
				where: { [this.identifier]: id },
				include: [...ControllersUtils.modelsDirectlyAssociated(this.model), ...manual_models],
			});
			if (!response) throw new NotFoundException("Objeto não encontrado.");
			return response;
		} catch (e) {
			throw new ServerException(e);
		}
	}

	async simples_obter(id, manual_models = []) {
		try {
			const response = await this.model.findOne({
				where: { [this.identifier]: id },
				include: [...manual_models],
			});
			if (!response) throw new NotFoundException("Objeto não encontrado.");
			return response;
		} catch (e) {
			throw new ServerException(e);
		}
	}

	async criar(data) {
		try {
			await ModelsUtils.validateModelData(this.model, data);
			const response = await this.model.create(data);
			if (!response) throw new NotFoundException("Objeto não encontrado.");
			return response;
		} catch (e) {
			throw new ServerException(e);
		}
	}

	async listar(query, manual_models = [], removeDirectlyAssociatedModels = false) {
		try {
			const includeModels = removeDirectlyAssociatedModels
				? [...manual_models]
				: [...ControllersUtils.modelsDirectlyAssociated(this.model), ...manual_models];

			const response = await this.model.findAll({
				where: { ...query },
				include: includeModels,
				order: [
					["data_criacao", "DESC"],
					["id", "DESC"],
				],
			});
			if (!response) throw new NotFoundException("Objeto não encontrado.");
			return response;
		} catch (e) {
			throw new ServerException(e);
		}
	}

	async simples_listar(query, manual_models = []) {
		try {
			const response = await this.model.findAll({
				where: { ...query },
				include: [...manual_models],
				order: [
					["data_criacao", "DESC"],
					["id", "DESC"],
				],
			});
			if (!response) throw new NotFoundException("Objeto não encontrado.");
			return response;
		} catch (e) {
			throw new ServerException(e);
		}
	}

	async atualizar(id, data) {
		try {
			const response = await this.model.update(data, {
				where: { [this.identifier]: id },
			});
			if (!response) throw new NotFoundException("Objeto não encontrado.");
			return response;
		} catch (e) {
			throw new ServerException(e);
		}
	}

	async remover(id) {
		try {
			const response = await this.model.destroy({
				where: { [this.identifier]: id },
			});
			if (!response) throw new NotFoundException("Objeto não encontrado.");
			return response;
		} catch (e) {
			throw new ServerException(e);
		}
	}

	async remover_querry(query) {
		try {
			const response = await this.model.destroy({
				where: { ...query },
			});
			if (!response) throw new NotFoundException("Objeto não encontrado.");
			return response;
		} catch (e) {
			throw new ServerException(e);
		}
	}
}
