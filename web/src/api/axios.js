import axios from "axios";
import { API_URL } from "data/constants";
import { AuthTokenUtils } from "utils/authToken.utils";

const api = axios.create({
	baseURL: API_URL,
});

api.interceptors.request.use(
	(config) => {
		const token = AuthTokenUtils.get();
		if (token) config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export async function myAxios({ url, method = "get", data = null, token = "", headers = {} }) {
	try {
		const response = await api.request({
			url,
			method,
			headers: {
				...headers,
				...(token && { Authorization: `Bearer ${token}` }),
			},
			data,
		});
		return response.data.data;
	} catch (error) {
		const status = error.response.status;
		if (status === 401) {
			return { status: status, ...error.response.data };
		} else if (status === 422) {
			return { status: status, ...error.response.data };
		}
		if (error.response) {
			console.error(
				`Erro na resposta do servidor: ${error.response.status} - ${error.response.data.message || error.message}`
			);
		} else if (error.request) {
			console.error(`Erro na requisição: Sem resposta do servidor. ${error.message}`);
		} else {
			console.error(`Erro na configuração da requisição: ${error.message}`);
		}
	}
}
