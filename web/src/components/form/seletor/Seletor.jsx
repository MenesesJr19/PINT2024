import React from "react";
import { Switch, FormControlLabel } from "@mui/material";

export function Seletor({ label, handleChange, value }) {
	return (
		<FormControlLabel
			control={<Switch checked={value} onChange={(e) => handleChange(e.target.checked)} color="primary" />}
			label={label}
		/>
	);
}
