export const MONTH_NAME = [
	"Janeiro",
	"Fevereiro",
	"Março",
	"Abril",
	"Maio",
	"Junho",
	"Julho",
	"Agosto",
	"Setembro",
	"Outubro",
	"Novembro",
	"Dezembro",
];

export const WEEK_NAME = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sabado", "Domingo"];

export const ORDER_OPTIONS = [
	{ label: "Mais Gostos", value: "1" },
	{ label: "Mais Comentários", value: "2" },
];

export const BUTTON_VARIANTS = Object.freeze({
    PRIMARIO: "primario",
    SECUNDARIO: "secundario",
    SUCESSO: "sucesso",
    PERIGO: "perigo",
});

export const COMMON_TYPES = Object.freeze({
    PRIMARIO: "primary",
    SECUNDARIO: "secondary",
    SUCESSO: "success",
    PERIGO: "danger",
    INVERSO: "inverse",
});

export const COMMON_SIZES = Object.freeze({
    FSm1: "m1",
    FS0: 0,
    FS1: 1,
    FS2: 2,
    FS3: 3,
    FS4: 4,
    FS5: 5,
    FS6: 6,
});

export const NOTIFICATIONS_TYPES = Object.freeze({
    SUCESSO: "success",
    INFO: "info",
    AVISO: "warn",
    ERRO: "error",
});

export const TOPICOS_OPTIONS = [
	{
		id: 1,
		section: "Saúde",
		options: [
			{
				id: 1,
				label: "Outros...",
			},
		],
	},
	{
		id: 2,
		section: "Desporto",
		options: [
			{
				id: 2,
				label: "Ginásio",
			},
			{
				id: 3,
				label: "Atividades ao ar livre",
			},
		],
	},
	{
		id: 3,
		section: "Formação",
		options: [
			{
				id: 4,
				label: "Centros de Formação",
			},
			{
				id: 5,
				label: "Escolas",
			},
			{
				id: 6,
				label: "Infantários",
			},
		],
	},
	{
		id: 4,
		section: "Gastronomia",
		options: [
			{
				id: 7,
				label: "Restaurantes",
			},
			{
				id: 8,
				label: "Shoppings",
			},
		],
	},
	{
		id: 5,
		section: "Habitação",
		options: [
			{
				id: 9,
				label: "Quartos para arrendar",
			},
			{
				id: 10,
				label: "Cassas para alugar",
			},
			{
				id: 11,
				label: "Cassas de férias",
			},
			{
				id: 12,
				label: "Escapadinhas",
			},
		],
	},
	{
		id: 6,
		section: "Transporte",
		options: [
			{
				id: 13,
				label: "Boleias",
			},
			{
				id: 14,
				label: "Transportes públicos",
			},
		],
	},
	{
		id: 7,
		section: "Lazer",
		options: [
			{
				id: 15,
				label: "Cinema",
			},
			{
				id: 16,
				label: "Parque",
			},
		],
	},
];
