const Block = ({ color, x, y }) => {
	return (
			<div style={{
					position: 'absolute',
					left: `${x}px`,
					top: `${y}px`,
					width: '50px',
					height: '50px',
					backgroundColor: color,
					border: '1px solid black'
			}}>
			</div>
	);
};

export default Block;
