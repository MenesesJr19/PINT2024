import { ResponseService } from "../services/response.service.js";

export const ErrorMiddleware = (err, req, res, next) => {
	console.log("ErrorMiddleware");
	return ResponseService.error(res, err.message);
};
