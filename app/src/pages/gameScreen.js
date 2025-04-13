import React, { useState, useEffect } from 'react';
import ThemeForm from '../components/Form';
import {useThemeFetcher} from '../api/themeApi'
import "../sass/gameScreen.sass"

function GameScreen(){
	const { theme, themeHandleClick } = useThemeFetcher();
	const [shouldFetchTheme, setShouldFetchTheme] = useState(true);


  useEffect(() => {
    if (shouldFetchTheme) {
			themeHandleClick();
      setShouldFetchTheme(false);
    }
  }, [shouldFetchTheme]);

	return (
		<div className="gameScreenContainer">
			gameScreen画面
			<p>お題: {theme}</p>
			<div className='bottomArea'>
				<ThemeForm theme={theme} onAnswerSubmitted={() => setShouldFetchTheme(true)} />
			</div>
		</div>
	);
}

export default GameScreen;
