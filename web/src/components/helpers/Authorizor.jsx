import { userProfile } from "data/userProfile";
import { useEffect, useState } from "react";
import { AuthorizorHelper } from "./AuthorizorHelper";
import { useGetCurrentUser } from "hooks/useGetCurrentUser";

export function Authorizor({ requiredPermission, children }) {
	const [profile, setprofile] = useState(0);
	const [hasPermission, setHasPermission] = useState(false);

	useEffect(() => {
		const userDataFromProfile = userProfile.getPermission();
		setprofile(userDataFromProfile);
	}, []);

	useEffect(() => {
		const check = AuthorizorHelper.verifyPermission(profile, requiredPermission);
		setHasPermission(check);
	}, [profile, requiredPermission]);

	return hasPermission ? children : null;
}

