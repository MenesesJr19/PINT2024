import { Route, Navigate } from "react-router-dom";

import React from "react";
import { Rotas } from "routes";
import { Utils } from "./utils";
import { NotFound } from "layouts/errors/NotFound";

export class RoutesUtils {
	constructor(user_role) {
		this.user_role = user_role;
	}

	criarRoutes = (routes, parentRoute = "") => {
		return routes.map((route, index) => {
			const temAcesso = Utils.Perms(route.perfis, this.user_role);
			const element = temAcesso ? route.element : <Navigate to="/iniciar-sessao" />;

			return (
				<React.Fragment key={index}>
					<Route key={index} path={parentRoute + route.path} element={element} />
					{route.children && this.criarRoutes(route.children, parentRoute + route.path)}
				</React.Fragment>
			);
		});
	};

	static findRouteBySinglePath(path) {
		const pathnames = path?.split("/").filter((path) => path !== "");
		const breadcrumb = [];

		for (const path of pathnames) {
			const route = RoutesUtils.encontrarRota("/" + path);
			if (route) breadcrumb.push(route);
		}

		return breadcrumb;
	}

	static encontrarRota(pathCompleto) {
		// Função recursiva para encontrar a melhor rota
		const procurarMelhorRota = (rotas, path, basePath = "") => {
			let melhorRota = null;
			let maiorCorrespondencia = 0;

			rotas.forEach((rota) => {
				if (rota.path !== "*") {
					let caminhoAtual = `${basePath}${rota.path}`;

					// Substituir parâmetros dinâmicos com expressões regulares
					if (caminhoAtual) {
						caminhoAtual = caminhoAtual.replace(/:\w+/g, "[^/]+");
					}

					const regexPath = new RegExp(`^${caminhoAtual}$`);

					// Verificar correspondência
					if (regexPath.test(path)) {
						const correspondencia = caminhoAtual.length;
						if (correspondencia > maiorCorrespondencia) {
							melhorRota = rota;
							maiorCorrespondencia = correspondencia;
						}
					}

					// Verificar rotas filhas
					if (rota.children) {
						const rotaFilha = procurarMelhorRota(rota.children, path, `${caminhoAtual}/`);
						if (rotaFilha && rotaFilha.correspondencia > maiorCorrespondencia) {
							melhorRota = rotaFilha.rota;
							maiorCorrespondencia = rotaFilha.correspondencia;
						}
					}
				}
			});

			return { rota: melhorRota, correspondencia: maiorCorrespondencia };
		};

		const resultado = procurarMelhorRota([...Rotas.MainRoutes, ...Rotas.AuthRoutes], pathCompleto);
		return resultado.rota;
	}

	static findRouteByPath(path) {
		const findRecursive = (routes, currentPath) => {
			for (const route of routes) {
				let tempPath = route.path.split("/:")[0];
				if (route.path === currentPath || tempPath === currentPath) {
					return route;
				} else if (route.children) {
					const childRoute = findRecursive(route.children, currentPath);
					if (childRoute) {
						return childRoute;
					}
				}
			}
			return null;
		};

		return findRecursive([Rotas.Routes], path);
	}
}
