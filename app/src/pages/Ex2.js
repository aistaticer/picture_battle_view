import React, { useState } from 'react';

function Ex2() {
  const [responseMessage, setResponseMessage] = useState(null);  // レスポンスメッセージを保存するステート
  const [success, setSuccess] = useState(false); // 成功フラグ

  const handleClick = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/data", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Hello from React!' }),  // サーバーに送るデータ
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(true);
        setResponseMessage(data);  // サーバーからのメッセージをステートに保存
      } else {
        setSuccess(false);
        setResponseMessage('エラー: ' + response.statusText);  // エラーメッセージをステートに保存
      }
    } catch (error) {
      setResponseMessage('通信エラー: ' + error.message);  // 通信エラーをステートに保存
    }
  };

  const {theme, themeHandleClick} = ThemeReceive();


  return (
    <div>
      <button onClick={handleClick}>サーバーにデータを送信</button>
 
      {responseMessage && (
        <p style={{ color: success ? 'green' : 'red' }}>
          {success ? '✅ 成功: ' : '❌ 失敗: '} {responseMessage.number}
        </p>
      )}

      <button onClick={themeHandleClick}>お題を入手</button>    
      {theme &&(
        <p>{theme}</p>
      )}
    </div>
  );
}

function ThemeReceive(){
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

export default Ex2;
