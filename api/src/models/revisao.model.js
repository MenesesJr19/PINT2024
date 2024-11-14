import { ModelsUtils } from "../utils/index.js";
export default function (sequelize, DataTypes) {
	return sequelize.define(
		"revisao",
		{
			id: ModelsUtils.primaryKeyDataType(),
			data_criacao: ModelsUtils.dataCriacaoDataType(),
			motivo: {
				type: DataTypes.STRING(500),
				allowNull: true,
			},
			estado: ModelsUtils.foreignKeyDataType({ defaultValue: 1 }),
			conteudo: ModelsUtils.foreignKeyDataType({ allowNull: true }),
			comentario: ModelsUtils.foreignKeyDataType({ allowNull: true }),
		},
		{
			sequelize,
			schema: "public",
			timestamps: false,
			freezeTableName: true,
			indexes: [
				{
					name: "pk_revisao",
					unique: true,
					fields: [{ name: "id" }],
				},
			],
		}
	);
}
