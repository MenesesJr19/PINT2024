import { Texto } from "components";
import { COMMON_SIZES, COMMON_TYPES } from "data/data";
import React, { useState } from "react";

export function DatePicker({ label, className, isInvalid = false, value, handleChange }) {
	return (
		<div className={`${className}`}>
			{label && <label htmlFor="inputImage">{label}</label>}

			<input
				type="datetime-local"
				value={value}
				onChange={(e) => handleChange(e)}
				className={`form-control ${isInvalid ? "form-is-invalid" : ""}`}
			/>
			{isInvalid ? (
				<Texto size={COMMON_SIZES.FS0} type={COMMON_TYPES.PERIGO}>
					{isInvalid}
				</Texto>
			) : null}
		</div>
	);
}
