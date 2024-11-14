export function Form({ children, ...props }) {
	return (
		<form {...props}>
			{children}
		</form>
	);
}