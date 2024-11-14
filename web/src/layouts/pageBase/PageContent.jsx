import { Breadcrumb } from "./Breadcrumb";

export function PageContent({ children }) {
	return (
		<>
			<Breadcrumb />
			<section id="PageContent" className="container">
				{children}
			</section>
		</>
	);
}
