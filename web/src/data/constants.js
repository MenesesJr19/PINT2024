import { getSizes } from "./cssVars";
import Logo from "../assets/images/logo.png";

export const STATUS = {
	ERRO: 0,
	SUCESSO: 1,
	SEM_DATA: -1,
};

export const PROJETO_NAME = "The SoftShares";

export const PROJETO_LOGO = Logo;

export const GOSTO_ANIMATION = "animation-bounce";

export const AUTH_KEY = "token";

export const DRAWER_STATE_KEY = "drawerState";

export const PLACEHOLDER_TEXT =
	"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).";

export const PLACEHOLDER_TITLE = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";

export const API_URL = process.env.REACT_APP_USE_CLOUD_URL === "true" ? process.env.REACT_APP_CLOUD_API_URL : process.env.REACT_APP_LOCAL_API_URL;

export const POSTS_TO_RENDER = 20;

export const HEADER_VH = getSizes("HEADER_VH");

export const FOOTER_VH = getSizes("FOOTER_VH");

export const SEND_MESSAGE_DELAY = 200;

export const COMBOBOX_DEFAULT_VALUE = 0;

export const DRAWER_OPEN_WIDTH = 60;

export const DRAWER_CLOSE_WIDTH = 270;

export const MAP_CENTER_COORDS = [40.657283, -7.914133];

export const INATIVO_DELAY_TO_LOGOUT = 2000;
