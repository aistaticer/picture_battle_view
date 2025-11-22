export const postData = async (url, data) => {
	try {
			const response = await fetch(url, {
					method: 'POST',
					headers: {
							'Content-Type': 'application/json',
					},
					body: JSON.stringify(data),
			});

			if (!response.ok) {
					throw new Error(`エラー: ${response.statusText}`);
			}

			const responseData = await response.json();
			return responseData;
	} catch (error) {
			throw new Error(`通信エラー: ${error.message}`);
	}
};