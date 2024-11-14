import { ModelsUtils } from "../utils/index.js";
export default function (sequelize, DataTypes) {
	return sequelize.define(
		"denuncia",
		{
			id: ModelsUtils.primaryKeyDataType(),
			data_criacao: ModelsUtils.dataCriacaoDataType(),
			motivo: {
				type: DataTypes.STRING(200),
				allowNull: false,
			},
			estado: ModelsUtils.foreignKeyDataType({ defaultValue: 1 }),
			comentario: ModelsUtils.foreignKeyDataType(),
			utilizador: ModelsUtils.foreignKeyDataType(),
		},
		{
			sequelize,
			schema: "public",
			timestamps: false,
			freezeTableName: true,
			indexes: [
				{
					name: "pk_denuncia",
					unique: true,
					fields: [{ name: "id" }],
				},
			],
		}
	);
}
