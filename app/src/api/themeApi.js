import React, { useState } from 'react';

function useThemeFetcher() {
	const [theme, setTheme] = useState(null);

	const themeHandleClick = async () => {
		try{
			const response = await fetch("http://localhost:8080/api/theme", {
			})

			if (response.ok) {
				const data = await response.json();
				setTheme(data.theme);
			} else {
			console.log("通信成功 お題取得失敗");
			}

		} catch(error){
			console.log("お題取得失敗");
		}
	}
	return {
		theme,
		themeHandleClick
	}
	
}

export { useThemeFetcher };