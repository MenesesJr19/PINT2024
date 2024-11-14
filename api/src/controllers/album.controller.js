import { CloudinaryConstants, Constants } from "../constants/index.js";
import { NotFoundException, UploadException } from "../exceptions/index.js";
import { CloudStorageService, MulterService, ResponseService, UploadService } from "../services/index.js";
import { ModelsUtils } from "../utils/models.utils.js";
import { BaseController } from "./base.controller.js";

export class AlbumController extends BaseController {
	constructor(model, identifier = Constants.DEFAULT_IDENTIFIER) {
		super(model, identifier);
	}

	async criar(req, res) {
		try {
			const local = await MulterService.upload(req, CloudinaryConstants.FILE_TYPE.IMAGEM);
			if (!local) throw new UploadException("Ocorreu um erro a fazer o upload da imagem/ficheiro.");

			req.body.imagem = "temp";
			await ModelsUtils.validateModelData(this.model, req.body);

			const paths = UploadService.formatPathsArray(local);
			const cloud = await CloudStorageService.upload(paths, CloudinaryConstants.FOLDER_NAME.ALBUM);
			if (!cloud) throw new UploadException("Ocorreu um erro a fazer o upload da imagem/ficheiro.");

			const responses = [];
			for (let img of cloud) {
				req.body.imagem = img.url;
				const response = await this.service.criar(req.body);
				if (!response) throw new NotFoundException("Objeto não existe.");
				responses.push(response);
			}

			return ResponseService.success(res, responses);
		} catch (error) {
			return ResponseService.error(res, error.message);
		}
	}
}
