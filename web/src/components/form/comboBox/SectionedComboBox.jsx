import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Autocomplete, TextField, FormControl, FormHelperText, ListSubheader } from "@mui/material";

SectionedComboBox.propTypes = {
	label: PropTypes.string,
	options: PropTypes.array.isRequired, // Ex: [{ section: "Group 1", options: [{ value: 1, label: "Option 1" }] }]
	handleChange: PropTypes.func,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	disabled: PropTypes.bool,
	placeholder: PropTypes.string,
	isInvalid: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
	className: PropTypes.string,
};

export function SectionedComboBox({
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
		const matchedOption =
			options.flatMap((section) => section.options).find((option) => option.value === propValue) || null;
		setValue(matchedOption);
	}, [propValue, options]);

	const handleSelectChange = (event, newValue) => {
		setValue(newValue);
		if (typeof handleChange === "function") {
			handleChange(newValue?.value);
		}
	};

	const defaultProps = {
		options: options.flatMap((section) => section.options),
		getOptionLabel: (option) => option.label || "",
		groupBy: (option) => {
			const section = options.find((section) => section.options.includes(option));
			return section ? section.section : "";
		},
		renderGroup: (params) => [<ListSubheader key={params.key}>{params.group}</ListSubheader>, params.children],
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
				renderInput={(params) => (
					<TextField {...params} label={label} variant="standard" placeholder={placeholder} error={!!isInvalid} />
				)}
			/>
			{isInvalid ? <FormHelperText>{isInvalid}</FormHelperText> : null}
		</FormControl>
	);
}
