import React, { useState } from 'react';

function ThemeForm() {
	const [value ,setValue] = useState('');

	const handleChange = (e) => {
    setValue(e.target.value); // 入力された値でステートを更新
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // ページリロードを防ぐ
    alert(`入力値:${value}`);
  };

	return (
    <form onSubmit={handleSubmit}>
      <label>
        入力値：
        <input
          type="text"
          value={value}
          onChange={handleChange}
        />
      </label>
      <button type="submit">送信</button>
    </form>
  );

}

export default ThemeForm;