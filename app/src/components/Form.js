import React, { useState } from 'react';
import '../sass/form.sass';


function ThemeForm({ theme }) {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`入力値: ${value}`);
  };

  return (
    <form onSubmit={handleSubmit} className='themeForm'>

      <div>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          className="custom-input"
        />
      </div>
    </form>
  );
}

export default ThemeForm;