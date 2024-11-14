export function Texto({ className = "", style = "", size = 1, type = "primary", children }) {
	return (
		<p className={`text-size-${size} text-types-${type} remove-margin ${className}`} style={{ ...style }}>
			{children}
		</p>
	);
}
