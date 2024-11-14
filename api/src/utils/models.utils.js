import { DataTypes, Sequelize } from "sequelize";
import { MissingParametersException } from "../exceptions/index.js";

export class ModelsUtils {
	static dataCriacaoDataType() {
		return { type: DataTypes.DATE, defaultValue: Sequelize.fn("now") };
	}

	static primaryKeyDataType() {
		return { autoIncrement: true, type: DataTypes.INTEGER, allowNull: false, primaryKey: true };
	}

	static foreignKeyDataType({ allowNull = false, defaultValue = null } = {}) {
		return { type: DataTypes.INTEGER, allowNull, defaultValue };
	}

	static defineAssociation(childModel, parentModel) {
		const asKeyword = childModel.name + "_" + parentModel.name;
		const foreignKeyKeyword = parentModel.name;

		childModel.belongsTo(parentModel, {
			as: asKeyword,
			foreignKey: foreignKeyKeyword,
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		});
		parentModel.hasMany(childModel, {
			as: asKeyword,
			foreignKey: foreignKeyKeyword,
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		});
	}

	static async validateModelData(model, data) {
		try {
			const model_build = model.build(data);
			await model_build.validate();
			return { isValid: true, errors: null };
		} catch (e) {
			throw new MissingParametersException(e.errors ? e.errors.map((error) => error.message) : [e.message]);
		}
	}

	/**
	 * Verifica se os dados no JSON já existem na base de dados.
	 * @param {Model} model - O modelo Sequelize a usar para a verificação.
	 * @param {Object} data - JSON com os dados a verificar.
	 * @returns {Promise<Boolean>} - True se os dados existirem, False caso contrário.
	 */
	static async checkExistence(model, data) {
		return await model.findOne({ where: data });
	}
}
