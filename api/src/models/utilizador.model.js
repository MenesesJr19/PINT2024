import bcrypt from "bcrypt";
import { ModelsUtils, Utils } from "../utils/index.js";
export default function (sequelize, DataTypes) {
	const Models = sequelize.define(
		"utilizador",
		{
			id: ModelsUtils.primaryKeyDataType(),
			data_criacao: ModelsUtils.dataCriacaoDataType(),
			tag: {
				type: DataTypes.STRING(21),
				allowNull: true,
				unique: "utilizador_tag_key",
			},
			nome: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			sobrenome: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING(100),
				allowNull: false,
				unique: "utilizador_email_key",
			},
			senha: {
				type: DataTypes.STRING(500),
				allowNull: false,
				set(value) {
					const hashedPassword = bcrypt.hashSync(value, 10);
					this.setDataValue("senha", hashedPassword);
				},
			},
			verificado: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			inativo: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			imagem: {
				type: DataTypes.STRING(500),
				allowNull: true,
			},
			linkedin: {
				type: DataTypes.STRING(500),
				allowNull: true,
			},
			instagram: {
				type: DataTypes.STRING(500),
				allowNull: true,
			},
			facebook: {
				type: DataTypes.STRING(500),
				allowNull: true,
			},
			perfil: ModelsUtils.foreignKeyDataType({ defaultValue: 2 }),
			centro: ModelsUtils.foreignKeyDataType({ allowNull: true }),
		},
		{
			sequelize,
			schema: "public",
			timestamps: false,
			freezeTableName: true,
			indexes: [
				{
					name: "pk_utilizador",
					unique: true,
					fields: [{ name: "id" }],
				},
			],
		}
	);

	Models.beforeCreate(async (user, options) => {
		const tagDefault = Utils.tagDefault(user.nome, user.sobrenome);
		let tag = tagDefault;
		let encontrou = false;
		while (!encontrou) {
			const tagResponse = await Models.findOne({ where: { tag } });
			if (tagResponse) {
				const randomSuffix = Utils.random(0, 10000).toString();
				tag = tagDefault.slice(0, 21 - randomSuffix.length) + randomSuffix;
			} else {
				encontrou = true;
			}
		}
		user.tag = tag;
	});

	return Models;
}
