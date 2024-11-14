export function Row({ children, className, ...props }) {
	return (
		<div className={`d-flex align-items-center ${className}`} {...props}>
			{children}
		</div>
	);
}
