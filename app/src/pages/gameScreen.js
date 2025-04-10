import React, { useState } from 'react';
import ThemeForm from '../components/Form';
import {useThemeFetcher} from '../api/themeApi'

function GameScreen(){
	const { theme, themeHandleClick } = useThemeFetcher();

	return (
		<div>
			<p>gameScreen画面</p>
      <button onClick={themeHandleClick}>お題を入手</button> 
			<p>お題: {theme}</p>   
			<ThemeForm />
		</div>
	);
}

export default GameScreen;
