import { Icone, Imagem, Botao } from "components/index";
import React, { useEffect, useState } from "react";

import "./image-slider.css";
import { BUTTON_VARIANTS } from "data/data";
import { ImagemModal } from "components/overlay/imagemModal/ImagemModal";

export function ImageSlider({ images }) {
	const [imagesArray, setimagesArray] = useState([]);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	useEffect(() => {
		setimagesArray(images);
	}, []);

	const nextSlide = () => {
		const newIndex = (currentImageIndex + 1) % imagesArray.length;
		setCurrentImageIndex(newIndex);
	};

	const prevSlide = () => {
		const newIndex = (currentImageIndex - 1 + imagesArray.length) % imagesArray.length;
		setCurrentImageIndex(newIndex);
	};

	const openSlide = () => {};

	const changeSlide = (index) => {
		const newIndex = index;
		setCurrentImageIndex(newIndex);
	};

	return (
		<article className="remove-user-select">
			<div className="image-slider d-flex">
				<Botao variant={BUTTON_VARIANTS.SECUNDARIO} onClick={prevSlide}>
					&lt;
				</Botao>
				{imagesArray.map((image, index) => (
					<div key={index} onClick={openSlide} style={{ display: index === currentImageIndex ? "flex" : "none" }}>
						<ImagemModal imagemSelecionada={image}>
							<Imagem src={image} className="image-slider-image" />
						</ImagemModal>
					</div>
				))}
				<Botao variant={BUTTON_VARIANTS.SECUNDARIO} onClick={nextSlide}>
					&gt;
				</Botao>
			</div>
			<div className="gap-3 d-flex align-items-center">
				{imagesArray.map((_, index) => (
					<Icone
						key={index}
						className="cursor-pointer"
						iconName={`${index === currentImageIndex ? "Circle" : "CircleFill"}`}
						onClick={() => changeSlide(index)}
					/>
				))}
			</div>
		</article>
	);
}
