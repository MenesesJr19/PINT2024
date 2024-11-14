import React, { useState } from "react";

export function FileBox({ title, handleChange, value: propValue = "", disabled = false, placeholder = "" }) {
	const [value, setValue] = useState(propValue);

	const handleFileChange = (e) => {
		setValue(e.target.files[0]);
		if (typeof handleChange === "function") {
			handleChange(e);
		}
	};

	return (
		<div className="FileBox">
			{title && <label htmlFor="fileInput">{title}</label>}
			<div className="input-group">
				<input type="file" className="form-control" id="fileInput" onChange={handleFileChange} disabled={disabled} />
				<label htmlFor="fileInput" className="input-group-text">
					{value.name || placeholder}
				</label>
			</div>
		</div>
	);
}
