import { useState, useEffect } from "react";
import { myAxios } from "src/lib/axios";

export function useData(route) {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadData();
	}, []);

	async function loadData() {
		if (!route) return setLoading(false);
		try {
			const response = await myAxios({url: route, method: 'get'});
			const responseData = response.data.data;
			setData(responseData);
			setLoading(false);
		} catch (error) {
			console.error('Error fetching data:', error);
			setLoading(false);
		}
	}
	return [data, loading];
}