import { models } from "../config/index.js";
import { Constants, DataConstants } from "../constants/index.js";
import { ConteudoController } from "../controllers/index.js";
import { ScheduleException } from "../exceptions/index.js";
import { LogUtils } from "../utils/index.js";
import { BaseService, EmailService, NotificationService } from "./index.js";

export class ScheduleService {
	static async verificaProximoEventoOuAtividade() {
		try {
			const conteudos = await models.conteudo.findAll({
				include: {
					model: models.utilizador,
					as: "conteudo_utilizador",
				},
			});

			await conteudos.forEach(async (conteudo) => {
				if (this.#isConteudoAtividadeOuEvento(conteudo.tipo)) {
					LogUtils.log(`Evento próximo encontrado para o conteúdo: ${conteudo.titulo}`, LogUtils.TIPO.EVENTO);
					NotificationService.subscribedContentBegining(conteudo.conteudo_utilizador);
				}
			});
		} catch (error) {
			throw new ScheduleException("Erro ao verificar eventos próximos:", error);
		}
	}

	static async enviaEmailDeAlteracoes(conteudo_id, isContentUpdate = true) {
		try {
			const array_emails = [];
			const conteudo_service = new BaseService(models.conteudo);
			const participante_service = new BaseService(models.participante);
			const conteudo_data = await conteudo_service.obter(conteudo_id);
			const participante_data = await participante_service.listar({ conteudo: conteudo_id });

			const criador_email = conteudo_data.conteudo_utilizador.email;
			array_emails.push(criador_email);

			for (const item of participante_data) {
				const participante_email = item.participante_utilizador.email;
				if (participante_email != criador_email) array_emails.push(participante_email);
			}

			for (const email of array_emails) {
				if (isContentUpdate) EmailService.enviaUpdatesInContent(email, conteudo_data.titulo, conteudo_data.id);
				else EmailService.enviaNovoComentario(email, conteudo_data.titulo, conteudo_data.id);
			}
		} catch (error) {
			throw new ScheduleException("Erro ao verificar eventos próximos:", error);
		}
	}

	static async enviaEmailNovaParticipacao(conteudo_id) {
		try {
			const conteudo_service = new BaseService(models.conteudo);
			const conteudo_data = await conteudo_service.obter(conteudo_id);

			const criador_email = conteudo_data.conteudo_utilizador.email;

			EmailService.enviaNovaParticipacao(criador_email, conteudo_data.titulo, conteudo_data.id);
		} catch (error) {
			throw new ScheduleException("Erro ao verificar eventos próximos:", error);
		}
	}

	static async enviaEmailParaInteressados(conteudo_id) {
		try {
			const array_emails = [];
			const conteudo_service = new BaseService(models.conteudo);
			const interesse_service = new BaseService(models.interesse);
			const conteudo_data = await conteudo_service.obter(conteudo_id);
			const interesse_data = await interesse_service.listar({ subtopico: conteudo_data.subtopico });

			const criador_email = conteudo_data.conteudo_utilizador.email;
			for (const item of interesse_data) {
				const interessado_email = item.interesse_utilizador.email;
				if (interessado_email != criador_email) array_emails.push(interessado_email);
			}

			for (const email of array_emails) {
				EmailService.enviaParaInteressados(email, conteudo_data.titulo, conteudo_data.id);
			}
		} catch (error) {
			throw new ScheduleException("Erro ao verificar eventos próximos:", error);
		}
	}

	static #isConteudoAtividadeOuEvento(tipo) {
		if (tipo === DataConstants.TIPO_CONTEUDO.ATIVIDADE || tipo === DataConstants.TIPO_CONTEUDO.EVENTO) return true;
		return false;
	}

	static #isDateWithinInterval(date) {
		const now = new Date();
		const intervalAgo = new Date(now.getTime() + Constants.NOTIFICATION_SEND_MIN * 60 * 1000);
		return date <= intervalAgo && date >= now;
	}
}
