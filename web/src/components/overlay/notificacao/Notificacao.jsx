import { toast } from "react-toastify";
import "./notificacao.css";

export function Notificacao(text, tipo = "success") {
	toast[tipo](text, {
		position: "top-right",
		autoClose: 2000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: false,
		draggable: true,
		progress: undefined,
		theme: "light",
	});
}
