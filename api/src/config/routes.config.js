import {
	AlbumController,
	AutenticacaoController,
	CentroController,
	ClassificacaoController,
	ComentarioController,
	ConteudoController,
	DenunciaController,
	EstadoController,
	InteresseController,
	NotificacaoController,
	ParticipanteController,
	PerfilController,
	RevisaoController,
	SubtopicoController,
	TipoController,
	TopicoController,
	UtilizadorController,
} from "../controllers/index.js";
import {
	AutenticacaoRoutes,
	BaseRoutes,
	UtilizadorRoutes,
	ConteudoRoutes,
	ParticipanteRoutes,
	ComentarioRoutes,
} from "../routes/index.js";
import { LogUtils } from "../utils/index.js";
import { models } from "./index.js";

export const RoutesConfig = async (app) => {
	app.use("/album", BaseRoutes(new AlbumController(models.album)));
	app.use("/autenticacao", AutenticacaoRoutes(new AutenticacaoController(models.utilizador)));
	app.use("/centro", BaseRoutes(new CentroController(models.centro)));
	app.use("/classificacao", BaseRoutes(new ClassificacaoController(models.classificacao)));
	app.use("/comentario", ComentarioRoutes(new ComentarioController(models.comentario)));
	app.use("/conteudo", ConteudoRoutes(new ConteudoController(models.conteudo)));
	app.use("/denuncia", BaseRoutes(new DenunciaController(models.denuncia)));
	app.use("/estado", BaseRoutes(new EstadoController(models.estado)));
	app.use("/interesse", BaseRoutes(new InteresseController(models.interesse)));
	app.use("/notificacao", BaseRoutes(new NotificacaoController(models.notificacao)));
	app.use("/participante", ParticipanteRoutes(new ParticipanteController(models.participante)));
	app.use("/perfil", BaseRoutes(new PerfilController(models.perfil)));
	app.use("/revisao", BaseRoutes(new RevisaoController(models.revisao)));
	app.use("/subtopico", BaseRoutes(new SubtopicoController(models.subtopico)));
	app.use("/tipo", BaseRoutes(new TipoController(models.tipo)));
	app.use("/topico", BaseRoutes(new TopicoController(models.topico)));
	app.use("/utilizador", UtilizadorRoutes(new UtilizadorController(models.utilizador)));

	LogUtils.log("Routes inicializados!", LogUtils.TIPO.ROUTES);
};
