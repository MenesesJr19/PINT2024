import { COMMON_SIZES, COMMON_TYPES } from "data/data";
import { Texto } from "../texto/Texto";
import "./rotulo.css";

export function Rotulo({ info, backgroundColor, textColor = COMMON_TYPES.INVERSO }) {
	const style = {
		"--rotulo-background": backgroundColor,
		"--rotulo-color": textColor,
	};

	return (
		info && (
			<div className="rotulo" style={style}>
				<Texto size={COMMON_SIZES.FS0} type={textColor} className="rotulo-texto">
					{info}
				</Texto>
			</div>
		)
	);
}
