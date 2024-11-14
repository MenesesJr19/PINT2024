import { ModelsUtils } from "../utils/index.js";
export default function (sequelize, DataTypes) {
	return sequelize.define(
		"comentario",
		{
			id: ModelsUtils.primaryKeyDataType(),
			data_criacao: ModelsUtils.dataCriacaoDataType(),
			comentario: {
				type: DataTypes.STRING(150),
				allowNull: false,
			},
			conteudo: ModelsUtils.foreignKeyDataType(),
			utilizador: ModelsUtils.foreignKeyDataType(),
		},
		{
			sequelize,
			schema: "public",
			timestamps: false,
			freezeTableName: true,
			indexes: [
				{
					name: "pk_comentario",
					unique: true,
					fields: [{ name: "id" }],
				},
			],
		}
	);
};
