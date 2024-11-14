import React, { useState } from "react";

export function TimePicker() {
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");

	const handleStartTimeChange = (e) => {
		setStartTime(e.target.value);
	};

	const handleEndTimeChange = (e) => {
		setEndTime(e.target.value);
	};

	return (
		<div>
			<input
				type="time"
				id="startTimePicker"
				value={startTime}
				onChange={handleStartTimeChange}
				className="form-control"
			/>
		</div>
	);
}
