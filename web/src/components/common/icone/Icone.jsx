import PropTypes from "prop-types";
import * as Icons from "react-bootstrap-icons";

Icone.propTypes = {
	iconName: PropTypes.string.isRequired,
};

export function Icone({ iconName, size = 1, type = "primary", className = "", ...props }) {
	let IconVariant = null;
	try {
		IconVariant = Icons[iconName];
	} catch (e) {
		throw new Error(iconName);
	}
	const validSizes = [0, 1, 2, 3, 4, 5];
	const isSizeValid = validSizes.includes(size) ? true : false;

	return (
		<>
			{IconVariant && isSizeValid ? (
				<IconVariant className={`icone text-size-${size} text-types-${type} ${className}`} {...props} />
			) : (
				<h1>Icon invalido</h1>
			)}
		</>
	);
}
