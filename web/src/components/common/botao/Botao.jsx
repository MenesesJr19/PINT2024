import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { Texto } from "components/index";
import { COMMON_SIZES } from "data/data";
import "./botao.css";

export function Botao({ variant = "primario", type = "", route = null, className, children, ...props }) {
	const validVariants = ["primario", "secundario", "sucesso", "perigo", "transparente"];
	const isVariantValid = validVariants.includes(variant);

	const variantColorMap = {
		primario: "primary",
		secundario: "secondary",
		sucesso: "success",
		perigo: "error",
		transparente: "default",
	};

	const buttonClasses = `botao-${variant} d-flex gap-2 align-items-center ${className}`;

	const renderBotao = () => (
		<Button
			type={type || "button"}
			variant="contained"
			color={variantColorMap[variant] || "default"}
			className={buttonClasses}
			sx={{ textTransform: "none" }}
			{...props}
		>
			{children}
		</Button>
	);

	return (
		<>
			{isVariantValid ? (
				route ? (
					<Button
						component={Link}
						to={route}
						type={type || "button"}
						variant="contained"
						color={variantColorMap[variant] || "default"}
						className={buttonClasses}
						sx={{ textTransform: "none" }}
						{...props}
					>
						{children}
					</Button>
				) : (
					renderBotao()
				)
			) : (
				<Texto size={COMMON_SIZES.FS4}>Variante inválida</Texto>
			)}
		</>
	);
}
