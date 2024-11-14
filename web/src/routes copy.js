import React from "react";
import { NotFound } from "layouts/errors/NotFound";
import { Calendario } from "pages/calendario";
import { IniciarSessao } from "pages/autenticacao";
import { ConteudoCriar } from "pages/conteudo";
import { Conta } from "pages/conta/Conta";
import { PaginaInicial } from "pages/PaginaInicial";
import { ConteudoDetalhe } from "pages/conteudo/detalhe/ConteudoDetalhe";
import { ContaEditar } from "pages/conta/editar/ContaEditar";
import { ConteudoPainel } from "pages/backoffice/conteudo/ConteudoPainel";
import { ComentarioPainel } from "pages/backoffice/comentario/ComentarioPainel";
import { UtilizadorPainel } from "pages/backoffice/utilizador/UtilizadorPainel";
import { TopicosPainel } from "pages/backoffice/topicos/TopicosPainel";
import { CentroPainel } from "pages/backoffice/centros/CentroPainel";
import { EsqueceuPasse } from "pages/autenticacao/esqueceuPasse/EsqueceuPasse";
import { ResetarPasse } from "pages/autenticacao/resetPasse/ResetarPasse";
import { Sobre } from "pages/sobre/Sobre";
import { RoutesUtils } from "utils/routes.utils";
import { EnumConstants } from "data/enum.constants";
import { Estatisticas } from "pages/backoffice/estatisticas/Estatisticas";
import { AtualizarPasse } from "pages/autenticacao/atualizarPasse/AtualizarPasse";
import { TerminarSessao } from "pages/autenticacao/terminarSessao/TerminarSessao";
import { Navigate } from "react-router-dom";
import { DenunciaPainel } from "pages/backoffice/denuncia/DenunciaPainel";
import { Mapa } from "pages/mapa/Mapa";

const ROLES = EnumConstants.ROLES;

export class Rotas {
	static InicialRoutes = [
		{
			title: "Página Inicial",
			section: "Página Inicial",
			path: "/",
			element: <PaginaInicial />,
			perfis: [ROLES.USER.ID],
		},
	];

	static ConteudoRoutes = [
		{
			title: "Conteudos",
			section: "Conteudos",
			path: "/conteudos",
			element: <Navigate to="/" />,
			perfis: [ROLES.USER.ID],
			children: [
				{
					title: "Criar",
					section: "Conteudos",
					path: "/criar/:id",
					element: <ConteudoCriar />,
					perfis: [ROLES.USER.ID],
				},
				{
					title: "Detalhe",
					section: "Conteudos",
					path: "/:id",
					element: <ConteudoDetalhe />,
					perfis: [ROLES.USER.ID],
				},
			],
		},
	];

	static CalendarioRoutes = [
		{
			title: "Mapa",
			section: "Mapa",
			path: "/mapa",
			element: <Mapa />,
			perfis: [ROLES.ADMIN.ID],
		},
		{
			title: "Calendário",
			section: "Calendário",
			path: "/calendario",
			element: <Calendario />,
			perfis: [ROLES.USER.ID],
		},
	];

	static UtilizadorRoutes = [
		{
			title: "Conta",
			section: "Conta",
			path: "/conta/:id",
			element: <Conta />,
			perfis: [ROLES.USER.ID],
			children: [
				{
					title: "Editar",
					section: "Conta",
					path: "/editar",
					element: <ContaEditar />,
					perfis: [ROLES.USER.ID],
				},
			],
		},
	];

	static SobreRoutes = [
		{
			title: "Sobre",
			section: "Sobre",
			path: "/sobre",
			element: <Sobre />,
			perfis: [],
		},
	];

	static AutenticacaoRoutes = [
		{
			title: "Iniciar Sessão",
			section: "Iniciar Sessão",
			path: "/iniciar-sessao",
			element: <IniciarSessao />,
			perfis: [],
		},
		{
			title: "Atualizar Palavra-passe",
			section: "Atualizar Palavra-passe",
			path: "/atualizar-passe/:token",
			element: <AtualizarPasse />,
			perfis: [],
		},
		{
			title: "Esqueceu-se da Palavra-passe",
			section: "Esqueceu-se da Palavra-passe",
			path: "/esqueceu-passe",
			element: <EsqueceuPasse />,
			perfis: [],
		},
		{
			title: "Resetar a Palavra-passe",
			section: "Resetar a Palavra-passe",
			path: "/resetar-passe",
			element: <ResetarPasse />,
			perfis: [],
		},
		{
			title: "Terminar Sessão",
			section: "Terminar Sessão",
			path: "/terminar-sessao",
			element: <TerminarSessao />,
			perfis: [],
		},
	];

	static ErrosRoutes = [
		{
			title: "Não encontrado",
			section: "Não encontrado ",
			path: "*",
			element: <NotFound />,
			perfis: [],
		},
	];

	static AuthenticationRoutes = [...this.AutenticacaoRoutes];

	static FrontofficeRoutes = [
		...this.InicialRoutes,
		...this.ConteudoRoutes,
		...this.CalendarioRoutes,
		...this.UtilizadorRoutes,
		...this.SobreRoutes,
		...this.ErrosRoutes,
	];

	static BackofficeRoutes = [
		{
			title: "Backoffice",
			section: "Backoffice",
			path: "/backoffice",
			element: <Navigate to={"/backoffice/utilizadores"} />,
			perfis: [0],
			children: [
				{
					title: "Utilizador",
					section: "Utilizador",
					path: "/utilizadores",
					element: <UtilizadorPainel />,
					perfis: [0],
				},
				{
					title: "Centro",
					section: "Centro",
					path: "/centros",
					element: <CentroPainel />,
					perfis: [0],
				},
				{
					title: "Tópicos",
					section: "Tópicos",
					path: "/topicos",
					element: <TopicosPainel />,
					perfis: [0],
				},
				{
					title: "Estatísticas",
					section: "Estatísticas",
					path: "/estatisticas",
					element: <Estatisticas />,
					perfis: [0],
				},
				{
					title: "Conteudo",
					section: "Conteudo",
					path: "/conteudos",
					element: <ConteudoPainel />,
					perfis: [0],
				},
				{
					title: "Comentário",
					section: "Comentário",
					path: "/comentarios",
					element: <ComentarioPainel />,
					perfis: [0],
				},
				{
					title: "Denuncias",
					section: "Denuncias",
					path: "/denuncias",
					element: <DenunciaPainel />,
					perfis: [0],
				},
			],
		},
	];

	static RenderRoutes(user_role) {
		const routesUtils = new RoutesUtils(user_role);
		return routesUtils.criarRoutes([...this.FrontofficeRoutes]);
	}

	static RenderBackofficeRoutes(user_role) {
		const routesUtils = new RoutesUtils(user_role);
		return routesUtils.criarRoutes([...this.BackofficeRoutes]);
	}

	static RenderAuthenticationRoutes() {
		const routesUtils = new RoutesUtils();
		return routesUtils.criarRoutes([...this.AuthenticationRoutes]);
	}
}
