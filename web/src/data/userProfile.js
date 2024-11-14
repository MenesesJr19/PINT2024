class UserProfile {
	constructor() {
		this.data = {};
		this.hasFetched = false;
	}

	setData(data) {
		this.data = data;
	}

	getData() {
		return this.data;
	}

	getPermission() {
		return this.data?.perfil;
	}

	getHasFetched() {
		return this.hasFetched;
	}
}

export const userProfile = new UserProfile();
