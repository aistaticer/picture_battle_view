import { useState, useEffect, useRef } from 'react';

function useSmoothMovement(speed = 5) {
  const [position, setPosition] = useState({ x: 100, y: 0 });
  const moving = useRef({ up: false, down: false, left: false, right: false });

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp': moving.current.up = true; break;
        case 'ArrowDown': moving.current.down = true; break;
        case 'ArrowLeft': moving.current.left = true; break;
        case 'ArrowRight': moving.current.right = true; break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key) {
        case 'ArrowUp': moving.current.up = false; break;
        case 'ArrowDown': moving.current.down = false; break;
        case 'ArrowLeft': moving.current.left = false; break;
        case 'ArrowRight': moving.current.right = false; break;
      }
    };

    const updatePosition = () => {
      setPosition(prev => {
        let newX = prev.x;
        let newY = prev.y;

        if (moving.current.up) newY -= speed;
        if (moving.current.down) newY += speed;
        if (moving.current.left) newX -= speed;
        if (moving.current.right) newX += speed;

        return {
          x: Math.max(0, Math.min(700, newX)),
          y: Math.max(0, Math.min(700, newY))
        };
      });

      requestAnimationFrame(updatePosition);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [speed]);

  return position;
}

export default useSmoothMovement;
