export class DateHelpers {
	static getCurrentTime() {
		const date = new Date();
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');
		const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
		return `${hours}:${minutes}:${seconds}.${milliseconds}`;
	}

	static getCurrentDate(date) {
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	}

	static addDays(date, days) {
		const result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	}

	static subtractDays(date, days) {
		return addDays(date, -days);
	}

	static dateDifferenceInDays(date1, date2) {
		const diffTime = Math.abs(date2 - date1);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	}

	static getCompleteCurrentDateAndTime() {
		return new Date();
	}

	static getCurrentISODateAndTime() {
		return new Date().toISOString()
	}

	static addMinutes(min) {
		const result = new Date();
		result.setMinutes(result.getMinutes() + min);
		return result;
	}
}