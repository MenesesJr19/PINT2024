import { ModelsUtils } from "../utils/index.js";
export default function (sequelize, DataTypes) {
	return sequelize.define(
		"classificacao",
		{
			id: ModelsUtils.primaryKeyDataType(),
			data_criacao: ModelsUtils.dataCriacaoDataType(),
			classificacao: {
				type: DataTypes.SMALLINT,
				allowNull: true,
			},
			conteudo: ModelsUtils.foreignKeyDataType({ allowNull: true }),
			comentario: ModelsUtils.foreignKeyDataType({ allowNull: true }),
			utilizador: ModelsUtils.foreignKeyDataType(),
		},
		{
			sequelize,
			schema: "public",
			timestamps: false,
			freezeTableName: true,
			indexes: [
				{
					name: "pk_classificacao",
					unique: true,
					fields: [{ name: "id" }],
				},
			],
		}
	);
}
