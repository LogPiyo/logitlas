import { useState, useEffect } from 'react';

export default function Element({
    theoremId,
    theoremName,
    dependencies,
    onPositionChange,
    initialX,
    initialY,
}: {
    theoremId: number;
    theoremName: string;
    dependencies: number[];
    onPositionChange: (id: number, pos: { x: number; y: number }) => void;
    initialX: number;
    initialY: number;
}) {
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);

    const width = 150;
    const height = 80;

    const getCenter = (pos: { x: number; y: number }) => ({
        x: pos.x + width / 2,
        y: pos.y + height / 2,
    });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition((prev) => {
                    const newPos = { x: prev.x + e.movementX, y: prev.y + e.movementY };
                    onPositionChange(theoremId, getCenter(newPos));
                    return newPos;
                });
            }
        };

        const handleMouseUp = () => setIsDragging(false);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    useEffect(() => {
        onPositionChange(theoremId, getCenter(position));
    }, [position]);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation(); // 親のドラッグを止める
        setIsDragging(true);
    };

    return (
        <div
            id={`element-${theoremId}`}
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                width,
                height,
                border: '2px solid white',
                borderRadius: '8px',
                padding: '8px',
                backgroundColor: 'black',
                color: 'white',
                cursor: 'move',
                userSelect: 'none',
                zIndex: 1000,
            }}
            onMouseDown={handleMouseDown}
        >
            <h3>{theoremName}</h3>
            <p>
                {dependencies.length === 0
                    ? 'Axiom'
                    : `Depends on: ${dependencies.join(', ')}`}
            </p>
        </div>
    );
}