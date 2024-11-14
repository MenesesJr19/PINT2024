import { EnumConstants } from "./enum.constants";
import { Authorizor } from "components/helpers/Authorizor";
import { Item } from "layouts/drawer/Drawer";

const ROLES = EnumConstants.ROLES;

export class NavItems {
	static Items = [
		{
			route: "/",
			icone: "HouseFill",
			label: "Inicial",
			perfis: [ROLES.USER.ID],
		},
		{
			route: "/calendario",
			icone: "CalendarFill",
			label: "Calendário",
			perfis: [ROLES.USER.ID],
		},
		{
			route: "/mapa",
			icone: "MapFill",
			label: "Mapa",
			perfis: [ROLES.USER.ID],
		},
		{
			route: "/backoffice/utilizadores",
			icone: "PeopleFill",
			label: "Utilizadores",
			perfis: [ROLES.ADMIN.ID],
		},
		{
			route: "/backoffice/conteudos",
			icone: "CollectionPlayFill",
			label: "Conteudos",
			perfis: [ROLES.ADMIN.ID],
		},
		{
			route: "/backoffice/comentarios",
			icone: "ChatLeftTextFill",
			label: "Comentarios",
			perfis: [ROLES.ADMIN.ID],
		},
		{
			route: "/backoffice/denuncias",
			icone: "ShieldSlashFill",
			label: "Denuncias",
			perfis: [ROLES.ADMIN.ID],
		},
		{
			route: "/backoffice/topicos",
			icone: "FileTextFill",
			label: "Tópicos",
			perfis: [ROLES.ADMIN.ID],
		},
		{
			route: "/backoffice/centros",
			icone: "BuildingsFill",
			label: "Centros",
			perfis: [ROLES.ADMIN.ID],
		},
		{
			route: "/backoffice/estatisticas",
			icone: "GraphUp",
			label: "Estatísticas",
			perfis: [ROLES.ADMIN.ID],
		},
		{
			route: "/sobre",
			icone: "InfoCircleFill",
			label: "Sobre",
			perfis: [],
		},
	];

	static Render() {
		return NavItems.Items.map((item, index) => {
			if (item.perfis.length === 0) {
				return <Item key={index} route={item.route} icone={item.icone} label={item.label} />;
			} else {
				return (
					<Authorizor key={index} requiredPermission={item.perfis[0]}>
						<Item route={item.route} icone={item.icone} label={item.label} />
					</Authorizor>
				);
			}
		});
	}
}
