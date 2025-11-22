import React, { useState } from 'react';
import '../sass/form.sass';
import { useThemeFetcher,useAnswerCheckFetcher } from '../api/themeApi';

function ThemeForm({ theme, onAnswerSubmitted}) {
  console.log("ThemeForm");
  
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const { answerHandleClick } = useAnswerCheckFetcher();

  const handleSubmit = (e) => {
    answerHandleClick(e, value);
    setValue(''); 
    onAnswerSubmitted();
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