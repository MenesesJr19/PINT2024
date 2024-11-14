import { EnumConstants } from "data/enum.constants";
import { userProfile } from "data/userProfile";

export class AuthorizorHelper {
	static hasPermission(requiredPermission) {
		const profile = userProfile.getPermission();

		return AuthorizorHelper.verifyPermission(profile, requiredPermission);
	}

	static verifyPermission(userPermission, requiredPermission) {
		if (Array.isArray(userPermission) && Array.isArray(requiredPermission)) {
			return userPermission.some((item) => requiredPermission.includes(item)) || userPermission === EnumConstants.ROLES.ADMIN.ID;
		} else if (Array.isArray(userPermission)) {
			return userPermission.includes(requiredPermission) || userPermission === EnumConstants.ROLES.ADMIN.ID;
		} else if (Array.isArray(requiredPermission)) {
			return requiredPermission.includes(userPermission) || userPermission === EnumConstants.ROLES.ADMIN.ID;
		} else {
			return userPermission === requiredPermission || userPermission === EnumConstants.ROLES.ADMIN.ID;
		}
	}
}
