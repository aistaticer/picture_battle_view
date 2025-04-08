import React, { useState, useEffect } from 'react';
import Block from '../components/Block';
import useSmoothMovement from '../hooks/useSmoothMovement.js'
import bulletMovement from '../hooks/bulletMoving/bulletMovement.js'

const Shooting = () => {
	const position = bulletMovement(2);
	const p = useSmoothMovement(5);

	return (
		<div>

				<Block color="red" x={position.x} y={position.y} />
				<Block color="green" x={p.x} y={p.y} />
		</div>
	);
};

export default Shooting;
