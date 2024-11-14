import { Icone } from "components";
import { useEffect, useRef } from "react";
import "./horizontal-scroll.css";
import { Row } from "components/ui/Row";

export function HorizontalScroll({ header, children }) {
	const cardsWrapperRef = useRef();
	const leftShadowRef = useRef();
	const rightShadowRef = useRef();

	const scrollLeft = () => {
		cardsWrapperRef.current.scrollLeft += -1200;
	};

	const scrollRight = () => {
		cardsWrapperRef.current.scrollLeft += 1200;
	};

	useEffect(() => {
		const cardsWrapper = cardsWrapperRef.current;
		const leftShadow = leftShadowRef.current;
		const rightShadow = rightShadowRef.current;

		const handleScroll = () => {
			const scrollLeft = cardsWrapper.scrollLeft;
			const maxScrollLeft = cardsWrapper.scrollWidth - cardsWrapper.clientWidth;

			if (maxScrollLeft <= 0) {
				leftShadow.classList.add("esconde-sombra");
				rightShadow.classList.remove("esconde-sombra");
				return;
			}

			if (scrollLeft === 0) {
				leftShadow.classList.add("esconde-sombra");
			} else {
				leftShadow.classList.remove("esconde-sombra");
			}

			if (scrollLeft >= maxScrollLeft) {
				rightShadow.classList.add("esconde-sombra");
			} else {
				rightShadow.classList.remove("esconde-sombra");
			}
		};

		cardsWrapper.addEventListener("scroll", handleScroll);
		handleScroll();

		return () => cardsWrapper.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		const scrollConteudo = cardsWrapperRef.current;

		const handleWheel = (event) => {
			const maxScrollLeft = scrollConteudo.scrollWidth - scrollConteudo.clientWidth;
			if (scrollConteudo.scrollLeft === maxScrollLeft && maxScrollLeft !== 0 && event.deltaY >= 0) return;
			if (scrollConteudo.scrollLeft === 0 && maxScrollLeft !== 0 && event.deltaY <= 0) return;
			event.preventDefault();
			scrollConteudo.scrollLeft += event.deltaY * 6;
		};

		scrollConteudo.addEventListener("wheel", handleWheel);

		return () => {
			scrollConteudo.removeEventListener("wheel", handleWheel);
		};
	}, []);

	return (
		<section className="horizontal-scroll remove-user-select">
			<div className="d-flex justify-content-between">
				<div>{header}</div>
				<div className="d-flex gap-2 mb-4">
					<div onClick={scrollLeft}>
						<Icone iconName="CaretLeftFill" className="h-scroll-icon" />
					</div>
					<div onClick={scrollRight}>
						<Icone iconName="CaretRightFill" className="h-scroll-icon" />
					</div>
				</div>
			</div>
			<div className="scrollConteudo">
				<div className="sombraEsquerda" ref={leftShadowRef}></div>
				<div className={"cardsWrapper remove-scroll"} ref={cardsWrapperRef}>
					<Row>{children}</Row>
				</div>
				<div className="sombraDireita" ref={rightShadowRef}></div>
			</div>
		</section>
	);
}
