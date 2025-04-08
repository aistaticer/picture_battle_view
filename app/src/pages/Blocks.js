import Block from '../components/Block';
import React, { useState } from 'react';
import { postData } from '../class/api'; 

const Blocks = () => {

	const [number, setNumber] = useState('');
	const [color, setColor] = useState('');


	const handleClick = async () => {
		try {
			const result = await postData('http://localhost:8080/api/data', { key: 'value' });
			setNumber(parseInt(result.number, 10));
			setColor(parseInt(result.color, 10));			
		} catch (error) {
			console.error("例外が発生しました");
		}
	};

	const blocks = Array(9).fill(null); // 9個のブロックを作成

	return (
		
			<div style={{ display: 'flex', flexWrap: 'wrap', width: '320px' }}>
				<button onClick={handleClick}>データ送信</button>
				{blocks.map((_, index) => (
					<Block 
						key={index} 
						color = {number === index ? color : null}
					/>
				))}

			</div>
	);
};
export default Blocks;