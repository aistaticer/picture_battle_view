import React, { useState } from 'react';
import ThemeForm from '../components/Form';
import {useThemeFetcher} from '../api/themeApi'
import "../sass/gameScreen.sass"

function GameScreen(){
	const { theme, themeHandleClick } = useThemeFetcher();

	return (
		<div className="gameScreenContainer">
			gameScreen画面
      <button onClick={themeHandleClick}>お題を入手</button> 
			<p>お題: {theme}</p>
			<div className='bottomArea'>
				<ThemeForm theme={theme} />
			</div>
		</div>
	);
}

export default GameScreen;
