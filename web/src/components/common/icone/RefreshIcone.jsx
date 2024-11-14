import { Icone } from "components";

export function RefreshIcone({ handleRefresh }) {
	return <Icone iconName="ArrowClockwise" size={5} className="icon-hover" onClick={() => handleRefresh()} />;
}
