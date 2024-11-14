import { ModelsUtils } from "../utils/index.js";
export default function (sequelize, DataTypes) {
	return sequelize.define(
		"subtopico",
		{
			id: ModelsUtils.primaryKeyDataType(),
			data_criacao: ModelsUtils.dataCriacaoDataType(),
			area: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			topico: ModelsUtils.foreignKeyDataType(),
		},
		{
			sequelize,
			schema: "public",
			timestamps: false,
			freezeTableName: true,
			indexes: [
				{
					name: "pk_subtopico",
					unique: true,
					fields: [{ name: "id" }],
				},
			],
		}
	);
};
