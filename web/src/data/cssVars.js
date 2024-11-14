const rootStyles = getComputedStyle(document.documentElement);

export const getColor = (colorCode) => {
	const colorValue = rootStyles.getPropertyValue('--' + colorCode).trim();
	return colorValue !== undefined ? colorValue : null;
};

export const getSizes = (sizeCode) => {
	const sizeValue = rootStyles.getPropertyValue('--' + sizeCode).trim();
	return sizeValue !== undefined ? sizeValue : null;
};