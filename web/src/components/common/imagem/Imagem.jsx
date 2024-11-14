export function Imagem({ src = "", alt = "", ...props }) {
	return (
		<>
			<img alt={alt} src={src} {...props} />
		</>
	);
}
