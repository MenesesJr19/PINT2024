import { DataTypes } from "sequelize";
import { ModelsUtils } from "../utils/index.js";
import {
	AlbumModel,
	CentroModel,
	ClassificacaoModel,
	ComentarioModel,
	ConteudoModel,
	DenunciaModel,
	EstadoModel,
	InteresseModel,
	NotificacaoModel,
	ParticipanteModel,
	PerfilModel,
	RevisaoModel,
	SubtopicoModel,
	TipoModel,
	TopicoModel,
	UtilizadorModel,
} from "../models/index.js";
import { DatabaseConfig } from "./index.js";
import { LogUtils } from "../utils/index.js";

export const models = {};

export const ModelsConfig = async (sequelize) => {
	const album = AlbumModel(sequelize, DataTypes);
	const centro = CentroModel(sequelize, DataTypes);
	const classificacao = ClassificacaoModel(sequelize, DataTypes);
	const comentario = ComentarioModel(sequelize, DataTypes);
	const conteudo = ConteudoModel(sequelize, DataTypes);
	const denuncia = DenunciaModel(sequelize, DataTypes);
	const estado = EstadoModel(sequelize, DataTypes);
	const interesse = InteresseModel(sequelize, DataTypes);
	const notificacao = NotificacaoModel(sequelize, DataTypes);
	const participante = ParticipanteModel(sequelize, DataTypes);
	const perfil = PerfilModel(sequelize, DataTypes);
	const revisao = RevisaoModel(sequelize, DataTypes);
	const subtopico = SubtopicoModel(sequelize, DataTypes);
	const tipo = TipoModel(sequelize, DataTypes);
	const topico = TopicoModel(sequelize, DataTypes);
	const utilizador = UtilizadorModel(sequelize, DataTypes);

	ModelsUtils.defineAssociation(classificacao, conteudo);
	ModelsUtils.defineAssociation(classificacao, comentario);
	ModelsUtils.defineAssociation(classificacao, utilizador);

	ModelsUtils.defineAssociation(comentario, conteudo);
	ModelsUtils.defineAssociation(comentario, utilizador);

	ModelsUtils.defineAssociation(conteudo, utilizador);
	ModelsUtils.defineAssociation(conteudo, subtopico);
	ModelsUtils.defineAssociation(conteudo, tipo);

	ModelsUtils.defineAssociation(album, conteudo);

	ModelsUtils.defineAssociation(denuncia, estado);
	ModelsUtils.defineAssociation(denuncia, comentario);
	ModelsUtils.defineAssociation(denuncia, utilizador);

	ModelsUtils.defineAssociation(interesse, subtopico);
	ModelsUtils.defineAssociation(interesse, utilizador);

	ModelsUtils.defineAssociation(notificacao, conteudo);
	ModelsUtils.defineAssociation(notificacao, comentario);

	ModelsUtils.defineAssociation(participante, utilizador);
	ModelsUtils.defineAssociation(participante, conteudo);

	ModelsUtils.defineAssociation(revisao, estado);
	ModelsUtils.defineAssociation(revisao, conteudo);
	ModelsUtils.defineAssociation(revisao, comentario);

	ModelsUtils.defineAssociation(subtopico, topico);

	ModelsUtils.defineAssociation(utilizador, perfil);
	ModelsUtils.defineAssociation(utilizador, centro);

	models.album = album;
	models.centro = centro;
	models.classificacao = classificacao;
	models.comentario = comentario;
	models.conteudo = conteudo;
	models.denuncia = denuncia;
	models.estado = estado;
	models.interesse = interesse;
	models.notificacao = notificacao;
	models.participante = participante;
	models.perfil = perfil;
	models.revisao = revisao;
	models.subtopico = subtopico;
	models.tipo = tipo;
	models.topico = topico;
	models.utilizador = utilizador;

	LogUtils.log("Models inicializados.", LogUtils.TIPO.MODELS);
	await DatabaseConfig.sync(sequelize);
};
