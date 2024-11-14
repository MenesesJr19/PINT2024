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
import { EnumConstants } from "data/enum.constants";
import { Estatisticas } from "pages/backoffice/estatisticas/Estatisticas";
import { AtualizarPasse } from "pages/autenticacao/atualizarPasse/AtualizarPasse";
import { TerminarSessao } from "pages/autenticacao/terminarSessao/TerminarSessao";
import { Navigate } from "react-router-dom";
import { DenunciaPainel } from "pages/backoffice/denuncia/DenunciaPainel";
import { Mapa } from "pages/mapa/Mapa";
import { PageLayout } from "layouts/pageBase/PageLayout";
import { ProtectedRoute } from "components/helpers/ProtectedRoute";

const ROLES = EnumConstants.ROLES;

export class Rotas {
	static MainRoutes = [
		{
			title: "Página Inicial",
			section: "Página Inicial",
			path: "/",
			element: <ProtectedRoute element={<PaginaInicial />} requiredPermission={[ROLES.USER.ID]} />,
			perfis: [ROLES.USER.ID],
		},
		{
			title: "Conteudos",
			section: "Conteudos",
			path: "/conteudos",
			perfis: [ROLES.USER.ID],
			children: [
				{
					title: "Criar",
					section: "Conteudos",
					path: "criar/:id",
					element: <ProtectedRoute element={<ConteudoCriar />} requiredPermission={[ROLES.USER.ID]} />,
					perfis: [ROLES.USER.ID],
				},
				{
					title: "Detalhe",
					section: "Conteudos",
					path: ":id",
					element: <ProtectedRoute element={<ConteudoDetalhe />} requiredPermission={[ROLES.USER.ID]} />,
					perfis: [ROLES.USER.ID],
				},
			],
		},
		{
			title: "Mapa",
			section: "Mapa",
			path: "/mapa",
			perfis: [ROLES.USER.ID],
			children: [
				{
					title: "Mapa",
					section: "Mapa",
					path: "",
					element: <ProtectedRoute element={<Mapa />} requiredPermission={[ROLES.USER.ID]} />,
					perfis: [ROLES.USER.ID],
				},
				{
					title: "Mapa",
					section: "Mapa",
					path: ":id",
					element: <ProtectedRoute element={<Mapa />} requiredPermission={[ROLES.USER.ID]} />,
					perfis: [ROLES.USER.ID],
				},
			],
		},
		{
			title: "Calendário",
			section: "Calendário",
			path: "/calendario",
			element: <ProtectedRoute element={<Calendario />} requiredPermission={[ROLES.USER.ID]} />,
			perfis: [ROLES.USER.ID],
		},
		{
			title: "Conta",
			section: "Conta",
			path: "/conta",
			perfis: [ROLES.USER.ID],
			children: [
				{
					title: "Conta",
					section: "Conta",
					path: ":id",
					perfis: [ROLES.USER.ID],
					children: [
						{
							title: "Conta",
							section: "Conta",
							path: "",
							element: <ProtectedRoute element={<Conta />} requiredPermission={[ROLES.USER.ID]} />,
							perfis: [ROLES.USER.ID],
						},
						{
							title: "Editar",
							section: "Conta",
							path: "editar",
							element: <ProtectedRoute element={<ContaEditar />} requiredPermission={[ROLES.USER.ID]} />,
							perfis: [ROLES.USER.ID],
						},
					],
				},
			],
		},
		{
			title: "Não encontrado",
			section: "Não encontrado ",
			path: "*",
			element: <NotFound />,
			perfis: [],
		},
		{
			title: "Não encontrado",
			section: "Não encontrado ",
			path: "/not-found",
			element: <NotFound />,
			perfis: [],
		},
		{
			title: "Backoffice",
			section: "Backoffice",
			path: "/backoffice",
			perfis: [ROLES.ADMIN.ID],
			children: [
				{
					title: "Utilizador",
					section: "Utilizador",
					path: "utilizadores",
					element: <ProtectedRoute element={<UtilizadorPainel />} requiredPermission={[ROLES.ADMIN.ID]} />,
					perfis: [ROLES.ADMIN.ID],
				},
				{
					title: "Centro",
					section: "Centro",
					path: "centros",
					element: <ProtectedRoute element={<CentroPainel />} requiredPermission={[ROLES.ADMIN.ID]} />,
					perfis: [ROLES.ADMIN.ID],
				},
				{
					title: "Tópicos",
					section: "Tópicos",
					path: "topicos",
					element: <ProtectedRoute element={<TopicosPainel />} requiredPermission={[ROLES.ADMIN.ID]} />,
					perfis: [ROLES.ADMIN.ID],
				},
				{
					title: "Estatísticas",
					section: "Estatísticas",
					path: "estatisticas",
					element: <ProtectedRoute element={<Estatisticas />} requiredPermission={[ROLES.ADMIN.ID]} />,
					perfis: [ROLES.ADMIN.ID],
				},
				{
					title: "Conteudo",
					section: "Conteudo",
					path: "conteudos",
					element: <ProtectedRoute element={<ConteudoPainel />} requiredPermission={[ROLES.ADMIN.ID]} />,
					perfis: [ROLES.ADMIN.ID],
				},
				{
					title: "Comentário",
					section: "Comentário",
					path: "comentarios",
					element: <ProtectedRoute element={<ComentarioPainel />} requiredPermission={[ROLES.ADMIN.ID]} />,
					perfis: [ROLES.ADMIN.ID],
				},
				{
					title: "Denuncias",
					section: "Denuncias",
					path: "denuncias",
					element: <ProtectedRoute element={<DenunciaPainel />} requiredPermission={[ROLES.ADMIN.ID]} />,
					perfis: [ROLES.ADMIN.ID],
				},
			],
		},
		{
			title: "Terminar Sessão",
			section: "Terminar Sessão",
			path: "/terminar-sessao",
			element: <TerminarSessao />,
			perfis: [],
		},
	];

	static AuthRoutes = [
		{
			title: "Página Inicial",
			section: "Página Inicial",
			path: "/",
			element: <Navigate to={"iniciar-sessao"} />,
		},
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
	];

	static CommonRoutes = [
		{
			title: "Sobre",
			section: "Sobre",
			path: "/sobre",
			element: <Sobre />,
			perfis: [],
		},
	];

	static Routestwo = [
		{
			title: "Softshares",
			section: "Softshares",
			element: <PageLayout />,
			errorElement: <NotFound />,
			children: [...Rotas.AuthRoutes, ...Rotas.CommonRoutes],
		},
	];

	static Routes = [
		{
			title: "Softshares",
			section: "Softshares",
			element: <PageLayout />,
			errorElement: <NotFound />,
			children: [...Rotas.MainRoutes, ...Rotas.CommonRoutes],
		},
	];
}
