import React from "react";
import { Rating } from "@mui/material";
import { Icone } from "components";

export function Classificacao({ value, handleChange }) {
	return (
		<div className="remove-user-select">
			<Rating
				name="customized-rating"
				value={value}
				onChange={(event, newValue) => {
					handleChange(newValue);
				}}
				icon={<Icone iconName="StarFill" style={{ color: "gold", fontSize: "25px" }} />}
				emptyIcon={<Icone iconName="StarFill" style={{ color: "gray", fontSize: "25px" }} />}
				max={5}
			/>
		</div>
	);
}
