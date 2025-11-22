import { useState, useEffect, useRef } from 'react';

function useBulletMovement(speed = 5) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [time, setTime] = useState(0);
    const moving = useRef({ up: true });
    const requestRef = useRef(null);

    // インターバルで `moving.current.up` の状態を切り替える
    useEffect(() => {
        const INTERVAL = 2;
        const interval = setInterval(() => {
            setTime(prevTime => {
                const newTime = (prevTime + 1) % (INTERVAL * 2);
                moving.current.up = newTime < INTERVAL;
                return newTime;
            });
        }, 1000);

        return () => clearInterval(interval); // クリーンアップ
    }, []);

    // requestAnimationFrame を使ったスムーズな移動処理
    useEffect(() => {
        const moveBullet = () => {
            setPosition(prev => ({
                x: prev.x, 
                y: moving.current.up ? prev.y + speed : prev.y - speed
            }));

            requestRef.current = requestAnimationFrame(moveBullet);
        };

        requestRef.current = requestAnimationFrame(moveBullet);
        return () => cancelAnimationFrame(requestRef.current);
    }, [speed]);

    return position;
}

export default useBulletMovement;
