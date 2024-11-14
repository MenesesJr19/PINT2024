import React from "react";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const MeuTooltipPersonalizado = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
	({ theme }) => ({
		[`& .MuiTooltip-tooltip`]: {
			backgroundColor: "#ffffff",
			color: "#000000", 
			borderRadius: "4px", 
			boxShadow: theme.shadows[1],
		},
		[`& .MuiTooltip-arrow`]: {
			color: "#ffffff",
		},
	})
);

export function Tooltips({ trigger, children }) {
	return (
		<MeuTooltipPersonalizado title={trigger} arrow>
			<span>{children}</span>
		</MeuTooltipPersonalizado>
	);
}
