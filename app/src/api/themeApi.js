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

function useAnswerCheckFetcher() {
  const [data, setData] = useState(null);

  const answerHandleClick = async (e, inputValue) => {
    e.preventDefault(); // フォーム送信のリロード防止
    try {
      const response = await fetch("http://localhost:8080/api/checkAnswer", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answer: inputValue
        })
      });

      const json = await response.json();
			setData(json);
      console.log('点数:', json.reward);

    } catch (e) {
      console.error(e);
    }
  };

  return {
    answerHandleClick,
    data,
  };
}

export { useThemeFetcher,useAnswerCheckFetcher };