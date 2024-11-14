import { Link } from "react-router-dom";

export function Navegar({className, to, children, ...props}) {
	return (
		<>
			<Link to={to} className={`text-types-link ${className}`} {...props}>
				{children}
			</Link>
		</>
	);
};