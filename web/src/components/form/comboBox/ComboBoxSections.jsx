import { Texto } from "components";
import { COMMON_SIZES } from "data/data";
import React, { useEffect, useRef, useState } from "react";

export function ComboBoxSections({ handleChange, items, placeholder = "Escolha uma opção" }) {
	const [selectedItem, setSelectedItem] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const comboBoxRef = useRef(null);

	const handleSelect = (item) => {
		handleChange({id: item.id, label: item.label});
		setSelectedItem(item.label);
		setIsOpen(false);
	};

	const handleClickOutside = (event) => {
		if (comboBoxRef.current && !comboBoxRef.current.contains(event.target)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const styles = {
		combobox: {
			width: "250px",
			position: "relative",
		},
		selectedItem: {
			padding: "10px",
			border: "1px solid #ccc",
			borderRadius: "10px",
			cursor: "pointer",
			backgroundColor: "#fff",
		},
		options: {
			position: "absolute",
			width: "100%",
			border: "1px solid #ccc",
			borderRadius: "10px",
			backgroundColor: "#fff",
			zIndex: 1,
			marginTop: "2px",
			boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
			maxHeight: '300px',
            overflowY: 'auto'

		},
		section: {
			padding: "10px 0",
		},
		sectionTitle: {
			padding: "10px",
			fontWeight: "bold",
			borderBottom: "1px solid #eee",
		},
		option: {
			padding: "10px",
			cursor: "pointer",
		},
	};

	return (
		<div style={styles.combobox} ref={comboBoxRef}>
			<div style={styles.selectedItem} onClick={() => setIsOpen(!isOpen)}>
				{selectedItem || placeholder}
			</div>
			{isOpen && (
				<div style={styles.options}>
					{items.map((group, index) => (
						<div key={index} style={styles.section}>
							<div style={styles.sectionTitle}>
								<Texto size={COMMON_SIZES.FS2}>{group.section}</Texto>
							</div>
							{group.options.map((option, idx) => (
								<div key={idx} style={styles.option} onClick={() => handleSelect(option)}>
									<Texto>{option.label}</Texto>
								</div>
							))}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
