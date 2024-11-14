import { MONTH_NAME, WEEK_NAME } from "data/data";

export class DateUtils {
	static #padZero = (num) => {
		return num < 10 ? `0${num}` : num;
	};

	static DataCompleta(data = new Date()) {
		const dateObj = new Date(data);
		const dia = DateUtils.#padZero(dateObj.getDate());
		const mes = DateUtils.#padZero(dateObj.getMonth() + 1);
		const hora = DateUtils.#padZero(dateObj.getHours());
		const minuto = DateUtils.#padZero(dateObj.getMinutes());
		const segundo = DateUtils.#padZero(dateObj.getSeconds());

		return {
			data: dateObj,
			ano: dateObj.getFullYear(),
			mesNome: MONTH_NAME[dateObj.getMonth()],
			mes: mes,
			semana: WEEK_NAME[dateObj.getDay()],
			dia: dia,
			hora: hora,
			minuto: minuto,
			segundo: segundo,
		};
	}

	static MesNome_Ano(data) {
		const formatedDate = this.DataCompleta(data);
		return `${formatedDate.mesNome} de ${formatedDate.ano}`;
	}

	static DiffDatas(data1, data2 = new Date()) {
		const dataObj1 = new Date(data1);
		const dataObj2 = new Date(data2);
		const diff = Math.abs(dataObj2 - dataObj1);

		const millInSecond = 1000;
		const millInMinute = millInSecond * 60;
		const millInHour = millInMinute * 60;
		const millInDay = millInHour * 24;
		const millInMonth = millInDay * 30;
		const millInYear = millInDay * 365;

		return {
			ano: Math.floor(diff / millInYear),
			mes: Math.floor(diff / millInMonth),
			dia: Math.floor(diff / millInDay),
			hora: Math.floor(diff / millInHour),
			minuto: Math.floor(diff / millInMinute),
			segundo: Math.floor(diff / millInSecond),
			milisegundo: diff,
		};
	}

	static DataRelativa(date) {
		const dataCriacao = this.DataCompleta(date);
		const diff = this.DiffDatas(date);

		if (diff.ano > 0) return `${dataCriacao.mesNome} de ${dataCriacao.ano}`;
		else if (diff.mes > 0 || diff.dia > 0) return `${dataCriacao.dia} de ${dataCriacao.mesNome}`;
		else if (diff.hora > 0) return `à ${diff.hora}h`;
		else if (diff.minuto > 0) return `à ${diff.minuto}m`;
		else if (diff.segundo > 0) return `à ${diff.segundo}s`;
	}

	static DataNormal(date) {
		const dataCriacao = this.DataCompleta(date);
		return `${dataCriacao.dia}/${dataCriacao.mes}/${dataCriacao.ano} ${dataCriacao.hora}:${dataCriacao.minuto}`;
	}
}
