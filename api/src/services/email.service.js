import nodemailer from "nodemailer";
import { Constants, EmailConstants } from "../constants/index.js";
import { LogUtils } from "../utils/index.js";

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: "pintegrado298@gmail.com",
		pass: "batb rkkx tjby mlnx",
	},
});

export class EmailService {
	static #setupEmail(to = "", subject = "", text = "", html = "") {
		return {
			from: EmailConstants.EMAIL_INFO.EMAIL,
			to: to,
			subject: subject,
			text: text,
			html: html,
		};
	}

	static #sendEmail = async (to = "", subject = "", text = "", html = "") => {
		try {
			const mailOptions = this.#setupEmail(to, subject, text, html);
			const info = await transporter.sendMail(mailOptions);
			LogUtils.log("Email enviado: " + to, LogUtils.TIPO.EMAIL);
		} catch (error) {
			LogUtils.error("Erro ao enviar email: " + error, LogUtils.TIPO.EMAIL);
		}
	};

	static enviaVerificacaoPassword = async (email, nome, token) => {
		await this.#sendEmail(
			email,
			"Verificação da alteração da Palavra-passe",
			`Olá ${nome},\n\nPor favor, acesse o link abaixo para resetar a palavra-passe:\n\n${Constants.FRONTEND_URL}/resetar-passe?token=${token}`
		);
	};

	static enviaConfirmacao = async (email, nome, token) => {
		await this.#sendEmail(
			email,
			"Confirmação de Email",
			`Olá ${nome},\n\nPor favor, verifique o seu email clicando no link abaixo:\n\n${Constants.FRONTEND_URL}/verify?token=${token}`,
			`<p>Olá ${nome},</p><p>Por favor, verifique o seu email clicando no link abaixo:</p><a href="${Constants.FRONTEND_URL}/autenticacao/verificar/${token}">Verificar Email</a>`
		);
	};

	static enviaAvisoContaCriada = async (email, nome, tag, senha) => {
		await this.#sendEmail(
			email,
			"A sua conta foi criada!",
			`Olá ${nome},\n\nOs dados de autenticação são os seguintes:\n\nLogin: ${tag}\n Password: ${senha}`,
			`<p>Olá ${nome},</p><p>Os dados de autenticação são os seguintes:</p><p>Login: ${tag}</p><p>Password: ${senha}</p>`
		);
	};

	static enviaNotificacao = async (email, nome) => {
		await this.#sendEmail(
			email,
			`Notificação`,
			`Olá ${nome},\n\nPor favor, verifique o seu email clicando no link abaixo:\n`
		);
	};

	static async enviaUpdatesInContent(email, titulo, id) {
		await this.#sendEmail(
			email,
			`Houve alteração no conteudo: ${titulo}`,
			`Foram feitas alteração ao conteudo, para acessar:\n\n${Constants.FRONTEND_URL}/conteudos/${id}\n`
		);
	}

	static async enviaNovaParticipacao(email, titulo, id) {
		await this.#sendEmail(
			email,
			`Nova inscrição no conteudo: ${titulo}`,
			`Um utilizador inscreveu-se para participar no evento, para acessar:\n\n${Constants.FRONTEND_URL}/conteudos/${id}\n`
		);
	}

	static async enviaNovoComentario(email, titulo, id) {
		await this.#sendEmail(
			email,
			`Novo comentario no conteudo: ${titulo}`,
			`Foi adiciona um comentário, para acessar:\n\n${Constants.FRONTEND_URL}/conteudos/${id}\n`
		);
	}

	static async enviaParaInteressados(email, titulo, id) {
		await this.#sendEmail(
			email,
			`Foi criado um conteudo na sua area de interesse: ${titulo}`,
			`Novo conteudo, para acessar:\n\n${Constants.FRONTEND_URL}/conteudos/${id}\n`
		);
	}
}
