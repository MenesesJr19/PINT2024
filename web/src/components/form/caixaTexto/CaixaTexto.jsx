import { Texto } from "components";
import { COMMON_SIZES, COMMON_TYPES } from "data/data";
import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

export function CaixaTexto({
	label = "",
	prefix = false,
	value,
	className,
	onKeyUp,
	isInvalid = false,
	handleChange,
	handleSubmit,
	isInversed = false,
	...props
}) {
	const handleSubmitEvent = (e) => {
		if (e.key === "Enter" && typeof handleSubmit === "function") {
			handleSubmit(e);
		}
	};

	return (
		<div className={className}>
			<TextField
				id="standard-basic"
				label={label}
				value={value}
				onChange={(e) => handleChange(e)}
				onKeyUp={onKeyUp ? (e) => onKeyUp(e) : (e) => handleSubmitEvent(e)}
				error={!!isInvalid}
				helperText={
					isInvalid ? (
						<Texto size={COMMON_SIZES.FS0} type={COMMON_TYPES.PERIGO}>
							{isInvalid}
						</Texto>
					) : null
				}
				InputProps={{
					startAdornment: prefix ? <InputAdornment position="start">{prefix}</InputAdornment> : null,
				}}
				fullWidth
				variant="standard"
				disabled={false}
				{...props}
				sx={
					isInversed
						? {
								input: { color: "white" },
								label: { color: "white" },
								"& .MuiInput-underline:before": {
									borderBottomColor: "white",
								},
								"& .MuiInput-underline:hover:before": {
									borderBottomColor: "white",
								},
								"& .MuiInput-underline:after": {
									borderBottomColor: "white",
								},
						  }
						: {}
				}
			/>
		</div>
	);
}
