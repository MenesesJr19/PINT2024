import { ModelsUtils } from "../utils/index.js";
export default function (sequelize, DataTypes) {
	return sequelize.define(
		"conteudo",
		{
			id: ModelsUtils.primaryKeyDataType(),
			data_criacao: ModelsUtils.dataCriacaoDataType(),
			titulo: {
				type: DataTypes.STRING(200),
				allowNull: false,
			},
			descricao: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			imagem: {
				type: DataTypes.STRING(500),
				allowNull: false,
			},
			endereco: {
				type: DataTypes.STRING(500),
				allowNull: false,
			},
			latitude: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			longitude: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			utilizador: ModelsUtils.foreignKeyDataType(),
			subtopico: ModelsUtils.foreignKeyDataType(),
			data_evento: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			preco: {
                type: DataTypes.DECIMAL,
                allowNull: true,
            },
			classificacao: {
                type: DataTypes.SMALLINT,
                allowNull: true,
            },
			tipo: ModelsUtils.foreignKeyDataType(),
		},
		{
			sequelize,
			schema: "public",
			timestamps: false,
			freezeTableName: true,
			indexes: [
				{
					name: "pk_conteudo",
					unique: true,
					fields: [{ name: "id" }],
				},
			],
		}
	);
}
