export class ControllersUtils { 
	static modelsDirectlyAssociated = (model) => {
		const modelsObject = [];
		Object.keys(model.associations).forEach((key) => {
			const association = model.associations[key];
			modelsObject.push({ model: association.target, as: association.as });
		});
		return Object.values(modelsObject);
	};
}