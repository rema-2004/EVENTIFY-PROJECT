import { useState, useEffect, useRef } from 'react';

export default function AnimatedCounter({ 
    value = 0, 
    duration = 750, 
    prefix = '', 
    suffix = '', 
    className = '' 
}) {
    const target = typeof value === 'number' ? value : parseInt(value, 10) || 0;
    const [displayVal, setDisplayVal] = useState(0);
    const startValRef = useRef(0);
    const animFrameRef = useRef(null);

    useEffect(() => {
        let startTime = null;
        const from = startValRef.current;
        const to = target;

        if (from === to) {
            setDisplayVal(to);
            return;
        }

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Decelerating cubic easing (smooth stop)
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(from + (to - from) * ease);
            
            setDisplayVal(current);

            if (progress < 1) {
                animFrameRef.current = requestAnimationFrame(step);
            } else {
                startValRef.current = to;
            }
        };

        animFrameRef.current = requestAnimationFrame(step);

        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [target, duration]);

    return (
        <span className={className}>
            {prefix}{displayVal.toLocaleString()}{suffix}
        </span>
    );
}
