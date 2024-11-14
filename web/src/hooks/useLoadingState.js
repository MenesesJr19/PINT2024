import { useState, useMemo } from "react";
import { Loading } from "layouts/loading/Loading";

export const useLoadingState = () => {
	const [isLoading, setisLoading] = useState(false);

	const start = () => {
		setisLoading(true);
	};

	const stop = () => {
		setisLoading(false);
	};

	const create = useMemo(() => {
		return <div>{isLoading && <Loading />}</div>;
	}, [isLoading]);

	return { isLoading, setisLoading, start, stop, create };
};
