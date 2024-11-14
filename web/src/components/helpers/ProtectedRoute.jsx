import { userProfile } from "data/userProfile";
import { useEffect, useState } from "react";
import { AuthorizorHelper } from "./AuthorizorHelper";
import { NotFound } from "layouts/errors/NotFound";

export function ProtectedRoute({ requiredPermission, element }) {
	const [profile, setprofile] = useState(0);
	const [hasPermission, setHasPermission] = useState(false);

	useEffect(() => {
		const userDataFromProfile = userProfile.getPermission();
		setprofile(userDataFromProfile);
	}, []);

	useEffect(() => {
		if (!profile || profile === 0) {
			setHasPermission(false);
			return;
		}
		const check = AuthorizorHelper.verifyPermission(profile, requiredPermission);
		setHasPermission(check);
	}, [profile, requiredPermission]);

	return hasPermission  ? element : <NotFound/>;
}
