import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Texto } from "components";
import { COMMON_SIZES, COMMON_TYPES } from "data/data";
import { Autocomplete, TextField, FormControl, FormHelperText, Paper } from "@mui/material";

ComboBox.propTypes = {
	label: PropTypes.string,
	options: PropTypes.array.isRequired,
	handleChange: PropTypes.func,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	disabled: PropTypes.bool,
	placeholder: PropTypes.string,
	isInvalid: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
	className: PropTypes.string,
};

export function ComboBox({
	label,
	options,
	handleChange,
	isInvalid,
	className,
	value: propValue = null,
	disabled = false,
	placeholder = "-",
}) {
	const [value, setValue] = useState(null);

	useEffect(() => {
		const matchedOption = options.find((option) => option.value === propValue) || null;
		setValue(matchedOption);
	}, [propValue, options]);

	const handleSelectChange = (event, newValue) => {
		setValue(newValue);
		if (typeof handleChange === "function") {
			handleChange(newValue?.value);
		}
	};

	const defaultProps = {
		options: options,
		getOptionLabel: (option) => option.label || "",
	};

	return (
		<FormControl fullWidth className={className} error={!!isInvalid} disabled={disabled}>
			<Autocomplete
				{...defaultProps}
				clearOnEscape
				disableClearable
				value={value}
				onChange={handleSelectChange}
				isOptionEqualToValue={(option, value) => option.value === value?.value}
				PaperComponent={(props) => (
					<Paper
						{...props}
						style={{
							...props.style,
							position: "fixed",
							top: `${props.anchorEl?.getBoundingClientRect().bottom}px`,
							left: `${props.anchorEl?.getBoundingClientRect().left}px`,
							width: `${props.anchorEl?.offsetWidth}px`,
							overflow: "auto",
						}}
					/>
				)}
				renderInput={(params) => (
					<TextField {...params} label={label} variant="standard" placeholder={placeholder} error={!!isInvalid} />
				)}
			/>
			{isInvalid ? (
				<FormHelperText>
					<Texto size={COMMON_SIZES.FS0} type={COMMON_TYPES.PERIGO}>
						{isInvalid}
					</Texto>
				</FormHelperText>
			) : null}
		</FormControl>
	);
}
