import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./dropdown.css";
import { Texto } from "components/index";

export function Dropdown({ items, children }) {
	const menuDropdownRef = useRef(null);
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (menuDropdownRef.current && !menuDropdownRef.current.contains(event.target)) setIsOpen(false);
		};

		const handleKeyPress = (event) => {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		};

		window.addEventListener("mouseup", handleOutsideClick);
		window.addEventListener("keydown", handleKeyPress);

		return () => {
			window.removeEventListener("mouseup", handleOutsideClick);
			window.removeEventListener("keydown", handleKeyPress);
		};
	});

	return (
		<div id="Dropdown" className="dropdown c-dropdown" onClick={toggleDropdown} ref={menuDropdownRef}>
			<div className="cursor-pointer">{children}</div>
			{isOpen && (
				<div className="c-dropdown-content">
					{items &&
						items.map((item, index) => (
							<div className="c-dropdown-item">
								<Link to={item.rota} key={index} onClick={item.onclick && (() => item.onclick())}>
									<Texto className="c-dropdown-text">{item.nome}</Texto>
								</Link>
							</div>
						))}
				</div>
			)}
		</div>
	);
}
