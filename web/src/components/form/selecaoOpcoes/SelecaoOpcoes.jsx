import { Texto, CheckBox } from "components/index";
import { Utils } from "utils/utils";

export function SelecaoOpcoes({ evento, options }) {
	if (Utils.isEmpty(options)) return;
	return (
		<>
			<Texto>{evento}</Texto>
			<ul>
				{options?.map((option) => (
					<>
						<CheckBox key={option.id} label={option.option} />
					</>
				))}
			</ul>
		</>
	);
};
